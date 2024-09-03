import React from 'react';
import { useDispatch } from 'react-redux';
import { ActionIcon, Anchor, Grid, Image, Text, Tooltip } from '@mantine/core';
import {
    IconMusic,
    IconPlus
} from '@tabler/icons-react';
import { PaperStyled } from '../../components/PaperStyled';
import {
    addSpotifyPlaylistToManaged,
} from './spotifyPlaylistsSlice';
import { theme } from '../../app/theme';

export function SpotifyPlaylistItem({ playlist }) {

    const dispatch = useDispatch();

    return (
        <PaperStyled className='SpotifyPlaylistItem' withBorder shadow="xs" p="xs" my="xs" role='li'>
            <Grid>
                <Grid.Col span={{ base: 10}}>
                    <Grid>
                        <Grid.Col span={{ base: 3 }}>
                            <Image
                                className='CoverArt'
                                data-testid='Playlist cover'
                                alt="Playlist cover"
                                src={playlist.images[1] ? playlist.images[1].url : playlist.images[0].url}
                                mah={{ base: 50, xs: 80 }}
                                w='auto'
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 9 }}>
                            <Anchor c={theme.colors['pale-purple'][2]} fw={500} size="lg" href={playlist.uri} target="_blank" rel="noreferrer">{playlist.name}</Anchor>
                            <br />
                            <IconMusic className='Notes' size={20} /><Text size='md'>{playlist.tracks.total} tracks</Text>
                        </Grid.Col>
                    </Grid>
                </Grid.Col>
                <Grid.Col span={{ base: 2 }} ta='right'>
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
