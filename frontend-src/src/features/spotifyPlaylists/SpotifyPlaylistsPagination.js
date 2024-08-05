import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Pagination } from '@mantine/core';
import {
    getSpotifyPlaylists,
    selectCurrentPage,
} from './spotifyPlaylistsSlice';


export function SpotifyPlaylistsPagination() {

    const currentPage = useSelector(selectCurrentPage);

    const dispatch = useDispatch();

    return (
        <Container justify='center'>
            <Pagination
                total={Math.ceil(currentPage.total / currentPage.limit)}
                value={currentPage.offset / currentPage.limit + 1}
                onChange={value => {
                    dispatch(getSpotifyPlaylists({
                        limit: currentPage.limit,
                        offset: (value - 1) * currentPage.limit
                    }))
                }}
            />
        </Container>
    );
}
