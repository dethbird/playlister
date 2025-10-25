import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Modal } from '@mantine/core';
import {
    getSpotifyPlaylists,
    getAllSpotifyPlaylists,
    selectAllPlaylists,
    selectdDialogIsOpen,
    selectStatus,
    toggleDialog
} from './spotifyPlaylistsSlice';

import { SpotifyPlaylistsPagination } from './SpotifyPlaylistsPagination';
import { SpotifyPlaylistItem } from './SpotifyPlaylistItem';
import { IconBrandSpotify } from '@tabler/icons-react';

export function SpotifyPlaylists({ spotifyUser }) {

    // read consolidated playlists from localStorage via helper selector (not a redux selector)
    const allPlaylists = selectAllPlaylists();
    const dialogIsOpen = useSelector(selectdDialogIsOpen);
    const status = useSelector(selectStatus);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSpotifyPlaylists({ limit: 25, offset: 0 }));
        dispatch(getAllSpotifyPlaylists());
    }, [dispatch]);

    if (!dialogIsOpen) {
        return null;
    }

    const renderItems = () => {
        if (['pending', 'idle'].includes(status) && !allPlaylists) {
            return <div role='alert' aria-busy="true"></div>;
        }

        const source = (allPlaylists && allPlaylists.items) ? allPlaylists : { items: [] };
        const userPlaylists = (source.items || []).filter(item => item.owner && item.owner.id === spotifyUser.id);

        if (userPlaylists.length === 0) {
            return (
                <Container ta="center" py="xl">
                    <p>You have not created any playlists yet!</p>
                    <p>Please <a href="spotify:" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>create at least one on <IconBrandSpotify size={16} /> Spotify</a> then refresh this page.</p>
                </Container>
            );
        }

        return (
            <>
                <SpotifyPlaylistsPagination />
                {userPlaylists.map(item => {
                    return (
                        <React.Fragment key={item.id}>
                            <SpotifyPlaylistItem playlist={item} />
                        </React.Fragment>
                    );
                })}
                <SpotifyPlaylistsPagination />
            </>
        );
    }

    return (
        <Modal
            opened={dialogIsOpen}
            onClose={() => { dispatch(toggleDialog()) }}
            title='Your Spotify playlists'
            padding='xs'
            fullScreen
        >
            <Container>
                {renderItems()}
            </Container>
        </Modal>
    );
}
