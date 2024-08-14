import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import MatchMediaMock from 'jest-matchmedia-mock';
import { Provider } from 'react-redux';
import {
    closeOnEscape,
    getContrastColor,
    MantineProvider,
} from '@mantine/core';
import { store } from '../../app/store';
import {
    getSpotifyPlaylists,
    selectCurrentPage,
} from './spotifyPlaylistsSlice';
import { SpotifyPlaylistsPagination } from './SpotifyPlaylistsPagination';

let matchMedia;

jest.mock('./spotifyPlaylistsSlice', () => ({
    getSpotifyPlaylists: jest.fn(),
    selectCurrentPage: jest.fn(),
}));


let mockCurrentPage;
let mockPlaylistMetadata;

describe('SpotifyPlaylistsPaginationTest', () => {
    beforeAll(() => {
        matchMedia = new MatchMediaMock();

        mockPlaylistMetadata = [{
            id: 'XXX',
            images: [
                { url: 'http://image' }
            ],
            tracks: {
                total: 100
            },
            owner: {
                id: 12345
            }
        }, {
            id: 'YYY',
            images: [
                { url: 'http://image2' }
            ],
            tracks: {
                total: 130
            },
            owner: {
                id: 12345
            }
        }];
        mockCurrentPage = {
            total: 94,
            limit: 25,
            items: mockPlaylistMetadata

        };
    });

    afterEach(() => {
        matchMedia.clear();
    });

    test('renders nothing if current page is null', () => {
        getSpotifyPlaylists
            .mockReturnValue({ type: 'someAction' });
        selectCurrentPage
            .mockReturnValue(null);
        render(
            <Provider store={store}>
                <MantineProvider>
                    <SpotifyPlaylistsPagination  />
                </MantineProvider>
            </Provider>
        );
        const buttons = screen.queryAllByRole('button', { name: '3' });
        expect(buttons.length).toBe(0);

    });

    test('renders pagination based on current page', () => {
        getSpotifyPlaylists
            .mockReturnValue({ type: 'someAction' });
        selectCurrentPage
            .mockReturnValue(mockCurrentPage);
        render(
            <Provider store={store}>
                <MantineProvider>
                    <SpotifyPlaylistsPagination  />
                </MantineProvider>
            </Provider>
        );
        const button = screen.getByRole('button', { name: '3' });
        expect(button).toBeInTheDocument();

    });


    test('dispatches getSpotifyPlaylists() when a pagination button is clicked', async () => {
        getSpotifyPlaylists
            .mockReturnValue({ type: 'someAction' });
        selectCurrentPage
            .mockReturnValue(mockCurrentPage);
        render(
            <Provider store={store}>
                <MantineProvider>
                    <SpotifyPlaylistsPagination />
                </MantineProvider>
            </Provider>
        );
        const button = screen.getByRole('button', { name: '3' });
        fireEvent.click(button, 3);
        expect(getSpotifyPlaylists).toHaveBeenCalledTimes(1);
        expect(getSpotifyPlaylists).toHaveBeenCalledWith({
            limit: mockCurrentPage.limit,
            offset: (3 - 1) * mockCurrentPage.limit
        });
    });

});
