import React from 'react'

import { createStyles, Theme, makeStyles,
    createMuiTheme,
    ThemeProvider
} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container'

import UserProvider from './context/userContext';
import TorrentList from './components/TorrentList'
import AddTorrent from './components/AddTorrent';
import RssList from './components/Nyaa/RssList';

import Sidebar from './components/Sidebar/Drawer'
import Divider from '@material-ui/core/Divider';

import BackgroundImg from './diona-bg.jpg'

const fontTheme = createMuiTheme({
    typography: {
        fontFamily: [
            'Comic Sans MS', 'Comic Sans', 'cursive'
        ].join(',')
    }
})

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backgroundWrapper: {
        backgroundImage: `url(${BackgroundImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
    },
    root: {
      display: 'flex',      
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
        marginTop: '2rem',
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
                <div className={classes.backgroundWrapper}>
                    <div className={classes.root} style={{
                        backgroundColor: '#fdfdfdf0'
                    }}>
                        {/* <Sidebar /> */}
                        <main className={classes.content}>
                            <Typography variant="h3">NekoTorrent, nyaa!</Typography>
                            <Typography variant="subtitle1">A weird seedbox server for seeding selected torrents from nyaa.si</Typography>
                            <Typography variant="subtitle2">Yes, this thing only accepts nyaa.si torrents. Just fork the repository if you want your own customization</Typography>
                            <AddTorrent />
                            <RssList />
                            <Divider />
                            <TorrentList />
                            <Container style={{
                                display: 'flex',
                                marginTop: 24,
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <Typography variant="h5">2021©Shirayuki Haruka</Typography>
                            </Container>
                        </main>
                    </div>
                    
                </div>
                
            </ThemeProvider>
            
        </UserProvider>
    )
}

export default App
