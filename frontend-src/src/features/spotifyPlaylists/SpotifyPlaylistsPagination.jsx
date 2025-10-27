import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Pagination } from '@mantine/core';
import {
    selectLimit,
    selectOffset,
    setOffset
} from './spotifyPlaylistsSlice';


export function SpotifyPlaylistsPagination({ userPlaylists }) {

    const limit = useSelector(selectLimit);
    const offset = useSelector(selectOffset);
    const dispatch = useDispatch();

    // receive userPlaylists as a prop
    if (!userPlaylists || !Array.isArray(userPlaylists)) return null;

    const total = userPlaylists.length;
    const pages = Math.max(1, Math.ceil(total / limit));
    const value = Math.floor(offset / limit) + 1;

    return (
        <Container justify='center'>
            <Pagination
                total={pages}
                value={value}
                onChange={value => {
                    const newOffset = (value - 1) * limit;
                    dispatch(setOffset(newOffset));
                }}
            />
        </Container>
    );
}
