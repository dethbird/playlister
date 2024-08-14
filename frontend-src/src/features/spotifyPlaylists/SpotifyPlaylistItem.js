import React from 'react';
import { useDispatch } from 'react-redux';
import { ActionIcon, Anchor, Grid, Text, Tooltip } from '@mantine/core';
import {
    IconMusic,
    IconPlus
} from '@tabler/icons-react';
import { PaperStyled } from '../../components/PaperStyled';
import {
    addSpotifyPlaylistToManaged,
} from './spotifyPlaylistsSlice';

export function SpotifyPlaylistItem({ playlist }) {

    const dispatch = useDispatch();

    return (
        <PaperStyled className='SpotifyPlaylistItem' withBorder shadow="xs" p="xs" my="xs" role='li'>
            <Grid>
                <Grid.Col span={10}>
                    <Grid>
                        <Grid.Col span={{ base: 12, sm: 3 }}>
                            <img className='CoverArt' data-testid="Playlist cover" alt="Playlist cover" src={playlist.images[1] ? playlist.images[1].url : playlist.images[0].url} />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 9 }}>
                            <Anchor fw={500} size="lg" href={playlist.uri} target="_blank" rel="noreferrer">{playlist.name}</Anchor>
                            <p>{playlist.description}</p>
                            <IconMusic className='Notes' size={16} /><Text size='sm'>{playlist.tracks.total} tracks</Text>
                        </Grid.Col>
                    </Grid>
                </Grid.Col>
                <Grid.Col span={2}>
                    <Tooltip label="Add to Managed Playlists">
                        <ActionIcon size='lg' aria-label="Add to Managed Playlists" onClick={() => dispatch(addSpotifyPlaylistToManaged(playlist.id))}>
                            <IconPlus />
                        </ActionIcon>
                    </Tooltip>
                </Grid.Col>
            </Grid>
        </PaperStyled>
    );
}
