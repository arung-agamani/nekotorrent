import { Router, Request, Response } from 'express'
import bodyParser from 'body-parser'
// import { PrismaClient } from '@prisma/client';
// import { jsonMessage } from '../../web/src/interfaces';
import * as expressObject from '../express'
import NekoTorrent from '../../nekotorrent/nekotorrent'

const torrentRouter = Router();
// const prisma = new PrismaClient();
const torrentClient = new NekoTorrent()
torrentClient.loadTorrent()

torrentRouter.get('/allTorrents', async (req: Request, res: Response) => {
    const torrents = torrentClient.getAllTorrents();
    const data = [];
    for (const torrent of torrents) {
        const obj = {
            name: torrent.name,
            infoHash: torrent.infoHash,
            stats: torrentClient.getTransmissionData(torrent.infoHash)
        }
        data.push(obj);
    }
    res.json({
        status: "success",
        data
    })
});

torrentRouter.post('/resume', (req: Request, res: Response) => {
    const infoHash = req.body.infoHash
    if (!infoHash) {
        res.status(400).json({
            status: 'failed',
            message: 'bad request'
        })
        return
    }
    const torrent = torrentClient.getTorrent(infoHash);
    if (torrent) {
        torrent.resume()
        return
    }
    res.status(404).json({
        status: 'failed',
        message: 'torrent not found'
    })
})

torrentRouter.post('/pause', (req: Request, res: Response) => {
    const infoHash = req.body.infoHash
    if (!infoHash) {
        res.status(400).json({
            status: 'failed',
            message: 'bad request'
        })
        return
    }
    const torrent = torrentClient.getTorrent(infoHash);
    if (torrent) {
        torrent.pause()
        return
    }
    res.status(404).json({
        status: 'failed',
        message: 'torrent not found'
    })
})

torrentRouter.get('/single/:infoHash/stats', (req: Request, res: Response) => {
    const infoHash = req.params.infoHash
    const torrent = torrentClient.getTransmissionData(infoHash)
    if (torrent) {
        res.json(torrent)
        return
    }
    res.status(404).json({
        status: 'failed',
        message: 'torrent not found'
    })
})

torrentRouter.post('/add', (req: Request, res: Response) => {
    const torrentLink = req.body.link as string;
    console.log(torrentLink);
    if (torrentLink && torrentLink.startsWith('https://nyaa.si/download/')) {
        torrentClient.addTorrent(torrentLink);
        res.json({
            status: 'success',
            message: 'success adding torrent'
        })
        return
    }
    res.status(400).json({
        status: 'failed',
        message: 'invalid torrent link'
    })
})

torrentRouter.get('/single/:infoHash/files', (req: Request, res: Response) => {
    const infoHash = req.params.infoHash
    const torrent = torrentClient.getTorrent(infoHash)
    if (torrent) {
        const retval = {
            status: 'success',
            data: torrent.files
        }
        return
    }
    res.status(404).json({
        status: 'failed',
        message: 'torrent not found'
    })
})

// make route for fetching result

export default torrentRouter