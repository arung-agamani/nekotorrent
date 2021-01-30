import React, { useRef } from 'react'
import axios from 'axios'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const AddTorrent = () => {
    const addtorrentRef = useRef<HTMLInputElement>(null)
    const addTorrent = () => {
        if (addtorrentRef) {
            try {
                axios.post('/torrent/add', {
                    link: addtorrentRef.current.value
                })
            } catch (err) {
                alert(err)
            }
        }
        
    }
    return (
        <div style={{display: 'flex'}}>
            <TextField style={{flexGrow: 1}} id="add-torrent" variant="outlined" label="Add Torrent" inputRef={addtorrentRef} />
            {/* <button onClick={() => addTorrent()}>Add Torrent</button> */}
            <Button variant="outlined" color="primary" onClick={() => addTorrent()}>Add Torrent</Button>
        </div>
    )
}

export default AddTorrent
