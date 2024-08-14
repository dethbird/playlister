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

        if (['pending', 'idle'].includes(favoriteStatus) && favoritePlaylists.length < 1) {
            return <div role='alert' aria-busy="true"></div>;
        }

        return favoritePlaylists.map(item => {
            return <FavoritePlaylistItem playlist={item} key={item.id} role='li'/>;
        })
    }

    return (
        <Modal
            opened={favoriteDialogIsOpen}
            onClose={() => { dispatch(toggleFavoriteDialog()) }}
            title="Your favorited playlists"
            padding='xl'
            fullScreen
            arial-label='FavoritesModal'
        >
            <Container>{renderItems()}</Container>
        </Modal>
    );
}
