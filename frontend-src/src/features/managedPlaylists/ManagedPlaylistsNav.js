import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionIcon, Group, Indicator, Text, Tooltip } from '@mantine/core';
import {
    IconBrandSpotify,
    IconCirclePlus,
    IconCircleX,
    IconStar,
    IconToggleLeft,
    IconToggleRightFilled,
    IconTransfer,
} from '@tabler/icons-react';
import { PaperStyled } from '../../components/PaperStyled';
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
            <Text tt='uppercase' ta='left'>Playlists</Text>
            <PaperStyled shadow="xs" p="xs">
                <Group className='ManagedPlaylistsNav' grow justify="center">
                    <Tooltip label="Add a spotify playlist to manage">
                        <ActionIcon variant="light" aria-label="Add a spotify playlist to manage" onClick={() => dispatch(toggleDialog())} >

                            <Indicator inline processing color="red" size={8} offset={4} disabled={playlists.length > 0}>
                                <IconBrandSpotify />
                            </Indicator>
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Favorite playlists">
                        <ActionIcon variant="light" aria-label="Favorite playlists" onClick={() => dispatch(toggleFavoriteDialog())} disabled={favoritePlaylists.length < 1}>
                            <IconStar />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Activate all">
                        <ActionIcon variant="light" aria-label="Activate all" onClick={() => dispatch(setActiveAll('Y'))} disabled={playlists.length < 1}>
                            <IconToggleRightFilled />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Deactivate all">
                        <ActionIcon variant="light" aria-label="Dectivate all" onClick={() => dispatch(setActiveAll('N'))} disabled={playlists.length < 1}>
                            <IconToggleLeft />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Invert active">
                        <ActionIcon variant="light" aria-label="Invert active" onClick={() => dispatch(invertActiveAll())} disabled={playlists.length < 1}>
                            <IconTransfer />
                        </ActionIcon>
                    </Tooltip>
                </Group>

            </PaperStyled>
            <Text tt='uppercase' ta='left'>Add / Remove currently playing</Text>
            <PaperStyled shadow="xs" p="xs" >
                <Group grow justify="center">
                    <Tooltip label="Remove currently playing from active">
                        <ActionIcon
                            aria-label="Remove track from active"
                            onClick={currentTrack.timestamp !== undefined ? () => dispatch(removeTrackFromActive(currentTrack.item.uri)) : null}
                            disabled={currentTrack.timestamp === undefined || playlists.length < 1}
                            color="red"
                        >
                            <IconCircleX />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Add currently playing to active">
                        <ActionIcon
                            aria-label="Add track to active"
                            onClick={currentTrack.timestamp !== undefined ? () => dispatch(addTrackToActive(currentTrack.item.uri)) : null}
                            disabled={currentTrack.timestamp === undefined || playlists.length < 1}
                            color="green"
                        >
                            <IconCirclePlus />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </PaperStyled>
        </>
    );
}
