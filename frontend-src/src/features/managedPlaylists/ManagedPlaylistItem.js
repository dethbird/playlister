import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionIcon, Anchor, Box, Grid, Group, Switch, Text, Tooltip } from '@mantine/core';
import {
    IconCirclePlus,
    IconCircleX,
    IconMusic,
    IconStar,
    IconStarFilled
} from '@tabler/icons-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PaperStyled } from '../../components/PaperStyled';
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
            return <div role='alert' aria-busy="true"></div>;
        }
        return (
            <Grid>
                <Grid.Col span={5}>
                    <Grid>
                        <Grid.Col span={{ base: 12, sm: 4 }}>
                            <img className='CoverArt' data-testid='Playlist cover' alt="Playlist cover" src={meta.images[1] ? meta.images[1].url : meta.images[0].url} />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 8 }} className='PlaylistDetails' visibleFrom='sm'>
                            <Anchor fw={500} size="lg" href={meta.uri} target="_blank" rel="noreferrer" pt='xs' pb='md'>{meta.name}</Anchor>
                            <br />
                            <IconMusic className='Notes' size={16} /><Text size='sm'>{meta.tracks.total} tracks</Text>
                        </Grid.Col>
                    </Grid>
                </Grid.Col>
                <Grid.Col span={7}>
                    <Group grow >
                        <Tooltip role='tooltip' label="Favorite / unfavorite">
                            <ActionIcon variant="light" aria-label="Favorite / Unfavorite" onClick={() => dispatch(toggleFavoritePlaylist(playlist.spotify_playlist_id))}>
                                {playlist.favorited !== null ? <IconStarFilled data-testid='IconStarFilled' /> : <IconStar data-testid='IconStar' />}
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip role='tooltip' label="Remove from managed">
                            <ActionIcon variant="light" aria-label="Remove from managed" onClick={() => dispatch(removeManagedPlaylist(playlist.id))}>
                                <IconCircleX />
                            </ActionIcon>
                        </Tooltip>
                        <Switch
                            mr={0}
                            role='switch'
                            data-testid='activation-switch'
                            size='lg'
                            checked={playlist.active === 'Y'}
                            onChange={() => { dispatch(togglePlaylistActive(playlist.id)) }}
                        />
                    </Group>
                    <br style={{ clear: 'both' }} />
                    <Group grow justify="flex-end" >
                        <Tooltip role='tooltip' label="Remove currently playing from this playlist">
                            <ActionIcon
                                aria-label="Remove track"
                                onClick={() => { dispatch(removeTrackFromPlaylist(playlist.spotify_playlist_id)) }}
                                color="red"
                                disabled={currentTrack.timestamp === undefined}
                            >
                                <IconCircleX />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip role='tooltip' label="Add currently playing to this playlist">
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
                <Grid.Col span={12} hiddenFrom="sm">
                    <Anchor fw={500} size="lg" href={meta.uri} target="_blank" rel="noreferrer" pt='xs' pb='md'>{meta.name}</Anchor>
                    <br />
                    <IconMusic className='Notes' size={16} /><Text size='sm'>{meta.tracks.total} tracks</Text>
                </Grid.Col>
            </Grid>
        )
    }

    return (
        <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <PaperStyled shadow="xs" p="xs" my="xs" role='li' className='ManagedPlaylistItem' >
                {renderItem()}
            </PaperStyled>
        </Box>
    );
}
