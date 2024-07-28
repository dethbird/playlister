import React from 'react';
import { useDispatch } from 'react-redux';
import {
    addSpotifyPlaylistToManaged,
} from './spotifyPlaylistsSlice';

export function SpotifyPlaylistItem({ playlist }) {

    const dispatch = useDispatch();

    return (
        <article className='SpotifyPlaylistItem row'>
            <div className='col-xs-2'>
                <img src={playlist.images[1] ? playlist.images[1].url : playlist.images[0].url} />
            </div>
            <div className='PlaylistDetails col-xs-7'>
                <div><h4><a href={playlist.uri} target='_blank'>{playlist.name}</a></h4></div>
                <div>{playlist.description}</div>
                <div>{playlist.tracks.total} tracks</div>
            </div>
            <div className='ManageButton col-xs-3'>
                <button
                    className='outline'
                    onClick={() => {
                        dispatch(addSpotifyPlaylistToManaged(playlist.id))
                    }}
                >Add to Managed Playlists</button>
            </div>
        </article>
    );
}

