import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionIcon, Anchor, Grid, Image, Text, Tooltip } from '@mantine/core';
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
                <Grid.Col span={{ base: 10 }}>
                    <Grid>
                        <Grid.Col span={{ base: 3 }}>
                            <Image
                                className='CoverArt'
                                data-testid='Playlist cover'
                                alt="Playlist cover"
                                src={meta.images[1] ? meta.images[1].url : meta.images[0].url}
                                mah={{ base: 50, xs: 80 }}
                                w='auto'
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 9 }} className='PlaylistDetails' >
                            <Anchor fw={500} size="xl" href={meta.uri} target="_blank" rel="noreferrer">{meta.name}</Anchor>
                            <br />
                            <IconMusic className='Notes' size={20} /><Text size='md'>{meta.tracks.total} tracks</Text>
                        </Grid.Col>
                    </Grid>
                </Grid.Col>
                <Grid.Col span={{ base: 2 }} ta='right'>
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
        <PaperStyled className='FavoritePlaylistItem' withBorder shadow="xs" p="xs" my="xs" role='li' >
            {renderItem()}
        </PaperStyled>
    );
}
