import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Modal } from '@mantine/core';
import {
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
    const limit = useSelector((state) => state.spotifyPlaylists.limit);
    const offset = useSelector((state) => state.spotifyPlaylists.offset);

    const dispatch = useDispatch();

    useEffect(() => {
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
        // normalize a playlist name for consistent alphabetical sorting: lowercase and strip non-alphanumerics
        const normalizeName = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const userPlaylists = (source.items || [])
            .filter(item => item.owner && item.owner.id === spotifyUser.id)
            .sort((a, b) => {
                const na = normalizeName(a.name);
                const nb = normalizeName(b.name);
                if (na < nb) return -1;
                if (na > nb) return 1;
                // fallback to original case-insensitive compare if normalized equal
                const aName = (a.name || '').toLowerCase();
                const bName = (b.name || '').toLowerCase();
                if (aName < bName) return -1;
                if (aName > bName) return 1;
                return 0;
            });

        if (userPlaylists.length === 0) {
            return (
                <Container ta="center" py="xl">
                    <p>You have not created any playlists yet!</p>
                    <p>Please <a href="spotify:" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>create at least one on <IconBrandSpotify size={16} /> Spotify</a> then refresh this page.</p>
                </Container>
            );
        }

        const pageItems = userPlaylists.slice(offset, offset + limit);
        return (
            <>
                <SpotifyPlaylistsPagination userPlaylists={userPlaylists} />
                {pageItems.map(item => (
                    <React.Fragment key={item.id}>
                        <SpotifyPlaylistItem playlist={item} />
                    </React.Fragment>
                ))}
                <SpotifyPlaylistsPagination userPlaylists={userPlaylists} />
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
