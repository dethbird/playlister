import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionIcon, Anchor, Grid, Group, Paper, Switch, Text, Title } from '@mantine/core';
import {
    IconCirclePlus,
    IconCircleX,
    IconMusic,
    IconStar,
    IconStarFilled
} from '@tabler/icons-react';
import {
    getPlaylistMeta,
    removeManagedPlaylist,
    selectPlaylistsMeta,
    togglePlaylistActive,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    toggleFavoritePlaylist
} from './managedPlaylistsSlice';

export function ManagedPlaylistItem({ playlist }) {

    const playlistMeta = useSelector(selectPlaylistsMeta);
    let meta = null;
    if (playlistMeta) {
        if (playlistMeta[playlist.spotify_playlist_id]) {
            meta = playlistMeta[playlist.spotify_playlist_id];
        }
    }

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPlaylistMeta(playlist.spotify_playlist_id));
    }, [dispatch, playlist]);

    const renderItem = () => {
        if (!meta) {
            return <div aria-busy="true"></div>;
        }
        return (
            <Grid>
                <Grid.Col span={2}>
                    <img className='CoverArt' alt="Playlist cover" src={meta.images[1] ? meta.images[1].url : meta.images[0].url} />
                </Grid.Col>
                <Grid.Col span={5} className='PlaylistDetails' >
                    <Title order={5}><Anchor size="xl" href={meta.uri} target="_blank" rel="noreferrer">{meta.name}</Anchor></Title>
                    <br />
                    <IconMusic className='Notes' size={16} /><Text size='sm'>{meta.tracks.total} tracks</Text>
                </Grid.Col>
                <Grid.Col span={5}>
                    <Group grow justify="center">
                        <ActionIcon variant="light" aria-label="Favorite / Unfavorite" onClick={() => dispatch(toggleFavoritePlaylist(playlist.spotify_playlist_id))}>
                            {playlist.favorited !== null ? <IconStarFilled /> : <IconStar />}
                        </ActionIcon>
                        <ActionIcon variant="light" aria-label="Remove from managed" onClick={() => dispatch(removeManagedPlaylist(playlist.id))}>
                            <IconCircleX />
                        </ActionIcon>
                        <Switch
                            checked={playlist.active === 'Y'}
                            onChange={() => { dispatch(togglePlaylistActive(playlist.id)) }}
                        />
                    </Group>
                    <br />
                    <Group grow justify="center" px={16}>
                        <ActionIcon
                            aria-label="Add track"
                            onClick={() => { dispatch(addTrackToPlaylist(playlist.spotify_playlist_id)) }}
                            color="green"
                        >
                            <IconCirclePlus />
                        </ActionIcon>

                        <ActionIcon
                            aria-label="Remove track"
                            onClick={() => { dispatch(removeTrackFromPlaylist(playlist.spotify_playlist_id)) }}
                            color="red"
                        >
                            <IconCircleX />
                        </ActionIcon>
                    </Group>
                </Grid.Col>
            </Grid>
        )
    }

    return (
        <Paper className='ManagedPlaylistItem' shadow="xs" p="xs" m="xs">
            {renderItem()}
        </Paper>
    );
}

