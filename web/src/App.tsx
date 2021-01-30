import React from 'react'

import { createStyles, Theme, makeStyles,
    createMuiTheme,
    ThemeProvider
} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import UserProvider from './context/userContext';
import TorrentList from './components/TorrentList'
import AddTorrent from './components/AddTorrent';
import RssList from './components/Nyaa/RssList';

import Sidebar from './components/Sidebar/Drawer'
import Divider from '@material-ui/core/Divider';

const fontTheme = createMuiTheme({
    typography: {
        fontFamily: [
            'Comic Sans MS', 'Comic Sans', 'cursive'
        ].join(',')
    }
})

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }),
);

const App = () => {
    const classes = useStyles()
    return (
        <UserProvider>
            <ThemeProvider theme={fontTheme}>
                <div className={classes.root}>
                    <Sidebar />
                    <main className={classes.content}>
                        <Typography variant="h3">NekoTorrent, nyaa!</Typography>
                        <Typography variant="subtitle1">A weird seedbox server for seeding selected torrents from nyaa.si</Typography>
                        <AddTorrent />
                        <RssList />
                        <Divider />
                        <TorrentList />
                    </main>
                </div>
            </ThemeProvider>
            
        </UserProvider>
    )
}

export default App
