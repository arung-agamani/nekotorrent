import React, { useState, useEffect } from 'react'
import axios from 'axios'

//loading
import LinearProgress from '@material-ui/core/LinearProgress';
// accordion
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
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

import { nyaaItem } from '../../../../nyaa/interfaces';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    backgroundBlue: {
        backgroundColor: '#f2f7ff'
    },
    backgroundRed: {
        backgroundColor: '#fff2f2'
    },
    backgroundGrey: {
        backgroundColor: '#fbfbfb'
    }
  }),
);


interface NyaaRssResponse {
    status: string,
    data: Record<string, nyaaItem[]>
}

const RssList = () => {
    const [nyaaRss, setNyaaRss] = useState<Record<string, any>>(null);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const classes = useStyles()

    const fetchNyaaRss = async () => {
        try {
            const { data: res } = await axios.get<NyaaRssResponse>('/nyaa/rss'); 
            setNyaaRss(res.data);
            setIsFetching(false)
        } catch (err) {
            alert('Fetch nyaa rss failed');
        }
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Link copied!')
        })
    }

    useEffect(() => {
        fetchNyaaRss();
    }, [])

    if (isFetching) return <LinearProgress />;
    return (
        <div>
            {Object.keys(nyaaRss).map((categoryName, index) => {
                const categoryItems = nyaaRss[categoryName];
                return (
                    <Accordion className={index % 2 === 0 ? classes.backgroundBlue : classes.backgroundRed} key={categoryName}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        >
                        <Typography className={classes.heading}>{categoryName}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Seeders</TableCell>
                                            <TableCell>Leechers</TableCell>
                                            <TableCell>Size</TableCell>
                                            <TableCell>Torrent</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {categoryItems.map((item: nyaaItem, index: number) => {
                                            return (
                                                <TableRow className={index % 2 === 0 ? classes.backgroundGrey : ''} key={item.infoHash}>
                                                    <TableCell>{item.title}</TableCell>
                                                    <TableCell>{item.seeders}</TableCell>
                                                    <TableCell>{item.leechers}</TableCell>
                                                    <TableCell>{item.size}</TableCell>
                                                    <TableCell>
                                                        <Link href={item.link} onClick={(e) => {
                                                                e.preventDefault()
                                                                copyToClipboard(item.link)
                                                            }}>
                                                            Link
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionDetails>
                    </Accordion>
                )
            })}
        </div>
    )
}

export default RssList
