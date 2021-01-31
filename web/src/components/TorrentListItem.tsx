import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// table
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link'

import { ITorrent } from '../interfaces';

interface TorrentListItemProps {
    torrent: ITorrent,
    idx: number
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    stats: {
        display: 'flex',
        flexDirection: 'row'
    },
    files: {
        display: 'flex',
        flexDirection: 'column'
    },
    backgroundLBlue: {
        backgroundColor: '#f5feff'
    },
    backgroundLGreen: {
        backgroundColor: '#f6fff5'
    }
  }),
);

const toHumanFileSize = (bytes) => {
    const size = bytes as number;
    if (size > 1024*1024*1024) {
        return `${(size/(1024*1024*1024)).toFixed(2)} GB`
    } else if (size > 1024*1024) {
        return `${(size/(1024*1024)).toFixed(2)} MB`
    } else if (size > 1024) {
        return `${(size/(1024)).toFixed(2)} kB`
    } else {
        return `${size} Bytes`
    }
}


const TorrentListItem: React.FC<TorrentListItemProps> = ({ torrent, idx }) => {
    const classes = useStyles()
    const [fileList, setFileList] = useState<Array<any>>(null)
    const [isFetching, setIsFetching] = useState<boolean>(true)
    const [isFetched, setIsFetched] = useState<boolean>(false)

    const fetchFileList = async () => {
        if (isFetched) return
        try {
            const { data: res } = await axios.get(`/torrent/single/${torrent.infoHash}/files`)
            setFileList(res.data)
            setIsFetching(false)
            setIsFetched(true)
        } catch (error) {
            console.log('Error on fetching file list...')
        }
    }
    return (
        <Accordion className={idx % 2 === 0 ? classes.backgroundLBlue : classes.backgroundLGreen}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{torrent.name}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.files}>
                <div className={classes.stats}>
                    <Typography variant="subtitle1">Infohash: {torrent.infoHash}</Typography>
                    <Typography variant="subtitle1">Last updated: {new Date().toLocaleString()}</Typography>
                    <Typography variant="subtitle1">IsDone: {torrent.stats.isDone ? 'Yes' : 'False'}</Typography>
                    <Typography variant="subtitle1">Downloaded: {toHumanFileSize(torrent.stats.downloaded)}</Typography>
                    <Typography variant="subtitle1">Download Speed: {torrent.stats.downloadSpeed}</Typography>
                    <Typography variant="subtitle1">Uploaded: {toHumanFileSize(torrent.stats.uploaded)}</Typography>
                    <Typography variant="subtitle1">Upload Speed: {torrent.stats.uploadSpeed}</Typography>
                </div>
                <Accordion onChange={() => {fetchFileList()}}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>File List</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        { isFetching ? <CircularProgress /> : 
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Filepath</TableCell>
                                        <TableCell>Size</TableCell>
                                        <TableCell>DL Link</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {fileList && fileList.map((file, index) => {
                                    return <TableRow key={index}>
                                        <TableCell>{file.path}</TableCell>
                                        <TableCell>{toHumanFileSize(file.size)}</TableCell>
                                        <TableCell>
                                            <Link href={`/nekotorrent/${file.path}`}>
                                                Link
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                })}
                                </TableBody>
                            </Table>
                        </TableContainer>}                        
                    </AccordionDetails>
                </Accordion>
            </AccordionDetails>
        </Accordion>
    )
}

export default TorrentListItem
