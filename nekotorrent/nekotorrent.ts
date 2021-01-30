import WebTorrent from 'webtorrent';
import ut_metadata from 'ut_metadata';
import ut_pex from 'ut_pex';
import path from 'path';
import fs from 'fs'
import { TorrentTransmissionData } from './interfaces';

import { PrismaClient } from '@prisma/client';

const outputDir = path.resolve(__dirname, 'out');

class NekoTorrent {
    public client: WebTorrent.Instance;
    public db: PrismaClient;
    public isLoaded: boolean;

    constructor() {
        const torrentClient = new WebTorrent()
        this.db = new PrismaClient();
        torrentClient.on('torrent', (torr) => {
            console.log(`${torr.name} ontorrent emitted`)
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
            torr.on('ready', () => {
                console.log(`${torr.name} is ready`);
            })
            torr.on('done', () => {
                console.log(`${torr.name} is finished\nNow seeding...`);
                torr.resume();
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

    addTorrent(torrentId: any) {
        this.client.add(torrentId, { path: outputDir }, (torr) => {
            console.log(`Loaded "${torr.name}"`);
        });
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
    getTransmissionData(torrentId: any) {
        const torr = this.getTorrent(torrentId) as WebTorrent.Torrent;
        if (torr) {
            const res: TorrentTransmissionData = {
                isDone: torr.done,
                downloadSpeed: torr.downloadSpeed,
                downloaded: torr.downloaded,
                uploadSpeed: torr.uploadSpeed,
                uploaded: torr.uploaded,
                progress: torr.progress
            }
            return res;
        }
        return null;
    }
}

export default NekoTorrent;