import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import MatchMediaMock from 'jest-matchmedia-mock';
import { Provider } from 'react-redux';
import {
    MantineProvider,
} from '@mantine/core';
import { store } from '../../app/store';
import { addSpotifyPlaylistToManaged } from './spotifyPlaylistsSlice';
import { SpotifyPlaylistItem } from './SpotifyPlaylistItem';

let matchMedia;

jest.mock('./spotifyPlaylistsSlice', () => ({
    addSpotifyPlaylistToManaged: jest.fn()
}));

let mockSpotifyPlaylist;


describe('SpotifyPlaylistItem', () => {
    beforeAll(() => {
        matchMedia = new MatchMediaMock();
        mockSpotifyPlaylist = {
            id: 'XXX',
            images: [
                { url: 'http://image' }
            ],
            tracks: {
                total: 100
            }
        }
    });

    afterEach(() => {
        matchMedia.clear();
    });

    test('renders the item', () => {
        addSpotifyPlaylistToManaged
            .mockReturnValue({ type: 'someAction' });
        const { getByText } = render(
            <Provider store={store}>
                <MantineProvider>
                    <SpotifyPlaylistItem playlist={mockSpotifyPlaylist} />
                </MantineProvider>
            </Provider>
        );

        expect(getByText(/100 tracks/i)).toBeInTheDocument();

    });

    test('dispatches addFavoritePlaylistToManaged() when the favorite button is clicked', () => {
        addSpotifyPlaylistToManaged
            .mockReturnValue({ type: 'someAction' });
        render(
            <Provider store={store}>
                <MantineProvider>
                    <SpotifyPlaylistItem playlist={mockSpotifyPlaylist} />
                </MantineProvider>
            </Provider>
        );
        const button = screen.getByRole('button', { name: "Add to Managed Playlists" });
        button.click();
        expect(addSpotifyPlaylistToManaged).toHaveBeenCalledTimes(1);
        expect(addSpotifyPlaylistToManaged).toHaveBeenCalledWith(mockSpotifyPlaylist.id);

    });

    test('renders cover art index 0 when only one', () => {
        addSpotifyPlaylistToManaged
            .mockReturnValue({ type: 'someAction' });

        render(
            <Provider store={store}>
                <MantineProvider>
                    <SpotifyPlaylistItem playlist={mockSpotifyPlaylist} />
                </MantineProvider>
            </Provider>
        );
        let image = screen.getByTestId('Playlist cover');

        expect(image).toBeInTheDocument();
        expect(image.src).toBe('http://image/');

    });


    test('renders cover art index 1 when more than one', () => {

        mockSpotifyPlaylist.images.push({ url: 'http://image2' });
        addSpotifyPlaylistToManaged
            .mockReturnValue({ type: 'someAction' });

        render(
            <Provider store={store}>
                <MantineProvider>
                    <SpotifyPlaylistItem playlist={mockSpotifyPlaylist} />
                </MantineProvider>
            </Provider>
        );
        let image = screen.getByTestId('Playlist cover');

        expect(image).toBeInTheDocument();
        expect(image.src).toBe('http://image2/');

    });


});
