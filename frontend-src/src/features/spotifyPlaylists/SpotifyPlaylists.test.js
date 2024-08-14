import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import MatchMediaMock from 'jest-matchmedia-mock';
import { Provider } from 'react-redux';
import {
    MantineProvider,
} from '@mantine/core';
import { store } from '../../app/store';
import {
    getSpotifyPlaylists,
    selectCurrentPage,
    selectdDialogIsOpen,
    selectStatus,
    toggleDialog
} from './spotifyPlaylistsSlice';
import { SpotifyPlaylists } from './SpotifyPlaylists';

let matchMedia;

jest.mock('./spotifyPlaylistsSlice', () => ({
    getSpotifyPlaylists: jest.fn(),
    selectCurrentPage: jest.fn(),
    selectdDialogIsOpen: jest.fn(),
    selectStatus: jest.fn(),
    toggleDialog: jest.fn(),
}));


let mockCurrentPage;
let mockPlaylistMetadata;
let mockSpotifyUser

describe('SpotifyPlaylistsTest', () => {
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
            total: 15,
            limit: 25,
            items: mockPlaylistMetadata

        };
        mockSpotifyUser = {
            id: 12345
        };
    });

    afterEach(() => {
        matchMedia.clear();
    });

    test('renders a busy state when status is pending', () => {
        getSpotifyPlaylists
            .mockReturnValue({ type: 'someAction' });
        selectCurrentPage
            .mockReturnValue(null);
        selectStatus
            .mockReturnValue('pending');
        selectdDialogIsOpen
            .mockReturnValue(true);

        render(
            <Provider store={store}>
                <MantineProvider>
                    <SpotifyPlaylists spotifyUser={mockSpotifyUser} />
                </MantineProvider>
            </Provider>
        );
        const loader = screen.getByRole('alert', { busy: true });
        expect(loader).toBeInTheDocument();

    });


    test('renders spotify playlist items when they exist', async () => {
        getSpotifyPlaylists
            .mockReturnValue({ type: 'someAction' });
        selectCurrentPage
            .mockReturnValue(mockCurrentPage);
        selectStatus
            .mockReturnValue('pending');
        selectdDialogIsOpen
            .mockReturnValue(true);
        const container = render(
            <Provider store={store}>
                <MantineProvider>
                    <SpotifyPlaylists spotifyUser={mockSpotifyUser} />
                </MantineProvider>
            </Provider>
        );
        const items = await screen.queryAllByRole('li');
        console.log(items);
        expect(items.length).toBe(2);

    });

    test('dispatches toggleFavoriteDialog() when onHandleDrag it triggered', async () => {
        getSpotifyPlaylists
            .mockReturnValue({ type: 'someAction' });
        selectCurrentPage
            .mockReturnValue(mockCurrentPage);
        selectStatus
            .mockReturnValue('pending');
        selectdDialogIsOpen
            .mockReturnValue(true);
        toggleDialog
            .mockReturnValue({ type: 'someAction' });
        render(
            <Provider store={store}>
                <MantineProvider>
                    <SpotifyPlaylists spotifyUser={mockSpotifyUser} />
                </MantineProvider>
            </Provider>
        );
        const modal = await screen.getByRole('dialog', { name: 'Your Spotify playlists' });
        fireEvent.keyDown(modal, { key: 'Escape', code: 'Escape' });
        expect(toggleDialog).toHaveBeenCalledTimes(1);
    });

});
