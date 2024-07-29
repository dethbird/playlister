import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectCurrentTrack
} from '../player/playerSlice';
import {
    toggleDialog,
} from '../spotifyPlaylists/spotifyPlaylistsSlice';
import {
    invertActiveAll,
    setActiveAll,
    addTrackToActive,
    removeTrackFromActive,
    toggleFavoriteDialog
} from '../managedPlaylists/managedPlaylistsSlice';

export function ManagedPlaylistsNav() {

    const currentTrack = useSelector(selectCurrentTrack);

    const dispatch = useDispatch();

    return (
        <div className='ManagedPlaylistsNav'>
            <div><button onClick={() => dispatch(toggleDialog())} >Add a playlist to manage</button></div>
            <div><button onClick={() => dispatch(toggleFavoriteDialog())} >Favorite playlists</button></div>
            <div><button onClick={() => dispatch(setActiveAll('Y'))} >Activate all</button></div>
            <div><button onClick={() => dispatch(setActiveAll('N'))} >Dectivate all</button></div>
            <div><button onClick={() => dispatch(invertActiveAll())} >Invert Active</button></div>
            <div><button onClick={currentTrack ? () => dispatch(addTrackToActive(currentTrack.item.uri)) : null} disabled={!currentTrack}>Add track to active</button></div>
            <div><button onClick={currentTrack ? () => dispatch(removeTrackFromActive(currentTrack.item.uri)) : null} disabled={!currentTrack}>Remove track from active</button></div>
        </div>
    );
}
