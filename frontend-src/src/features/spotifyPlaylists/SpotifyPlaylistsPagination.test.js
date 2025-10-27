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
    setOffset,
} from './spotifyPlaylistsSlice';
import { SpotifyPlaylistsPagination } from './SpotifyPlaylistsPagination';

let matchMedia;

jest.mock('./spotifyPlaylistsSlice', () => ({
    getSpotifyPlaylists: jest.fn(),
    selectCurrentPage: jest.fn(),
    // pagination selectors/actions used by the component
    selectLimit: jest.fn(),
    selectOffset: jest.fn(),
    setOffset: jest.fn(),
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
        // sensible pagination defaults for the selectors
        // import the mocked selectors from the module to set return values
    const { selectLimit, selectOffset, setOffset } = require('./spotifyPlaylistsSlice');
    selectLimit.mockReturnValue(mockCurrentPage.limit);
    selectOffset.mockReturnValue(0);
    // ensure setOffset returns a plain action so dispatch(setOffset(...)) works in tests
    setOffset.mockImplementation((payload) => ({ type: 'spotify/setOffset', payload }));
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
                    <SpotifyPlaylistsPagination userPlaylists={null} />
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
        const userPlaylists = new Array(mockCurrentPage.total).fill({});
        render(
            <Provider store={store}>
                <MantineProvider>
                    <SpotifyPlaylistsPagination userPlaylists={userPlaylists} />
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
        const userPlaylists = new Array(mockCurrentPage.total).fill({});
        render(
            <Provider store={store}>
                <MantineProvider>
                    <SpotifyPlaylistsPagination userPlaylists={userPlaylists} />
                </MantineProvider>
            </Provider>
        );
        const button = await screen.findByRole('button', { name: '3' });
        fireEvent.click(button);
        // component dispatches setOffset when a page is chosen
        expect(setOffset).toHaveBeenCalledTimes(1);
        expect(setOffset).toHaveBeenCalledWith((3 - 1) * mockCurrentPage.limit);
    });

});
