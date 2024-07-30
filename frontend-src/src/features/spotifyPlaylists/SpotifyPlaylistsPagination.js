import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    getSpotifyPlaylists,
    selectCurrentPage,
} from './spotifyPlaylistsSlice';


export function SpotifyPlaylistsPagination() {

    const currentPage = useSelector(selectCurrentPage);

    const dispatch = useDispatch();

    const renderPageButtons = () => {
        const buttons = [];
        for (let i = 0; i < currentPage.total; i += currentPage.limit) {
            const button = (
                <button
                disabled={currentPage.offset === i}
                onClick={() => {
                    dispatch(getSpotifyPlaylists({
                        limit: currentPage.limit,
                        offset: i
                    }))
                }}>{(i / currentPage.limit) + 1}</button>
            );
            buttons.push(button);
        }
        return buttons;
    };

    return (
        <div role="group">
            <button
                disabled={currentPage.previous === null}
                onClick={() => {
                    dispatch(getSpotifyPlaylists({
                        limit: currentPage.limit,
                        offset: currentPage.offset - currentPage.limit
                    }))
                }}>prev!</button>
            { renderPageButtons() }
            <button
                disabled={currentPage.next === null}
                onClick={() => {
                    dispatch(getSpotifyPlaylists({
                        limit: currentPage.limit,
                        offset: currentPage.offset + currentPage.limit
                    }))
                }}>next!</button>
        </div>
    );
}
