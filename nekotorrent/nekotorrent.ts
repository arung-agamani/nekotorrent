import WebTorrent from 'webtorrent';
import ut_metadata from 'ut_metadata';
import ut_pex from 'ut_pex';
import path from 'path';
import fs from 'fs-extra'
import rimraf from 'rimraf'
import { TorrentTransmissionData } from './interfaces';

import { PrismaClient } from '@prisma/client';

const outputDir = path.resolve(__dirname, 'out');

const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const rmdir = promisify(fs.rmdir);
const unlink = promisify(fs.unlink);

const rmdirs = async function rmdirs(dir) {
  let entries = await readdir(dir, { withFileTypes: true });
  await Promise.all(entries.map(entry => {
    let fullPath = path.join(dir, entry.name);
    console.log(fullPath)
    return entry.isDirectory() ? rmdirs(fullPath) : unlink(fullPath);
  }));
  await rmdir(dir);
};

const deleteFolderRecursive = function (directoryPath) {
    if (fs.existsSync(directoryPath)) {
        if (fs.lstatSync(directoryPath).isDirectory()) {
            fs.readdirSync(directoryPath).forEach((file, index) => {
                const curPath = path.join(directoryPath, file);
                if (fs.lstatSync(curPath).isDirectory()) {
                 // recurse
                  deleteFolderRecursive(curPath);
                } else {
                  // delete file
                  fs.unlinkSync(curPath);
                }
              });
            fs.rmdirSync(directoryPath);
        } else {
            fs.unlinkSync(directoryPath);
        }        
      }
    };

class NekoTorrent {
    public client: WebTorrent.Instance;
    public db: PrismaClient;
    public isLoaded: boolean;

    constructor() {
        const torrentClient = new WebTorrent()
        this.db = new PrismaClient();
        torrentClient.on('torrent', (torr) => {
            console.log(`${torr.name} ontorrent emitted`)
            torr.on('ready', () => {
                console.log(`${torr.name} is ready`);
            })
            torr.on('done', () => {
                console.log(`${torr.name} is finished\nNow seeding...`);
                torr.resume();
                setTimeout(() => {
                    console.log(`Torrent ${torr.infoHash} has expired. Deleting...`)
                    this.deleteTorrent(torr.infoHash)
                }, 
                24*60*60*1000);
            })
            torr.on('wire', (wire, addr) => {
                wire.use(ut_metadata());
                wire.use(ut_pex());
            })
            
        })
        this.client = torrentClient;
        this.isLoaded = false;
        console.log('NekoTorrent instantiated');
        console.log(`Output dir goes to : ${outputDir}`)
    }

    loadTorrent() {
        const tempPath = path.resolve(__dirname, 'temp')
        const tempStat = fs.statSync(tempPath)
        if (tempStat && tempStat.isDirectory()) {
            const files = fs.readdirSync(tempPath);
            for (const file of files) {
                this.addTorrent(path.resolve(tempPath, file));
            }
        }
        this.isLoaded = true;
    }

    async addTorrent(torrentId: any): Promise<boolean> {
        const allTorrents = this.client.torrents
        let totalSize = 0;
        for (const torrent of allTorrents) {
            totalSize += torrent.length
        }
        return new Promise<boolean>((resolve, reject) => {
            this.client.add(torrentId, { path: outputDir }, (torr) => {
                torr.pause()
                console.log(`Loaded "${torr.name}"`);
                if (torr.length + totalSize > 1024*1024*1024) {
                    console.log(`Aborting "${torr.name}. Size exceeds limit`)
                        this.deleteTorrent(torrentId);
                        torr.destroy()
                    reject(false)
                    return
                }
                const torrentFilepath = path.resolve(__dirname, 'temp', torr.name + '.torrent');
                const tempStat = fs.statSync(path.resolve(__dirname, 'temp'))
                if (!tempStat || !tempStat.isDirectory()) {
                    fs.mkdirSync(path.resolve(__dirname, 'temp'));
                }
                try {
                    const fileStat = fs.statSync(torrentFilepath);
                    if (!fileStat) {
                        console.log(`${torr.name}.torrent file exists. Skipped writing.`)
                    }
                } catch (err) {
                    const torrentFilestream = fs.createWriteStream(torrentFilepath);
                    torrentFilestream.write(torr.torrentFile);
                    if (!this.db.torrent.findFirst({ where: {
                        infohash: torr.infoHash
                    }})) {
                        const dbObj = {
                            name: torr.name,
                            filepath: torrentFilepath,
                            infohash: torr.infoHash
                        }
                        this.db.torrent.create({
                            data: dbObj
                        });
                    }
                    
                    console.log('Torrent file saved');
                }
                torr.resume()
                resolve(true)
            });
        })
        
    }

