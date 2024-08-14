import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, getContrastColor, Modal, Title } from '@mantine/core';
import {
    getSpotifyPlaylists,
    selectCurrentPage,
    selectdDialogIsOpen,
    selectStatus,
    toggleDialog
} from './spotifyPlaylistsSlice';

import { SpotifyPlaylistsPagination } from './SpotifyPlaylistsPagination';
import { SpotifyPlaylistItem } from './SpotifyPlaylistItem';


export function SpotifyPlaylists({ spotifyUser }) {

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
        if (['pending', 'idle'].includes(status) && !currentPage) {
            return <div role='alert' aria-busy="true"></div>;
        }

        const userPlaylists = currentPage.items.filter(item => {
            return item.owner.id === spotifyUser.id;
        });

        return userPlaylists.map(item => {
            return <SpotifyPlaylistItem playlist={item} key={item.id}/>;
        })
    }

    return (
        <Modal
            opened={dialogIsOpen}
            onClose={() => { dispatch(toggleDialog()) }}
            title='Your Spotify playlists'
            padding='xl'
            fullScreen
        >
            <Container>
                <SpotifyPlaylistsPagination />
                <div>{renderItems()}</div>
                <SpotifyPlaylistsPagination />
            </Container>
        </Modal>
    );
}
