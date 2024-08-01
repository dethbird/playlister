import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionIcon, Group, Paper, Text, Tooltip } from '@mantine/core';
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
    console.log('ct', currentTrack.timestamp === undefined);

    const dispatch = useDispatch();

    return (
        <>
            <Text tt='uppercase' ta='left'>Playlists</Text>
            <Paper shadow="xs" p="xs">
                <Group className='ManagedPlaylistsNav' grow justify="center">
                    <Tooltip label="Add a spotify playlist to manage">
                        <ActionIcon variant="light" aria-label="Add a spotify playlist to manage" onClick={() => dispatch(toggleDialog())} >
                            <IconBrandSpotify />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Favorite playlists">
                        <ActionIcon variant="light" aria-label="Favorite playlists" onClick={() => dispatch(toggleFavoriteDialog())} >
                            <IconStar />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Activate all">
                        <ActionIcon variant="light" aria-label="Activate all" onClick={() => dispatch(setActiveAll('Y'))} >
                            <IconToggleRightFilled />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Deactivate all">
                        <ActionIcon variant="light" aria-label="Dectivate all" onClick={() => dispatch(setActiveAll('N'))} >
                            <IconToggleLeft />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Invert active">
                        <ActionIcon variant="light" aria-label="Invert active" onClick={() => dispatch(invertActiveAll())} >
                            <IconTransfer />
                        </ActionIcon>
                    </Tooltip>
                </Group>

            </Paper>
            <Text tt='uppercase' ta='left'>Add / Remove currently playing</Text>
            <Paper shadow="xs" p="xs" >
                <Group grow justify="center">
                    <Tooltip label="Add currently playing to active">
                        <ActionIcon
                            aria-label="Add track to active"
                            onClick={currentTrack.timestamp !== undefined ? () => dispatch(addTrackToActive(currentTrack.item.uri)) : null}
                            disabled={currentTrack.timestamp === undefined}
                            color="green"
                        >
                            <IconCirclePlus />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Remove currently playing from active">
                        <ActionIcon
                            aria-label="Remove track from active"
                            onClick={currentTrack.timestamp !== undefined  ? () => dispatch(removeTrackFromActive(currentTrack.item.uri)) : null}
                            disabled={currentTrack.timestamp === undefined}
                            color="red"
                        >
                            <IconCircleX />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Paper>
        </>
    );
}
