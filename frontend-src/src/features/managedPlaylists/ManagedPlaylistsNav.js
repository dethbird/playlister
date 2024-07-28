import React from 'react';
import { useDispatch } from 'react-redux';
import {
    toggleDialog,
} from '../spotifyPlaylists/spotifyPlaylistsSlice';
import {
    invertActiveAll,
    setActiveAll
} from '../managedPlaylists/managedPlaylistsSlice';

export function ManagedPlaylistsNav() {

    const dispatch = useDispatch();

    return (
        <div className='ManagedPlaylistsNav'>
            <div><button onClick={() => dispatch(toggleDialog())} >Add a playlist to manage</button></div>
            <div><button onClick={() => dispatch(setActiveAll('Y'))} >Activate all</button></div>
            <div><button onClick={() => dispatch(setActiveAll('N'))} >Dectivate all</button></div>
            <div><button onClick={() => dispatch(invertActiveAll())} >Invert Active</button></div>
            <div><button>Add track to active</button></div>
            <div><button>Remove track from active</button></div>
        </div>
    );
}
