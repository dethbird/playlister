import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Anchor, Grid, Paper, Text, Title } from '@mantine/core';
import {
    IconCirclePlus,
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
                <Grid.Col span={2}>
                    <img className='CoverArt' alt="Playlist cover" src={playlist.images[1] ? playlist.images[1].url : playlist.images[0].url} />
                </Grid.Col>
                <Grid.Col span={7}>
                    <Title order={5}><Anchor size="xl" href={playlist.uri} target="_blank" rel="noreferrer">{playlist.name}</Anchor></Title>
                    <p>{playlist.description}</p>
                    <IconMusic className='Notes' size={16} /><Text size='sm'>{playlist.tracks.total} tracks</Text>
                </Grid.Col>
                <Grid.Col span={3}>
                    {/* <button
                        className='outline'
                        onClick={() => {
                            dispatch(addSpotifyPlaylistToManaged(playlist.id))
                        }}
                    >Add to Managed Playlists</button> */}
                    <Button aria-label="Add to Managed Playlists" onClick={() => dispatch(addSpotifyPlaylistToManaged(playlist.id))}>
                        Add to managed playlists
                    </Button>
                </Grid.Col>
            </Grid>
        </Paper>
    );
}

