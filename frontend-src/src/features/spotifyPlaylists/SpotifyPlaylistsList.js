import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    getSpotifyPlaylists,
    selectCurrentPage,
    selectdDialogIsOpen,
    selectStatus
} from './spotifyPlaylistsSlice';
import './SpotifyPlaylists.module.scss';

import { SpotifyPlaylistsListNav } from './SpotifyPlaylistsListNav';


export function SpotifyPlaylistsList({ spotifyUser }) {

    const currentPage = useSelector(selectCurrentPage);
    const dialogIsOpen = useSelector(selectdDialogIsOpen);
    const status = useSelector(selectStatus);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSpotifyPlaylists({ limit: 25, offset: 0 }));
    }, [dispatch]);

    if (!dialogIsOpen) {
        return null;
    }

    const renderItems = () => {

        if (status === 'rejected') {
            return <div>Error...</div>;
        }

        if (['pending', 'idle'].includes(status)) {
            return <div>Loading...</div>;
        }

        const userPlaylists = currentPage.items.filter(item => {
            return item.owner.id == spotifyUser.id;
        });

        return userPlaylists.map(item => {
            return (
                <article className='SpotifyPlaylistItem'>
                    <div>{item.id}</div>
                    <div>{item.name}</div>
                    <div>{item.tracks.total} tracks</div>
                </article>);
        })
    }

    return (
        <div style={{ display: dialogIsOpen ? 'block' : 'none' }} className='SpotifyPlaylistsList'>
            <SpotifyPlaylistsListNav />
            <div>{renderItems()}</div>
        </div>
    );
}
