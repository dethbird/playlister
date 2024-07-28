import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    getSpotifyPlaylists,
    selectCurrentPage,
    selectdDialogIsOpen,
    selectStatus,
    toggleDialog
} from './spotifyPlaylistsSlice';
import './SpotifyPlaylists.module.scss';

import { SpotifyPlaylistsListNav } from './SpotifyPlaylistsListNav';
import { SpotifyPlaylistItem } from './SpotifyPlaylistItem';


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

        if (['pending', 'idle'].includes(status) && !currentPage) {
            return <div aria-busy="true"></div>;
        }

        const userPlaylists = currentPage.items.filter(item => {
            return item.owner.id == spotifyUser.id;
        });

        return userPlaylists.map(item => {
            return <SpotifyPlaylistItem playlist={item} />;
        })
    }

    return (
        <dialog open={dialogIsOpen} className='SpotifyPlaylistsList'>
            <article>
                <header>
                    <button aria-label="Close" rel="prev" onClick={() => { dispatch(toggleDialog()) }}></button>
                    <p></p>
                </header>
                <SpotifyPlaylistsListNav />
                <div>{renderItems()}</div>
            </article>
        </dialog>
    );
}
