import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getPlaylistMeta,
    selectPlaylistsMeta
} from './managedPlaylistsSlice';

export function ManagedPlaylistItem({ playlist }) {

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
                    <img src={meta.images[1] ? meta.images[1].url : meta.images[0].url} className='ManagedPlaylistItemImage'/>
                </div>
                <div className='PlaylistDetails col-xs-7'>
                    <h3>{meta.name}</h3>
                    <div>{meta.tracks.total} tracks</div>
                </div>
                <div className='col-xs-3'>
                    <button className='outline'>Remove</button>
                </div>
            </>
        )
    }

    return (
        <article className='ManagedPlaylistItem row'>
            { renderItem() }
        </article>
    );
}

