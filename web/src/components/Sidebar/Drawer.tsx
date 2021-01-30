import React from 'react'
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import { Divider, List, ListItem, ListItemText } from '@material-ui/core';

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
    },
  }),
);

const drawer = () => {
    const classes = useStyles()
    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper
            }}
            anchor="left"
        >
            <Divider />
            <List>
                {['Finished', 'Seeding', 'Unfinished'].map((text, index) => {
                    return (
                        <ListItem key={text}>
                            <ListItemText primary={text} />
                        </ListItem>
                    )
                })}
            </List>
        </Drawer>
    )
}

export default drawer