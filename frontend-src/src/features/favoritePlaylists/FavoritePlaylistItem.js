import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Anchor, Grid, Paper, Text, Title } from '@mantine/core';
import {
    IconMusic,
} from '@tabler/icons-react';
import {
    getPlaylistMeta,
    selectPlaylistsMeta,
    addFavoritePlaylistToManaged
} from '../managedPlaylists/managedPlaylistsSlice';

export function FavoritePlaylistItem({ playlist }) {

    const playlistMeta = useSelector(selectPlaylistsMeta);
    let meta = null;
    if (playlistMeta) {
        if (playlistMeta[playlist.spotify_playlist_id]) {
            meta = playlistMeta[playlist.spotify_playlist_id];
        }
    }

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPlaylistMeta(playlist.spotify_playlist_id));
    }, [dispatch, playlist]);

    const renderItem = () => {
        if (!meta) {
            return <div aria-busy="true"></div>;
        }
        return (
            <Grid>
                <Grid.Col span={2}>
                    <img alt="Playlist cover" src={meta.images[1] ? meta.images[1].url : meta.images[0].url} className='CoverArt' />
                </Grid.Col>
                <Grid.Col span={7}>
                    <Title order={5}><Anchor size="xl" href={meta.uri} target="_blank" rel="noreferrer">{meta.name}</Anchor></Title>
                    <p>{meta.description}</p>
                    <IconMusic className='Notes' size={16} /><Text size='sm'>{meta.tracks.total} tracks</Text>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Button aria-label="Add to Managed Playlists" onClick={() => dispatch(addFavoritePlaylistToManaged(playlist.spotify_playlist_id))}>
                        Add to managed playlists
                    </Button>
                </Grid.Col>
            </Grid>
        )
    }

    return (
        <Paper className='FavoritePlaylistItem' shadow="xs" p="xs" m="xs">
            {renderItem()}
        </Paper>
    );
}

