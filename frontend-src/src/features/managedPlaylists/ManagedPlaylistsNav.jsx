import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionIcon, Box, Group, Indicator, Text, Tooltip } from '@mantine/core';
import {
    IconBrandSpotify,
    IconCirclePlus,
    IconCircleX,
    IconStar,
    IconStarFilled,
    IconToggleLeft,
    IconToggleRightFilled,
    IconTransfer,
} from '@tabler/icons-react';
import { PaperStyled } from '../../components/PaperStyled';
import { gsap } from 'gsap';
import {
    selectCurrentTrack
} from '../player/playerSlice';
import {
    toggleDialog,
} from '../spotifyPlaylists/spotifyPlaylistsSlice';
import {
    selectPlaylists,
    selectFavoritePlaylists,
    invertActiveAll,
    setActiveAll,
    addTrackToActive,
    removeTrackFromActive,
    toggleFavoriteDialog
} from '../managedPlaylists/managedPlaylistsSlice';

export function ManagedPlaylistsNav() {

    const currentTrack = useSelector(selectCurrentTrack);
    const playlists = useSelector(selectPlaylists);
    const favoritePlaylists = useSelector(selectFavoritePlaylists);

    const dispatch = useDispatch();

    return (
        <>

            <Box mt='xs'>
                <Text tt='uppercase' ta='left'>Add / Remove currently playing</Text>
                <PaperStyled shadow="xs" p="xs" mt='xs' data-animate="fade-in">
                    <Group grow justify="center">
                        <Tooltip label="Remove currently playing from active">
                            <ActionIcon
                                aria-label="Remove track from active"
                                onClick={(e) => {
                                    if (currentTrack.timestamp === undefined || playlists.length < 1) return;
                                    const node = e.currentTarget || e.target;
                                    gsap.fromTo(node, { boxShadow: '0 0 0 rgba(255,0,0,0.0)' }, { boxShadow: '0 0 20px rgba(255,0,0,0.6)', duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' });
                                    dispatch(removeTrackFromActive(currentTrack.item.uri));
                                }}
                                disabled={currentTrack.timestamp === undefined || playlists.length < 1}
                                color="red"
                                p='lg'
                            >
                                <IconCircleX />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Add currently playing to active">
                            <ActionIcon
                                aria-label="Add track to active"
                                onClick={(e) => {
                                    if (currentTrack.timestamp === undefined || playlists.length < 1) return;
                                    const node = e.currentTarget || e.target;
                                    gsap.fromTo(node, { boxShadow: '0 0 0 rgba(0,255,0,0.0)' }, { boxShadow: '0 0 20px rgba(0,255,0,0.55)', duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' });
                                    dispatch(addTrackToActive(currentTrack.item.uri));
                                }}
                                disabled={currentTrack.timestamp === undefined || playlists.length < 1}
                                color="green"
                                p='lg'
                            >
                                <IconCirclePlus />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </PaperStyled>
            </Box>
            <Box mt='xs'>
                <Text tt='uppercase' ta='left'>Playlists</Text>
                <PaperStyled shadow="xs" p="xs" mt='xs' data-animate="fade-in">
                    <Group className='ManagedPlaylistsNav' grow justify="center">
                        <Tooltip label="Add a spotify playlist to manage">
                            <ActionIcon
                                variant="light"
                                role='button'
                                aria-label="Add a spotify playlist to manage"
                                onClick={(e) => {
                                    const node = e.currentTarget || e.target;
                                    if (node && (node.disabled || (node.getAttribute && node.getAttribute('disabled') !== null) || node.getAttribute('aria-disabled') === 'true')) return;
                                    gsap.fromTo(
                                        node,
                                        { boxShadow: '0 0 0 rgba(203,188,224,0.0)' },
                                        { boxShadow: '0 0 20px rgba(203,188,224,0.55)', duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' }
                                    );
                                    dispatch(toggleDialog());
                                }}
                            >

                                <Indicator inline processing color="red" size={8} offset={4} disabled={playlists.length > 0}>
                                    <IconBrandSpotify />
                                </Indicator>
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Favorite playlists">
                            <ActionIcon
                                variant="light"
                                role='button'
                                aria-label="Favorite playlists"
                                onClick={(e) => {
                                    const node = e.currentTarget || e.target;
                                    if (node && (node.disabled || (node.getAttribute && node.getAttribute('disabled') !== null) || node.getAttribute('aria-disabled') === 'true')) return;
                                    gsap.fromTo(
                                        node,
                                        { boxShadow: '0 0 0 rgba(203,188,224,0.0)' },
                                        { boxShadow: '0 0 20px rgba(203,188,224,0.55)', duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' }
                                    );
                                    dispatch(toggleFavoriteDialog());
                                }}
                                disabled={favoritePlaylists.length < 1}
                            >
                                {favoritePlaylists.length < 1 ? <IconStar /> : <IconStarFilled />}
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Activate all">
                            <ActionIcon
                                variant="light"
                                role='button'
                                aria-label="Activate all"
                                onClick={(e) => {
                                    const node = e.currentTarget || e.target;
                                    if (node && (node.disabled || (node.getAttribute && node.getAttribute('disabled') !== null) || node.getAttribute('aria-disabled') === 'true')) return;
                                    gsap.fromTo(
                                        node,
                                        { boxShadow: '0 0 0 rgba(203,188,224,0.0)' },
                                        { boxShadow: '0 0 20px rgba(203,188,224,0.55)', duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' }
                                    );
                                    dispatch(setActiveAll('Y'));
                                }}
                                disabled={playlists.length < 1}
                            >
                                <IconToggleRightFilled />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Deactivate all">
                            <ActionIcon
                                variant="light"
                                role='button'
                                aria-label="Dectivate all"
                                onClick={(e) => {
                                    const node = e.currentTarget || e.target;
                                    if (node && (node.disabled || (node.getAttribute && node.getAttribute('disabled') !== null) || node.getAttribute('aria-disabled') === 'true')) return;
                                    gsap.fromTo(
                                        node,
                                        { boxShadow: '0 0 0 rgba(203,188,224,0.0)' },
                                        { boxShadow: '0 0 20px rgba(203,188,224,0.55)', duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' }
                                    );
                                    dispatch(setActiveAll('N'));
                                }}
                                disabled={playlists.length < 1}
                            >
                                <IconToggleLeft />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Invert active">
                            <ActionIcon
                                variant="light"
                                role='button'
                                aria-label="Invert active"
                                onClick={(e) => {
                                    const node = e.currentTarget || e.target;
                                    if (node && (node.disabled || (node.getAttribute && node.getAttribute('disabled') !== null) || node.getAttribute('aria-disabled') === 'true')) return;
                                    gsap.fromTo(
                                        node,
                                        { boxShadow: '0 0 0 rgba(203,188,224,0.0)' },
                                        { boxShadow: '0 0 20px rgba(203,188,224,0.55)', duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' }
                                    );
                                    dispatch(invertActiveAll());
                                }}
                                disabled={playlists.length < 1}
                            >
                                <IconTransfer />
                            </ActionIcon>
                        </Tooltip>
                    </Group>

                </PaperStyled>

            </Box>
        </>
    );
}
