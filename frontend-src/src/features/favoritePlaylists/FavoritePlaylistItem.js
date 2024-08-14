import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionIcon, Anchor, Grid, Text, Tooltip } from '@mantine/core';
import {
    IconMusic,
    IconPlus
} from '@tabler/icons-react';
import { PaperStyled } from '../../components/PaperStyled';
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
            return <div role='alert' aria-busy="true"></div>;
        }
        return (
            <Grid>
                <Grid.Col span={10}>
                    <Grid>
                        <Grid.Col span={{ base: 12, sm: 3 }}>
                            <img alt="Playlist cover" data-testid='Playlist cover' src={meta.images[1] ? meta.images[1].url : meta.images[0].url} className='CoverArt' />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 9 }} >
                            <Anchor fw={500} size="lg" href={meta.uri} target="_blank" rel="noreferrer">{meta.name}</Anchor>
                            <p>{meta.description}</p>
                            <IconMusic className='Notes' size={16} /><Text size='sm'>{meta.tracks.total} tracks</Text>
                        </Grid.Col>
                    </Grid>
                </Grid.Col>
                <Grid.Col span={2}>
                    <Tooltip label="Add to Managed Playlists">
                        <ActionIcon size='lg' role='button' aria-label="Add to Managed Playlists" onClick={() => dispatch(addFavoritePlaylistToManaged(playlist.spotify_playlist_id))}>
                            <IconPlus />
                        </ActionIcon>
                    </Tooltip>
                </Grid.Col>
            </Grid>
        )
    }

    return (
        <PaperStyled className='FavoritePlaylistItem' withBorder shadow="xs" p="xs" my="xs">
            {renderItem()}
        </PaperStyled>
    );
}
