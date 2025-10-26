import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Modal } from '@mantine/core';
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

    // Close the favorites modal if the list transitions from >0 to 0 after a successful refresh
    const prevCountRef = useRef(favoritePlaylists.length);
    useEffect(() => {
        if (favoriteDialogIsOpen && favoriteStatus === 'fulfilled' && prevCountRef.current > 0 && favoritePlaylists.length === 0) {
            dispatch(toggleFavoriteDialog());
        }
        prevCountRef.current = favoritePlaylists.length;
    }, [favoritePlaylists.length, favoriteStatus, favoriteDialogIsOpen, dispatch]);

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
            padding='xs'
            fullScreen
            arial-label='FavoritesModal'
        >
            <Container>{renderItems()}</Container>
        </Modal>
    );
}