    getTorrent(torrentId: any): WebTorrent.Torrent | void {
        return this.client.get(torrentId);
    }

    getAllTorrents() {
        return this.client.torrents;
    }

    pauseTorrent(torrentId: any): void {
        const torr = this.getTorrent(torrentId) as WebTorrent.Torrent;
        if (torr) {
            torr.pause();
        }
    }
    resumeTorrent(torrentId: any): void {
        const torr = this.getTorrent(torrentId) as WebTorrent.Torrent;
        if (torr) {
            torr.resume();
        }
    }
    deleteTorrent(torrentId: any): void{
        const torr = this.getTorrent(torrentId) as WebTorrent.Torrent;
        if (torr) {
            const dirPath = path.resolve(__dirname, 'out', torr.name)
            const torrPath = path.resolve(__dirname, 'temp', torr.name + '.torrent')
            try {
                this.client.remove(torrentId, {}, (err) => {
                    if (err) {
                        console.error(`Error when deleting torrent with hash ${torrentId}: ${err}`)
                        return
                    }
                    deleteFolderRecursive(dirPath);                
                    rimraf.sync(torrPath)
                    console.log(`Deleted torrent with hash ${torrentId}`)
                    return
                });
            } catch (err) {
                if (err) {
                    console.error(`Error when deleting torrent with hash ${torrentId}: ${err}`)
                    return
                }
            }
            // fs.remove(dirPath, (err) => { // deprecated starting from node v14.4
            //     if (err) {
            //         console.error(`Error when deleting torrent with hash ${torrentId}: ${err}`)
            //         return
            //     }
            //     this.client.remove(torrentId);
            //     rimraf.sync(torrPath)
            //     console.log(`Deleted torrent with hash ${torrentId}`)
                
            //     return
            // })
            // for (const file of torr.files) {
            //     console.log('unlink to ' + file.path)
            //     fs.unlinkSync(path.resolve(__dirname, 'out', file.path))
            // }
            // rmdirs(dirPath).then(() => {
            //     this.client.remove(torrentId);
            //     rimraf.sync(torrPath)
            //     console.log(`Deleted torrent with hash ${torrentId}`)
            //     return
            // }).catch((err) => {
            //     if (err) {
            //         console.error(`Error when deleting torrent with hash ${torrentId}: ${err}`)
            //         return
            //     }
            // })
        }
    }
    getTransmissionData(torrentId: any) {
        const torr = this.getTorrent(torrentId) as WebTorrent.Torrent;
        if (torr) {
            const res: TorrentTransmissionData = {
                isDone: torr.done || false,
                downloadSpeed: torr.downloadSpeed || 0,
                downloaded: torr.downloaded || 0,
                uploadSpeed: torr.uploadSpeed || 0,
                uploaded: torr.uploaded || 0,
                progress: torr.progress || 0,
                size: torr.length || 0,
                seedRatio: torr.ratio || 0
            }
            return res;
        }
        return null;
    }

    getFileList(torrentId: any) {
        const torr = this.getTorrent(torrentId) as WebTorrent.Torrent;
        if (torr) {
            return torr.files
        }
        return null;
    }
}

export default NekoTorrent;