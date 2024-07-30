import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionIcon, Group, Paper } from '@mantine/core';
import {
    IconBrandSpotify,
    IconCirclePlus,
    IconCircleX,
    IconStar,
    IconToggleLeft,
    IconToggleRightFilled,
    IconTransfer,
} from '@tabler/icons-react';
import {
    selectCurrentTrack
} from '../player/playerSlice';
import {
    toggleDialog,
} from '../spotifyPlaylists/spotifyPlaylistsSlice';
import {
    invertActiveAll,
    setActiveAll,
    addTrackToActive,
    removeTrackFromActive,
    toggleFavoriteDialog
} from '../managedPlaylists/managedPlaylistsSlice';

export function ManagedPlaylistsNav() {

    const currentTrack = useSelector(selectCurrentTrack);

    const dispatch = useDispatch();

    return (
        <>
            <Paper shadow="xs" p="xs">
                <Group className='ManagedPlaylistsNav' grow justify="center">
                    <ActionIcon variant="light" aria-label="Add a playlist to manage" onClick={() => dispatch(toggleDialog())} >
                        <IconBrandSpotify />
                    </ActionIcon>
                    <ActionIcon variant="light" aria-label="Favorite playlists" onClick={() => dispatch(toggleFavoriteDialog())} >
                        <IconStar />
                    </ActionIcon>
                    <ActionIcon variant="light" aria-label="Activate all" onClick={() => dispatch(setActiveAll('Y'))} >
                        <IconToggleRightFilled />
                    </ActionIcon>
                    <ActionIcon variant="light" aria-label="Dectivate all" onClick={() => dispatch(setActiveAll('N'))} >
                        <IconToggleLeft />
                    </ActionIcon>
                    <ActionIcon variant="light" aria-label="Invert active" onClick={() => dispatch(invertActiveAll())} >
                        <IconTransfer />
                    </ActionIcon>
                </Group>

            </Paper>
            <Paper shadow="xs" p="xs" m="xs">
                <Group grow justify="center">

                    <ActionIcon
                        aria-label="Add track to active"
                        onClick={currentTrack ? () => dispatch(addTrackToActive(currentTrack.item.uri)) : null}
                        disabled={!currentTrack}
                        color="green"
                    >
                        <IconCirclePlus />
                    </ActionIcon>

                    <ActionIcon
                        aria-label="Remove track from active"
                        onClick={currentTrack ? () => dispatch(removeTrackFromActive(currentTrack.item.uri)) : null}
                        disabled={!currentTrack}
                        color="red"
                    >
                        <IconCircleX />
                    </ActionIcon>
                </Group>
            </Paper>
        </>
    );
}
