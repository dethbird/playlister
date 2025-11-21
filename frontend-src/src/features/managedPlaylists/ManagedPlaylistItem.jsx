import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
import { gsap } from 'gsap';
import { buttonAnimation } from '../../constants';


export function ManagedPlaylistItem({ playlist, index = 0 }) {

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
    const currentPlaylistMeta = playlistMetaLookup && playlistMetaLookup[playlist.spotify_playlist_id];
    const [staleMeta, setStaleMeta] = useState(currentPlaylistMeta);
    const playlistMeta = currentPlaylistMeta || staleMeta;
    const [dropMarker, setDropMarker] = useState(0);
    const wasDragging = useRef(false);

    const dispatch = useDispatch();

    useEffect(() => {
        // keep last-known meta around so the UI doesn't vanish while we re-fetch
        if (currentPlaylistMeta) {
            setStaleMeta(currentPlaylistMeta);
        }
    }, [currentPlaylistMeta]);

    useEffect(() => {
        if (!currentPlaylistMeta) {
            dispatch(getPlaylistMeta(playlist.spotify_playlist_id));
        }
    }, [dispatch, playlist.spotify_playlist_id, currentPlaylistMeta]);

    useEffect(() => {
        if (wasDragging.current && !isDragging) {
            setDropMarker(Date.now());
        }
        wasDragging.current = isDragging;
    }, [isDragging]);

    return (
        <Box ref={setNodeRef} style={style} {...attributes} {...listeners} pb='xs'>
            <ManagedPlaylistCard
                playlist={playlist}
                playlistMeta={playlistMeta}
                currentTrack={currentTrack}
                dispatch={dispatch}
                colorScheme={colorScheme}
                index={index}
                dropMarker={dropMarker}
                showActions
            />
        </Box>
    );
}

export function ManagedPlaylistCard({ playlist, playlistMeta, currentTrack, dispatch, colorScheme, dropMarker = 0, index = 0, showActions = true }) {
    if (!playlistMeta) {
        return <div role='alert' aria-busy="true"></div>;
    }

    const cardRef = useRef(null);
    const hasFadedIn = useRef(false);
    const previousMetaSignature = useRef(null);
    const metaSignature = playlistMeta ? `${playlistMeta.snapshot_id ?? ''}-${playlistMeta.tracks?.total ?? 0}` : null;

    useEffect(() => {
        if (!cardRef.current || !playlistMeta) {
            previousMetaSignature.current = metaSignature;
            return undefined;
        }

        const metaChanged = metaSignature && metaSignature !== previousMetaSignature.current;
        const shouldAnimate = Boolean(dropMarker) || Boolean(metaChanged);
        if (!shouldAnimate) {
            previousMetaSignature.current = metaSignature;
            return undefined;
        }

        const animation = gsap.timeline({ defaults: { ease: 'power2.out' } });
        animation
            .fromTo(
                cardRef.current, 
                { 
                    boxShadow: '0 0 0 rgba(203, 188, 224, 1)' 
                }, 
                {
                    boxShadow: '0 0 25px rgba(203, 188, 224, 0.55)',
                    duration: 0.20,
                    ease: 'power2.out' 
                })
            .to(
                cardRef.current,
                { 
                    boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
                    duration: 0.25,
                    ease: 'power2.out'
                })
            .eventCallback(
                'onComplete', () => {
                    if (cardRef.current) {
                        gsap.set(cardRef.current, { clearProps: 'box-shadow,transform' });
                    }}
            );

        previousMetaSignature.current = metaSignature;

        return () => animation.kill();
    }, [dropMarker, metaSignature, playlistMeta]);

    useLayoutEffect(() => {
        if (!cardRef.current || !playlistMeta || hasFadedIn.current) {
            return undefined;
        }

        const fadeIn = gsap.fromTo(
            cardRef.current,
            { autoAlpha: 0, y: 12 },
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.45,
                delay: Math.min(index * 0.08, 0.6),
                ease: 'power2.out'
            }
        );

        fadeIn.eventCallback('onComplete', () => {
            hasFadedIn.current = true;
        });

        return () => {
            fadeIn.kill();
        };
    }, [playlistMeta, index]);

    const favoriteIcon = playlist.favorited !== null ? <IconStarFilled data-testid='IconStarFilled' /> : <IconStar data-testid='IconStar' />;
    const safeDispatch = dispatch || (() => {});
    const hasCurrentTrack = !!currentTrack && currentTrack.timestamp !== undefined;

    return (
        <Box ref={cardRef} >
            <PaperStyled shadow="xs" p="xs"  my="xs" role='li' className='ManagedPlaylistItem'>
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
                                <ActionIcon
                                    variant="light"
                                    aria-label="Favorite / Unfavorite"
                                    onClick={(e) => {
                                        const node = e.currentTarget || e.target;
                                        gsap.fromTo(
                                            node,
                                            { boxShadow: '0 0 0 rgba(203,188,224,0.0)' },
                                            { boxShadow: '0 0 20px rgba(203,188,224,0.55)', duration: buttonAnimation.bloomDuration, yoyo: true, repeat: 1, ease: 'power2.out' }
                                        );
                                        safeDispatch(toggleFavoritePlaylist(playlist.spotify_playlist_id));
                                    }}
                                >
                                    {favoriteIcon}
                                </ActionIcon>
                            </Tooltip>
                            <Tooltip role='tooltip' label="Remove from managed">
                                <ActionIcon
                                    variant="light"
                                    aria-label="Remove from managed"
                                    onClick={(e) => {
                                        const node = e.currentTarget || e.target;
                                        gsap.fromTo(
                                            node,
                                            { boxShadow: '0 0 0 rgba(203,188,224,0.0)' },
                                            { boxShadow: '0 0 20px rgba(203,188,224,0.55)', duration: buttonAnimation.bloomDuration, yoyo: true, repeat: 1, ease: 'power2.out' }
                                        );
                                        safeDispatch(removeManagedPlaylist(playlist.id));
                                    }}
                                >
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
                                    onClick={(e) => {
                                        if (!hasCurrentTrack) return;
                                        const node = e.currentTarget || e.target;
                                        gsap.fromTo(
                                            node,
                                            { boxShadow: '0 0 0 rgba(255,0,0,0.0)' },
                                            { boxShadow: '0 0 20px rgba(255,0,0,0.6)', duration: buttonAnimation.bloomDuration, yoyo: true, repeat: 1, ease: 'power2.out' }
                                        );
                                        safeDispatch(removeTrackFromPlaylist(playlist.spotify_playlist_id));
                                    }}
                                    color="red"
                                    disabled={!hasCurrentTrack}
                                >
                                    <IconCircleX />
                                </ActionIcon>
                            </Tooltip>
                            <Tooltip role='tooltip' label="Add currently playing to this playlist">
                                <ActionIcon
                                    aria-label="Add track"
                                    onClick={(e) => {
                                        if (!hasCurrentTrack) return;
                                        const node = e.currentTarget || e.target;
                                        gsap.fromTo(
                                            node,
                                            { boxShadow: '0 0 0 rgba(0,255,0,0.0)' },
                                            { boxShadow: '0 0 20px rgba(0,255,0,0.55)', duration: buttonAnimation.bloomDuration, yoyo: true, repeat: 1, ease: 'power2.out' }
                                        );
                                        safeDispatch(addTrackToPlaylist(playlist.spotify_playlist_id));
                                    }}
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
        </Box>
    )
}
