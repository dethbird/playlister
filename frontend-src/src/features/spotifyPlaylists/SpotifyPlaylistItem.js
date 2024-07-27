/**
 * This is basically a container that manages the open and closed state of the paginated list of a user's spotify playlists
 */
import React from 'react';

export function SpotifyPlaylistItem({ playlist }) {

    return (
        <article className='SpotifyPlaylistItem row'>
            <div className='col-xs-2'>
                <img src={ playlist.images[1] ? playlist.images[1].url : playlist.images[0].url } />
            </div>
            <div className='PlaylistDetails col-xs-7'>
                <div><h4>{playlist.name}</h4></div>
                <div>{playlist.description}</div>
                <div>{playlist.tracks.total} tracks</div>
            </div>
            <div className='ManageButton col-xs-3'>
                <button className='outline'>Add to Managed Playlists</button>
            </div>
        </article>
    );
}

