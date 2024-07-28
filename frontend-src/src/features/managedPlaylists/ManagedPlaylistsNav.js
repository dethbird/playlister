import React from 'react';
import { useDispatch } from 'react-redux';
import {
    toggleDialog,
} from '../spotifyPlaylists/spotifyPlaylistsSlice';

export function ManagedPlaylistsNav() {

    const dispatch = useDispatch();

    return (
        <div className='ManagedPlaylistsNav'>
            <div><button onClick={() => dispatch(toggleDialog())} >Add a playlist to manage</button></div>
            <div><button>Activate all</button></div>
            <div><button>Dectivate all</button></div>
            <div><button>Invert Active</button></div>
            <div><button>Add track to active</button></div>
            <div><button>Remove track from active</button></div>
        </div>
    );
}
