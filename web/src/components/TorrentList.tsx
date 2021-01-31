import React,{ useState, useEffect } from 'react'
import axios from 'axios'

import Typography from '@material-ui/core/Typography';

import { ITorrent } from '../interfaces';
import TorrentListItem from './TorrentListItem'

const emptyTorrent: ITorrent = null;

const TorrentList = () => {
    const [torrents, setTorrents] = useState<ITorrent[]>([]);
    const [isFetching, setIsFetching] = useState(true)
    useEffect(() => {
        const fetchTorrents = async () => {
            try {
                const { data: res } = await axios.get('/torrent/allTorrents')
                console.log(res)
                if (res.data) setTorrents(res.data);
                setIsFetching(false);
            } catch (err) {
                console.log('Error on data fetching' + err)
                alert(1)
            }
        }
        setIsFetching(true)
        fetchTorrents();
        setInterval(() => {
            fetchTorrents();
        }, 5000)
    }, []);
    if (isFetching) return null;
    return (
        <div>
            <Typography variant="h3">Active Torrent Listing on NekoTorrent Server</Typography>
            {torrents && torrents.map((torrent, idx) => {
                return <TorrentListItem torrent={torrent} idx={idx} key={torrent.infoHash} />
            })}
        </div>
    )
}

export default TorrentList
