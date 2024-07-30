import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getPlaylistMeta,
    selectPlaylistsMeta,
    addFavoritePlaylistToManaged
} from '../managedPlaylists/managedPlaylistsSlice';

export function FavoritePlaylistItem({ playlist }) {

    const playlistMeta = useSelector(selectPlaylistsMeta);
    let meta = null;
    if (playlistMeta) {
        if (playlistMeta[playlist.spotify_playlist_id]) {
            meta = playlistMeta[playlist.spotify_playlist_id];
        }
    }

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPlaylistMeta(playlist.spotify_playlist_id));
    }, [dispatch, playlist]);

    const renderItem = () => {
        if (!meta) {
            return <div aria-busy="true"></div>;
        }
        return (
            <>
                <div className='col-xs-2'>
                    <img alt="Playlist cover" src={meta.images[1] ? meta.images[1].url : meta.images[0].url} className='FavoritePlaylistItemImage' />
                </div>
                <div className='PlaylistDetails col-xs-5'>
                    <h3><a href={meta.uri} target="_blank"  rel="noreferrer">{meta.name}</a></h3>
                    <div>{meta.tracks.total} tracks</div>
                </div>
                <div className='col-xs-5 ManageButton'>
                    <button
                        className='outline'
                        onClick={() => { dispatch(addFavoritePlaylistToManaged(playlist.spotify_playlist_id)) }}
                    >Manage</button>
                </div>
            </>
        )
    }

    return (
        <article className='FavoritePlaylistItem row'>
            {renderItem()}
        </article>
    );
}

