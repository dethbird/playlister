import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionIcon, Anchor, Grid, Group, Paper, Switch, Text, Tooltip } from '@mantine/core';
import {
    IconCirclePlus,
    IconCircleX,
    IconMusic,
    IconStar,
    IconStarFilled
} from '@tabler/icons-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    getPlaylistMeta,
    removeManagedPlaylist,
    selectPlaylistsMeta,
    togglePlaylistActive,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    toggleFavoritePlaylist
} from './managedPlaylistsSlice';
import {
    selectCurrentTrack
} from '../player/playerSlice'

export function ManagedPlaylistItem({ playlist }) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: playlist.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const currentTrack = useSelector(selectCurrentTrack);

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
                <Grid.Col span={7}>
                    <Grid>
                        <Grid.Col span={{ base: 12, sm: 3 }}>
                            <img className='CoverArt' alt="Playlist cover" src={meta.images[1] ? meta.images[1].url : meta.images[0].url} />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 9 }} className='PlaylistDetails' >
                            <Anchor fw={500} size="lg" href={meta.uri} target="_blank" rel="noreferrer">{meta.name}</Anchor>
                            <br />
                            <IconMusic className='Notes' size={16} /><Text size='sm'>{meta.tracks.total} tracks</Text>
                        </Grid.Col>
                    </Grid>
                </Grid.Col>
                <Grid.Col span={5}>
                    <Group grow justify="flex-end">
                        <Tooltip label="Favorite / unfavorite">
                            <ActionIcon variant="light" aria-label="Favorite / Unfavorite" onClick={() => dispatch(toggleFavoritePlaylist(playlist.spotify_playlist_id))}>
                                {playlist.favorited !== null ? <IconStarFilled /> : <IconStar />}
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Remove from managed">
                            <ActionIcon variant="light" aria-label="Remove from managed" onClick={() => dispatch(removeManagedPlaylist(playlist.id))}>
                                <IconCircleX />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Active / inactive">
                            <Switch
                                checked={playlist.active === 'Y'}
                                onChange={() => { dispatch(togglePlaylistActive(playlist.id)) }}
                            />
                        </Tooltip>
                    </Group>
                    <br />
                    <Group grow justify="flex-end" px={16}>
                        <Tooltip label="Remove currently playing from this playlist">
                            <ActionIcon
                                aria-label="Remove track"
                                onClick={() => { dispatch(removeTrackFromPlaylist(playlist.spotify_playlist_id)) }}
                                color="red"
                                disabled={currentTrack.timestamp === undefined}
                            >
                                <IconCircleX />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Add currently playing to this playlist">
                            <ActionIcon
                                aria-label="Add track"
                                onClick={() => { dispatch(addTrackToPlaylist(playlist.spotify_playlist_id)) }}
                                color="green"
                                disabled={currentTrack.timestamp === undefined}
                            >
                                <IconCirclePlus />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Grid.Col>
            </Grid>
        )
    }

    return (
        <Paper className='ManagedPlaylistItem' withBorder shadow="xs" p="xs" my="xs" ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {renderItem()}
        </Paper>
    );
}

