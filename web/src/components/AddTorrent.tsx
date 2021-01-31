import React, { useRef, useState } from 'react'
import axios from 'axios'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
// snackbar
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
// dialog
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const AddTorrent = () => {
    const addtorrentRef = useRef<HTMLInputElement>(null)
    const passTorrentRef = useRef<HTMLInputElement>(null)
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false)

    const handleClickOpen = () => {
    setOpen(true);
    };

    const handleClose = () => {
    setOpen(false);
    };
    const handleSnackbarClose = () => {
        setSnackbarOpen(false)
    }
    const addTorrent = async () => {
        if (addtorrentRef && passTorrentRef) {
            try {
                await axios.post('/torrent/add', {
                    link: addtorrentRef.current.value,
                    pass: passTorrentRef.current.value
                })
                setSnackbarOpen(true)
            } catch (err) {
                if (err.response.status === 507) {
                    alert('Insufficient storage. Your torrent file is too b-big.. ////////')
                } else if (err.response.status === 400) {
                    alert('Bad request. Only accepting from nyaa.si')
                }
            }
        }
        
    }
    return (
        <div style={{display: 'flex'}}>
            <TextField style={{flexGrow: 1}} id="add-torrent" variant="outlined" label="Add Torrent" inputRef={addtorrentRef} />
            {/* <button onClick={() => addTorrent()}>Add Torrent</button> */}
            <Button variant="outlined" color="primary" onClick={() => handleClickOpen()}>Add Torrent</Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Meow?</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    To seed this torrent, please enter the secret bar menu, meow!
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Nyaa?"
                    type="password"
                    fullWidth
                    inputRef={passTorrentRef}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => { addTorrent(); handleClose();}} color="primary">
                    Nyaa!
                </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
                }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message="Torrent Added"
                action={
                <React.Fragment>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
                    <CloseIcon fontSize="small" />
                    </IconButton>
                </React.Fragment>
                }
            />
        </div>
    )
}

export default AddTorrent
