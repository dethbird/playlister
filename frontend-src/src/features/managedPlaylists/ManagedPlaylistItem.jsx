import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionIcon, Anchor, Box, Grid, Group, Image, Switch, Text, Tooltip, useMantineColorScheme } from '@mantine/core';
import {
    IconCirclePlus,
    IconCircleX,
    IconDisc,
    IconMusic,
    IconStar,
    IconStarFilled
} from '@tabler/icons-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PaperStyled } from '../../components/PaperStyled';
import {
    addTrackToPlaylist,
    getPlaylistMeta,
    removeManagedPlaylist,
    removeTrackFromPlaylist,
    selectPlaylistsMeta,
    toggleFavoritePlaylist,
    togglePlaylistActive
} from './managedPlaylistsSlice';
import {
    selectCurrentTrack
} from '../player/playerSlice';
import { theme } from '../../app/theme';


export function ManagedPlaylistItem({ playlist }) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: playlist.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: isDragging ? 'grabbing' : 'grab',
        boxShadow: isDragging ? '0 15px 30px rgba(0, 0, 0, 0.2)' : undefined,
        opacity: isDragging ? 0.25 : 1,
    };

    const { colorScheme } = useMantineColorScheme();

    const currentTrack = useSelector(selectCurrentTrack);

    const playlistMetaLookup = useSelector(selectPlaylistsMeta);
    const playlistMeta = playlistMetaLookup && playlistMetaLookup[playlist.spotify_playlist_id];

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPlaylistMeta(playlist.spotify_playlist_id));
    }, [dispatch, playlist.spotify_playlist_id]);

    return (
        <Box ref={setNodeRef} style={style} {...attributes} {...listeners} pb='xs'>
            <ManagedPlaylistCard
                playlist={playlist}
                playlistMeta={playlistMeta}
                currentTrack={currentTrack}
                dispatch={dispatch}
                colorScheme={colorScheme}
                showActions
            />
        </Box>
    );
}

export function ManagedPlaylistCard({ playlist, playlistMeta, currentTrack, dispatch, colorScheme, showActions = true }) {
    if (!playlistMeta) {
        return <div role='alert' aria-busy="true"></div>;
    }

    const favoriteIcon = playlist.favorited !== null ? <IconStarFilled data-testid='IconStarFilled' /> : <IconStar data-testid='IconStar' />;
    const safeDispatch = dispatch || (() => {});
    const hasCurrentTrack = !!currentTrack && currentTrack.timestamp !== undefined;

    return (
        <PaperStyled shadow="xs" p="xs"  my="xs" role='li' className='ManagedPlaylistItem' >
            <Grid>
                <Grid.Col span={{ base: 12, xs: 6 }}>
                    <Grid>
                        <Grid.Col span={{ base: 3, xs: 4, sm: 3 }}>
                            {playlistMeta.images && playlistMeta.images.length > 0 ? (
                                <Image
                                    className='CoverArt'
                                    data-testid='Playlist cover'
                                    alt="Playlist cover"
                                    src={playlistMeta.images[1] ? playlistMeta.images[1].url : playlistMeta.images[0].url}
                                    mah={{ base: 66, xs: 80 }}
                                    w='auto'
                                />
                            ) : (
                                <IconDisc
                                    size={66}
                                    className='CoverArt'
                                    data-testid='Playlist cover fallback'
                                    style={{ maxHeight: '66px', width: 'auto' }}
                                />
                            )}
                        </Grid.Col>
                        <Grid.Col span={{ base: 9, xs: 8, sm: 9 }} className='PlaylistDetails' >
                            <Anchor td='none' c={theme.colors['pale-purple'][colorScheme === 'light' ? 3 : 2]} fw={500} size="lg" href={playlistMeta.uri} target="_blank" rel="noreferrer">{playlistMeta.name}</Anchor>
                            <br />
                            <IconMusic className='Notes' size={20} /><Text size='md'>{playlistMeta.tracks.total} tracks</Text>
                        </Grid.Col>
                    </Grid>
                </Grid.Col>
                {showActions && (
                    <Grid.Col span={{ base: 12, xs: 6 }}>
                        <Group grow >
                            <Tooltip role='tooltip' label="Favorite / unfavorite">
                                <ActionIcon variant="light" aria-label="Favorite / Unfavorite" onClick={() => safeDispatch(toggleFavoritePlaylist(playlist.spotify_playlist_id))}>
                                    {favoriteIcon}
                                </ActionIcon>
                            </Tooltip>
                            <Tooltip role='tooltip' label="Remove from managed">
                                <ActionIcon variant="light" aria-label="Remove from managed" onClick={() => safeDispatch(removeManagedPlaylist(playlist.id))}>
                                    <IconCircleX />
                                </ActionIcon>
                            </Tooltip>
                            <Switch
                                mr={0}
                                role='switch'
                                data-testid='activation-switch'
                                size='lg'
                                checked={playlist.active === 'Y'}
                                onChange={() => { safeDispatch(togglePlaylistActive(playlist.id)) }}
                            />
                        </Group>
                        <br style={{ clear: 'both' }} />
                        <Group grow justify="flex-end" >
                            <Tooltip role='tooltip' label="Remove currently playing from this playlist">
                                <ActionIcon
                                    aria-label="Remove track"
                                    onClick={() => { safeDispatch(removeTrackFromPlaylist(playlist.spotify_playlist_id)) }}
                                    color="red"
                                    disabled={!hasCurrentTrack}
                                >
                                    <IconCircleX />
                                </ActionIcon>
                            </Tooltip>
                            <Tooltip role='tooltip' label="Add currently playing to this playlist">
                                <ActionIcon
                                    aria-label="Add track"
                                    onClick={() => { safeDispatch(addTrackToPlaylist(playlist.spotify_playlist_id)) }}
                                    color="green"
                                    disabled={!hasCurrentTrack}
                                >
                                    <IconCirclePlus />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    </Grid.Col>
                )}
            </Grid>
        </PaperStyled>
    )
}
