import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Modal, Title } from '@mantine/core';
import {
    getFavoritePlaylists,
    selectFavoriteStatus,
    selectFavoritePlaylists,
    selectFavoriteDialogIsOpen,
    toggleFavoriteDialog
} from '../managedPlaylists/managedPlaylistsSlice';



import {FavoritePlaylistItem } from './FavoritePlaylistItem';


export function FavoritePlaylists() {

    const favoritePlaylists = useSelector(selectFavoritePlaylists);
    const favoriteDialogIsOpen = useSelector(selectFavoriteDialogIsOpen);
    const favoriteStatus = useSelector(selectFavoriteStatus);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getFavoritePlaylists());
    }, [dispatch]);

    if (!favoriteDialogIsOpen) {
        return null;
    }

    const renderItems = () => {

        if (favoriteStatus === 'rejected') {
            return <div>Error...</div>;
        }

        if (['pending', 'idle'].includes(favoriteStatus) && !favoritePlaylists) {
            return <div aria-busy="true"></div>;
        }

        return favoritePlaylists.map(item => {
            return <FavoritePlaylistItem playlist={item} />;
        })
    }

    return (
        <Modal
            opened={favoriteDialogIsOpen}
            onClose={() => { dispatch(toggleFavoriteDialog()) }}
            title={<Title order={4}>Your favorited playlists</Title>}
            padding='xl'
            fullScreen
        >
            <Container>{renderItems()}</Container>
        </Modal>
    );
}
