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

    test('renders nothing if dialogIsOpen not true', async () => {
        getSpotifyPlaylists
            .mockReturnValue({ type: 'someAction' });
        selectCurrentPage
            .mockReturnValue(mockCurrentPage);
        selectStatus
            .mockReturnValue('pending');
        selectdDialogIsOpen
            .mockReturnValue(false);

        render(
            <Provider store={store}>
                <MantineProvider>
                    <SpotifyPlaylists spotifyUser={mockSpotifyUser} />
                </MantineProvider>
            </Provider>
        );
        const items = await screen.queryAllByRole('li');
        expect(items.length).toBe(0);

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
        expect(items.length).toBe(2);

    });

    test('renders empty state message when user has no playlists', async () => {
        getSpotifyPlaylists
            .mockReturnValue({ type: 'someAction' });
        selectCurrentPage
            .mockReturnValue({
                total: 0,
                limit: 25,
                items: []
            });
        selectStatus
            .mockReturnValue('fulfilled');
        selectdDialogIsOpen
            .mockReturnValue(true);
        
        render(
            <Provider store={store}>
                <MantineProvider>
                    <SpotifyPlaylists spotifyUser={mockSpotifyUser} />
                </MantineProvider>
            </Provider>
        );
        
        expect(screen.getByText('You have not created any playlists yet!')).toBeInTheDocument();
        
        // Check that the Spotify link exists and has the correct href
        const spotifyLink = screen.getByRole('link');
        expect(spotifyLink).toHaveAttribute('href', 'spotify:');
        expect(spotifyLink).toHaveAttribute('target', '_blank');
        expect(spotifyLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    test('renders empty state when user has playlists but none owned by them', async () => {
        const playlistsNotOwnedByUser = [{
            id: 'XXX',
            images: [{ url: 'http://image' }],
            tracks: { total: 100 },
            owner: { id: 99999 } // Different from mockSpotifyUser.id
        }];
        
        getSpotifyPlaylists
            .mockReturnValue({ type: 'someAction' });
        selectCurrentPage
            .mockReturnValue({
                total: 1,
                limit: 25,
                items: playlistsNotOwnedByUser
            });
        selectStatus
            .mockReturnValue('fulfilled');
        selectdDialogIsOpen
            .mockReturnValue(true);
        
        render(
            <Provider store={store}>
                <MantineProvider>
                    <SpotifyPlaylists spotifyUser={mockSpotifyUser} />
                </MantineProvider>
            </Provider>
        );
        
        expect(screen.getByText('You have not created any playlists yet!')).toBeInTheDocument();
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
