import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    getSpotifyPlaylists,
    selectCurrentPage,
    selectdDialogIsOpen,
    selectStatus
} from './spotifyPlaylistsSlice';

import { SpotifyPlaylistsListNav } from './SpotifyPlaylistsListNav';


export function SpotifyPlaylistsList() {

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

    if (status === 'rejected') {
        return <div>Error...</div>;
    }

    if (['pending', 'idle'].includes(status)) {
        return <div>Loading...</div>;
    }

    const renderItems = () => {
        return currentPage.items.map(item => {
            return (<li>
                <div>
                    <div>{item.id}</div>
                    <div>{item.name}</div>
                    <div>{item.tracks.total} tracks</div>
                </div>
            </li>);
        })
    }

    return (
        <div style={{ display: dialogIsOpen ? 'block' : 'none' }}>
            <SpotifyPlaylistsListNav />
            <ul>{ renderItems() }</ul>
        </div>
    );
}
