import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Modal, TextInput, ActionIcon, Group, SegmentedControl, Select } from '@mantine/core';
import {
    getAllSpotifyPlaylists,
    selectAllPlaylists,
    // managed playlists to exclude
    // (we import selectPlaylists from managed slice below)
    selectdDialogIsOpen,
    selectStatus,
    toggleDialog,
    setOffset
} from './spotifyPlaylistsSlice';
import { selectPlaylists } from '../managedPlaylists/managedPlaylistsSlice';

import { SpotifyPlaylistsPagination } from './SpotifyPlaylistsPagination';
import { SpotifyPlaylistItem } from './SpotifyPlaylistItem';
import { IconBrandSpotify, IconSearch, IconX } from '@tabler/icons-react';

export function SpotifyPlaylists({ spotifyUser }) {

    // read consolidated playlists from localStorage via helper selector (not a redux selector)
    const allPlaylists = selectAllPlaylists();
    const dialogIsOpen = useSelector(selectdDialogIsOpen);
    const status = useSelector(selectStatus);
    // managed playlists from Redux (used to filter out managed ids)
    const managed = useSelector(selectPlaylists) || [];
    const managedIds = new Set(managed.map(p => p.spotify_playlist_id));
    // guard against tests or environments where the slice isn't mounted
    // provide safe defaults so component rendering doesn't throw
    const limit = useSelector((state) => state.spotifyPlaylists?.limit ?? 50);
    const offset = useSelector((state) => state.spotifyPlaylists?.offset ?? 0);

    const dispatch = useDispatch();

    // controlled search term for filtering playlists; normalized during filtering
    const [searchTerm, setSearchTerm] = useState('');
    // UI-only state for the sort controls (stubbed; not wired to actual sorting yet)
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
    const [sortBy, setSortBy] = useState('title'); // 'title' | 'track_count'

    useEffect(() => {
        dispatch(getAllSpotifyPlaylists());
    }, [dispatch]);

    // when the search term changes, reset pagination offset so results show from first page
    useEffect(() => {
        dispatch(setOffset(0));
    }, [searchTerm, dispatch]);

    // clear the search term whenever the dialog closes so the field is empty on next open
    // this handles both clicking the close button and closing with the Escape key
    useEffect(() => {
        if (!dialogIsOpen) {
            setSearchTerm('');
        }
    }, [dialogIsOpen]);

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
            .filter(item => !managedIds.has(item.id))
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

        // apply client-side search filtering (normalize: lowercase + remove non-alphanumerics)
        const normalizedSearch = (searchTerm || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const filteredPlaylists = normalizedSearch
            ? userPlaylists.filter(p => {
                const nameNorm = (p.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                return nameNorm.includes(normalizedSearch);
            })
            : userPlaylists;

        // If the source contains no user playlists at all, show the "no playlists created" message.
        if (userPlaylists.length === 0) {
            return (
                <Container ta="center" py="xl">
                    <p>You have not created any playlists yet!</p>
                    <p>Please <a href="spotify:" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>create at least one on <IconBrandSpotify size={16} /> Spotify</a> then refresh this page.</p>
                </Container>
            );
        }

        // Reusable search input shown whenever the user has playlists (so it can be cleared)
        // Layout: search box on the left, two small sort controls on the right.
        const searchInput = (
            <div style={{ padding: '0.5rem 1rem' }}>
                <Group position="apart" align="center" noWrap>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <TextInput
                            placeholder="Search playlists"
                            aria-label="Search playlists"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.currentTarget.value)}
                            icon={<IconSearch size={16} />}
                            rightSection={
                                searchTerm ? (
                                    <ActionIcon onClick={() => setSearchTerm('')} aria-label="Clear search">
                                        <IconX size={14} />
                                    </ActionIcon>
                                ) : null
                            }
                            radius="md"
                            size="md"
                        />
                    </div>

                    {/* Sort controls (UI-only stubs) */}
                    <Group spacing="xs" align="center">
                        {/* Ascending / Descending toggle */}
                        <SegmentedControl
                            value={sortOrder}
                            onChange={setSortOrder}
                            data={[{ label: 'Asc', value: 'asc' }, { label: 'Desc', value: 'desc' }]}
                            size="xs"
                        />

                        {/* Sort by selector (title / track count) */}
                        <Select
                            value={sortBy}
                            onChange={(v) => setSortBy(v || 'title')}
                            data={[{ value: 'title', label: 'Title' }, { value: 'track_count', label: 'Track count' }]}
                            size="xs"
                            style={{ minWidth: 140 }}
                        />
                    </Group>
                </Group>
            </div>
        );

        // If there are no matches for the current search, show the search input and a friendly
        // "no search results" message where the pagination/list would normally be.
        if (filteredPlaylists.length === 0) {
            return (
                <>
                    {searchInput}
                    <Container ta="center" py="xl">
                        <p>No search results</p>
                    </Container>
                </>
            );
        }

        // Apply UI-controlled sorting to the filtered results (wired to controls)
        const sortedPlaylists = [...filteredPlaylists].sort((a, b) => {
            let cmp = 0;
            if (sortBy === 'track_count') {
                const ta = (a.tracks && typeof a.tracks.total === 'number') ? a.tracks.total : 0;
                const tb = (b.tracks && typeof b.tracks.total === 'number') ? b.tracks.total : 0;
                cmp = ta - tb;
            } else {
                // default: sort by normalized title
                const na = normalizeName(a.name);
                const nb = normalizeName(b.name);
                if (na < nb) cmp = -1;
                else if (na > nb) cmp = 1;
                else cmp = 0;
            }
            return sortOrder === 'asc' ? cmp : -cmp;
        });

        const pageItems = sortedPlaylists.slice(offset, offset + limit);
        return (
            <>
                {searchInput}

                <SpotifyPlaylistsPagination userPlaylists={sortedPlaylists} />
                {pageItems.map(item => (
                    <React.Fragment key={item.id}>
                        <SpotifyPlaylistItem playlist={item} />
                    </React.Fragment>
                ))}
                <SpotifyPlaylistsPagination userPlaylists={sortedPlaylists} />
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


