import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import MatchMediaMock from 'jest-matchmedia-mock';
import { Provider } from 'react-redux';
import {
    MantineProvider,
} from '@mantine/core';
import { store } from '../../app/store';
import {
    getPlaylistMeta,
    removeManagedPlaylist,
    selectPlaylistsMeta,
    togglePlaylistActive,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    toggleFavoritePlaylist
} from './managedPlaylistsSlice';
import {
    selectCurrentTrack
} from '../player/playerSlice'
import { ManagedPlaylistItem } from './ManagedPlaylistItem';

let matchMedia;

jest.mock('./managedPlaylistsSlice', () => ({
    getPlaylistMeta: jest.fn(),
    removeManagedPlaylist: jest.fn(),
    selectPlaylistsMeta: jest.fn(),
    togglePlaylistActive: jest.fn(),
    addTrackToPlaylist: jest.fn(),
    removeTrackFromPlaylist: jest.fn(),
    toggleFavoritePlaylist: jest.fn(),
    pause: jest.fn()
}));

jest.mock('../player/playerSlice', () => ({
    selectCurrentTrack: jest.fn(),
}));

let mockTrack;
let mockPlaylist;
let mockPlaylistMetadata;

describe('ManagedPlaylistItem', () => {
    beforeAll(() => {
        matchMedia = new MatchMediaMock();
        mockTrack = {
            timestamp: 555
        }
        mockPlaylist = {
            id: 1000,
            spotify_playlist_id: 'XXX'
        }
        mockPlaylistMetadata = {
            'XXX': {
                images: [
                    { url: 'http://image' }
                ],
                tracks: {
                    total: 100
                }
            }
        }
    });

    afterEach(() => {
        matchMedia.clear();
    });

    test('renders a busy state when playlist meta is not yet available', () => {
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectPlaylistsMeta
            .mockReturnValue({});
        getPlaylistMeta
            .mockReturnValue({ type: 'playlists/getMeta' });
        render(
            <Provider store={store}>
                <MantineProvider>
                    <ManagedPlaylistItem playlist={mockPlaylist} />
                </MantineProvider>
            </Provider>
        );
        const loader = screen.getByRole('alert', { busy: true });
        expect(loader).toBeInTheDocument();

    });


    test('renders the playlist item when playlist metadata is available', () => {
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectPlaylistsMeta
            .mockReturnValue(mockPlaylistMetadata);
        getPlaylistMeta
            .mockReturnValue({ type: 'playlists/getMeta' });
        render(
            <Provider store={store}>
                <MantineProvider>
                    <ManagedPlaylistItem playlist={mockPlaylist} />
                </MantineProvider>
            </Provider>
        );
        const button = screen.getByRole('button', { name: "Favorite / Unfavorite" });
        expect(button).toBeInTheDocument();

    });

    test('renders a solid favorite icon when playlist is already favorited by user', () => {
        mockPlaylist.favorited = true;
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectPlaylistsMeta
            .mockReturnValue(mockPlaylistMetadata);
        getPlaylistMeta
            .mockReturnValue({ type: 'playlists/getMeta' });
        render(
            <Provider store={store}>
                <MantineProvider>
                    <ManagedPlaylistItem playlist={mockPlaylist} />
                </MantineProvider>
            </Provider>
        );
        const icon = screen.getByTestId('IconStarFilled');
        expect(icon).toBeInTheDocument();

        const icon2 = screen.queryAllByTestId('IconStar');
        expect(icon2).length === 0;
    });


    test('renders a outline favorite icon when playlist is not favorited by user', () => {
        mockPlaylist.favorited = null;
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectPlaylistsMeta
            .mockReturnValue(mockPlaylistMetadata);
        getPlaylistMeta
            .mockReturnValue({ type: 'playlists/getMeta' });
        render(
            <Provider store={store}>
                <MantineProvider>
                    <ManagedPlaylistItem playlist={mockPlaylist} />
                </MantineProvider>
            </Provider>
        );
        const icon = screen.getByTestId('IconStar');
        expect(icon).toBeInTheDocument();

        const icon2 = screen.queryAllByTestId('IconStarFilled');
        expect(icon2).length === 0;
    });

    test('dispatches toggleFavoritePlaylist() when the favorite button is clicked', () => {
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectPlaylistsMeta
            .mockReturnValue(mockPlaylistMetadata);
        getPlaylistMeta
            .mockReturnValue({ type: 'playlists/getMeta' });
        toggleFavoritePlaylist
            .mockReturnValue({ type: 'playlists/toggleFavorite' });
        render(
            <Provider store={store}>
                <MantineProvider>
                    <ManagedPlaylistItem playlist={mockPlaylist} />
                </MantineProvider>
            </Provider>
        );
        const button = screen.getByRole('button', { name: "Favorite / Unfavorite" });
        button.click();
        expect(toggleFavoritePlaylist).toHaveBeenCalledTimes(1);
        expect(toggleFavoritePlaylist).toHaveBeenCalledWith(mockPlaylist.spotify_playlist_id);

    });

    test('dispatches removeManagedPlaylist() when the remove button is clicked', () => {
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectPlaylistsMeta
            .mockReturnValue(mockPlaylistMetadata);
        getPlaylistMeta
            .mockReturnValue({ type: 'playlists/getMeta' });
        removeManagedPlaylist
            .mockReturnValue({ type: 'playlists/removeManaged' });
        render(
            <Provider store={store}>
                <MantineProvider>
                    <ManagedPlaylistItem playlist={mockPlaylist} />
                </MantineProvider>
            </Provider>
        );
        const button = screen.getByRole('button', { name: "Remove from managed" });
        button.click();
        expect(removeManagedPlaylist).toHaveBeenCalledTimes(1);
        expect(removeManagedPlaylist).toHaveBeenCalledWith(mockPlaylist.id);

    });


    test('dispatches togglePlaylistActive() when the toggle active button is clicked', () => {
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectPlaylistsMeta
            .mockReturnValue(mockPlaylistMetadata);
        getPlaylistMeta
            .mockReturnValue({ type: 'playlists/getMeta' });
        togglePlaylistActive
            .mockReturnValue({ type: 'playlists/toggleActive' });
        render(
            <Provider store={store}>
                <MantineProvider>
                    <ManagedPlaylistItem playlist={mockPlaylist} />
                </MantineProvider>
            </Provider>
        );
        const button = screen.getByTestId('activation-switch');
        button.click();
        expect(togglePlaylistActive).toHaveBeenCalledTimes(1);
        expect(togglePlaylistActive).toHaveBeenCalledWith(mockPlaylist.id);

    });



    test('dispatches removeTrackFromPlaylist() when the remove track button is clicked', () => {
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectPlaylistsMeta
            .mockReturnValue(mockPlaylistMetadata);
        getPlaylistMeta
            .mockReturnValue({ type: 'playlists/getMeta' });
        removeTrackFromPlaylist
            .mockReturnValue({ type: 'playlists/removeTrack' });
        render(
            <Provider store={store}>
                <MantineProvider>
                    <ManagedPlaylistItem playlist={mockPlaylist} />
                </MantineProvider>
            </Provider>
        );
        const button = screen.getByRole('button', { name: "Remove track" });
        button.click();
        expect(removeTrackFromPlaylist).toHaveBeenCalledTimes(1);
        expect(removeTrackFromPlaylist).toHaveBeenCalledWith(mockPlaylist.spotify_playlist_id);

    });



    test('dispatches addTrackToPlaylist() when the remove track button is clicked', () => {
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectPlaylistsMeta
            .mockReturnValue(mockPlaylistMetadata);
        getPlaylistMeta
            .mockReturnValue({ type: 'playlists/getMeta' });
        addTrackToPlaylist
            .mockReturnValue({ type: 'playlists/addTrack' });
        render(
            <Provider store={store}>
                <MantineProvider>
                    <ManagedPlaylistItem playlist={mockPlaylist} />
                </MantineProvider>
            </Provider>
        );
        const button = screen.getByRole('button', { name: "Add track" });
        button.click();
        expect(addTrackToPlaylist).toHaveBeenCalledTimes(1);
        expect(addTrackToPlaylist).toHaveBeenCalledWith(mockPlaylist.spotify_playlist_id);

    });

    test('renders cover art index 0 when only one', () => {
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectPlaylistsMeta
            .mockReturnValue(mockPlaylistMetadata);
        getPlaylistMeta
            .mockReturnValue({ type: 'playlists/getMeta' });
        addTrackToPlaylist
            .mockReturnValue({ type: 'playlists/addTrack' });

        render(
            <Provider store={store}>
                <MantineProvider>
                    <ManagedPlaylistItem playlist={mockPlaylist} />
                </MantineProvider>
            </Provider>
        );
        let image = screen.getByTestId('Playlist cover');

        expect(image).toBeInTheDocument();
        expect(image.src).toBe('http://image/');

    });


    test('renders cover art index 1 when more than one', () => {

        mockPlaylistMetadata['XXX'].images.push({ url: 'http://image2' });
        selectPlaylistsMeta
            .mockReturnValue(mockPlaylistMetadata);
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectPlaylistsMeta
            .mockReturnValue(mockPlaylistMetadata);
        getPlaylistMeta
            .mockReturnValue({ type: 'playlists/getMeta' });
        addTrackToPlaylist
            .mockReturnValue({ type: 'playlists/addTrack' });

        render(
            <Provider store={store}>
                <MantineProvider>
                    <ManagedPlaylistItem playlist={mockPlaylist} />
                </MantineProvider>
            </Provider>
        );
        let image = screen.getByTestId('Playlist cover');

        expect(image).toBeInTheDocument();
        expect(image.src).toBe('http://image2/');

    });

    test('renders CD icon fallback when meta images array is empty', () => {
        const metadataWithoutImages = {
            'XXX': {
                images: [],
                tracks: { total: 100 }
            }
        };
        
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectPlaylistsMeta
            .mockReturnValue(metadataWithoutImages);
        getPlaylistMeta
            .mockReturnValue({ type: 'playlists/getMeta' });

        render(
            <Provider store={store}>
                <MantineProvider>
                    <ManagedPlaylistItem playlist={mockPlaylist} />
                </MantineProvider>
            </Provider>
        );
        
        const fallbackIcon = screen.getByTestId('Playlist cover fallback');
        expect(fallbackIcon).toBeInTheDocument();
        
        // Verify that no regular playlist cover image is present
        expect(screen.queryByTestId('Playlist cover')).not.toBeInTheDocument();
    });

    test('renders CD icon fallback when meta images property is null', () => {
        const metadataWithNullImages = {
            'XXX': {
                images: null,
                tracks: { total: 100 }
            }
        };
        
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectPlaylistsMeta
            .mockReturnValue(metadataWithNullImages);
        getPlaylistMeta
            .mockReturnValue({ type: 'playlists/getMeta' });

        render(
            <Provider store={store}>
                <MantineProvider>
                    <ManagedPlaylistItem playlist={mockPlaylist} />
                </MantineProvider>
            </Provider>
        );
        
        const fallbackIcon = screen.getByTestId('Playlist cover fallback');
        expect(fallbackIcon).toBeInTheDocument();
        
        // Verify that no regular playlist cover image is present
        expect(screen.queryByTestId('Playlist cover')).not.toBeInTheDocument();
    });

    test('renders CD icon fallback when meta images property is undefined', () => {
        const metadataWithUndefinedImages = {
            'XXX': {
                tracks: { total: 100 }
                // images property is missing
            }
        };
        
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectPlaylistsMeta
            .mockReturnValue(metadataWithUndefinedImages);
        getPlaylistMeta
            .mockReturnValue({ type: 'playlists/getMeta' });

        render(
            <Provider store={store}>
                <MantineProvider>
                    <ManagedPlaylistItem playlist={mockPlaylist} />
                </MantineProvider>
            </Provider>
        );
        
        const fallbackIcon = screen.getByTestId('Playlist cover fallback');
        expect(fallbackIcon).toBeInTheDocument();
        
        // Verify that no regular playlist cover image is present
        expect(screen.queryByTestId('Playlist cover')).not.toBeInTheDocument();
    });

});
