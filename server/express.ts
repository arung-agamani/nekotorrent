import express, { Express } from 'express';
import bodyParser from 'body-parser'
import path from 'path'
import torrentRoutes from './routes/torrent';
import nyaaRoutes from './routes/nyaa';

let server: Express;
// let torrentClient: NekoTorrent;
export function getServerInstance(): Express {
    if (!server) {
        server = express();
    }
    return server;
}

// export function getTorrentClientInstance(): NekoTorrent {
//     if (!torrentClient) {
//         torrentClient = new NekoTorrent();
//         torrentClient.loadTorrent();
//     }
//     return torrentClient;
// }

export function initialize(server: Express): void {
    server.use(bodyParser.json())
    server.use(bodyParser.urlencoded({ extended: true }))
    server.use(express.static(path.resolve(__dirname, '..', 'dist')));
    server.use('/torrent', torrentRoutes);
    server.use('/nyaa', nyaaRoutes);

    server.listen(14045, () => {
        console.log('Server has started at 14045');
        console.log('http://localhost:14045/');
    })
}

export default null;
