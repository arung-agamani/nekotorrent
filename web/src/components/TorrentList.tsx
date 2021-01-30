import React,{ useState, useEffect } from 'react'
import axios from 'axios'

import Typography from '@material-ui/core/Typography';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { AxiosTorrentAll, ITorrent } from '../interfaces';
import { Paper } from '@material-ui/core';

const emptyTorrent: ITorrent = null;

const TorrentList = () => {
    const [torrents, setTorrents] = useState<ITorrent[]>([emptyTorrent]);
    const [isFetching, setIsFetching] = useState(true)
    useEffect(() => {
        const fetchTorrents = async () => {
            try {
                const { data: res } = await axios.get('/torrent/allTorrents')
                setTorrents(res.data);
                setIsFetching(false);
            } catch (err) {
                alert('error on fetching all torrents')
            }
        }
        fetchTorrents();
        setInterval(() => {
            fetchTorrents();
        }, 10000)
    }, []);
    if (isFetching) return null;
    return (
        <div>
            <Typography variant="h3">Active Torrent Listing on NekoTorrent Server</Typography>
            {torrents.map(torrent => {
                return (<Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{torrent.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Paper key={torrent.infoHash}>
                            <Typography variant="subtitle1">Infohash: {torrent.infoHash}, Last updated: {new Date().toLocaleString()}</Typography>
                            <Typography variant="subtitle1">IsDone: {torrent.stats.isDone ? 'Yes' : 'False'}</Typography>
                            <Typography variant="subtitle1">Downloaded: {torrent.stats.downloaded}</Typography>
                            <Typography variant="subtitle1">Download Speed: {torrent.stats.downloadSpeed}</Typography>
                            <Typography variant="subtitle1">Uploaded: {torrent.stats.uploaded}</Typography>
                            <Typography variant="subtitle1">Upload Speed: {torrent.stats.uploadSpeed}</Typography>
                        </Paper>
                    </AccordionDetails>
                </Accordion>)
            })}
        </div>
    )
}

export default TorrentList
