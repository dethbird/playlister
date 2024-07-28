import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getPlaylistMeta,
    removeManagedPlaylist,
    selectPlaylistsMeta,
    togglePlaylistActive,
    addTrackToPlaylist,
    removeTrackFromPlaylist
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
                <div className='PlaylistDetails col-xs-5'>
                    <h3><a href={meta.uri} target="_blank">{meta.name}</a></h3>
                    <div>{meta.tracks.total} tracks</div>
                </div>
                <div className='col-xs-5'>
                    <button className='outline' onClick={()=>{ dispatch(removeManagedPlaylist(playlist.id))}}>Remove</button>
                    <input
                        name="avtive"
                        type="checkbox"
                        role="switch"
                        checked={playlist.active === 'Y'}
                        onClick={()=>{dispatch(togglePlaylistActive(playlist.id))}}
                    />
                    <button className='outline' onClick={()=>{ dispatch(addTrackToPlaylist(playlist.spotify_playlist_id))}}>Add track</button>
                    <button className='outline' onClick={()=>{ dispatch(removeTrackFromPlaylist(playlist.spotify_playlist_id))}}>Remove track</button>
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

