import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Anchor, Grid, Paper, Text } from '@mantine/core';
import {
    IconMusic,
} from '@tabler/icons-react';
import {
    addSpotifyPlaylistToManaged,
} from './spotifyPlaylistsSlice';

export function SpotifyPlaylistItem({ playlist }) {

    const dispatch = useDispatch();

    return (
        <Paper className='SpotifyPlaylistItem' shadow="xs" p="xs" m="xs">
            <Grid>
                <Grid.Col span={7}>
                    <Grid>
                        <Grid.Col span={{base: 12, sm: 3}}>
                            <img className='CoverArt' alt="Playlist cover" src={playlist.images[1] ? playlist.images[1].url : playlist.images[0].url} />
                        </Grid.Col>
                        <Grid.Col span={{base: 12, sm: 9}}>
                            <Anchor fw={500} size="lg" href={playlist.uri} target="_blank" rel="noreferrer">{playlist.name}</Anchor>
                            <p>{playlist.description}</p>
                            <IconMusic className='Notes' size={16} /><Text size='sm'>{playlist.tracks.total} tracks</Text>
                        </Grid.Col>
                    </Grid>
                </Grid.Col>
                <Grid.Col span={5}>
                    <Button aria-label="Add to Managed Playlists" onClick={() => dispatch(addSpotifyPlaylistToManaged(playlist.id))}>
                        Add to managed playlists
                    </Button>
                </Grid.Col>
            </Grid>
        </Paper>
    );
}

