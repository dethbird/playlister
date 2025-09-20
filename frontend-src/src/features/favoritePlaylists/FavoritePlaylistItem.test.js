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
    selectPlaylistsMeta,
    addFavoritePlaylistToManaged
} from '../managedPlaylists/managedPlaylistsSlice';
import { FavoritePlaylistItem } from './FavoritePlaylistItem';

let matchMedia;

jest.mock('../managedPlaylists/managedPlaylistsSlice', () => ({
    getPlaylistMeta: jest.fn(),
    selectPlaylistsMeta: jest.fn(),
    addFavoritePlaylistToManaged: jest.fn()
}));


let mockPlaylist;
let mockPlaylistMetadata;

describe('FavoritePlaylistItem', () => {
    beforeAll(() => {
        matchMedia = new MatchMediaMock();
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
        mockPlaylist = {
            id: 1000,
            spotify_playlist_id: 'XXX'
        }
    });

    afterEach(() => {
        matchMedia.clear();
    });

    test('renders the item', () => {
        selectPlaylistsMeta
            .mockReturnValue(mockPlaylistMetadata);
        getPlaylistMeta
            .mockReturnValue({ type: 'someAction' });
        const { getByText } = render(
            <Provider store={store}>
                <MantineProvider>
                    <FavoritePlaylistItem playlist={mockPlaylist} />
                </MantineProvider>
            </Provider>
        );

        expect(getByText(/100 tracks/i)).toBeInTheDocument();

    });

    test('renders a busy state when playlist meta is not yet available', () => {
        selectPlaylistsMeta
            .mockReturnValue({});
        getPlaylistMeta
            .mockReturnValue({ type: 'someAction' });
        render(
            <Provider store={store}>
                <MantineProvider>
                    <FavoritePlaylistItem playlist={mockPlaylist} />
                </MantineProvider>
            </Provider>
        );
        const loader = screen.getByRole('alert', { busy: true });
        expect(loader).toBeInTheDocument();

    });

    test('dispatches addFavoritePlaylistToManaged() when the favorite button is clicked', () => {
        selectPlaylistsMeta
            .mockReturnValue(mockPlaylistMetadata);
        getPlaylistMeta
            .mockReturnValue({ type: 'someAction' });
        addFavoritePlaylistToManaged
            .mockReturnValue({ type: 'someAction' });
        render(
            <Provider store={store}>
                <MantineProvider>
                    <FavoritePlaylistItem playlist={mockPlaylist} />
                </MantineProvider>
            </Provider>
        );
        const button = screen.getByRole('button', { name: "Add to Managed Playlists" });
        button.click();
        expect(addFavoritePlaylistToManaged).toHaveBeenCalledTimes(1);
        expect(addFavoritePlaylistToManaged).toHaveBeenCalledWith(mockPlaylist.spotify_playlist_id);

    });

    test('renders cover art index 0 when only one', () => {
        selectPlaylistsMeta
            .mockReturnValue(mockPlaylistMetadata);
        getPlaylistMeta
            .mockReturnValue({ type: 'someAction' });

        render(
            <Provider store={store}>
                <MantineProvider>
                    <FavoritePlaylistItem playlist={mockPlaylist} />
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
        getPlaylistMeta
            .mockReturnValue({ type: 'someAction' });

        render(
            <Provider store={store}>
                <MantineProvider>
                    <FavoritePlaylistItem playlist={mockPlaylist} />
                </MantineProvider>
            </Provider>
        );
        let image = screen.getByTestId('Playlist cover');

        expect(image).toBeInTheDocument();
        expect(image.src).toBe('http://image2/');

    });

    test('renders CD ROM icon when playlist has no images', () => {
        const mockPlaylistMetadataNoImages = {
            'XXX': {
                images: null,
                tracks: {
                    total: 100
                }
            }
        };
        
        selectPlaylistsMeta
            .mockReturnValue(mockPlaylistMetadataNoImages);
        getPlaylistMeta
            .mockReturnValue({ type: 'someAction' });

        const { container } = render(
            <Provider store={store}>
                <MantineProvider>
                    <FavoritePlaylistItem playlist={mockPlaylist} />
                </MantineProvider>
            </Provider>
        );
        
        // Should not find the playlist cover image
        const image = screen.queryByTestId('Playlist cover');
        expect(image).not.toBeInTheDocument();
        
        // Should find the CD ROM icon (IconDisc) - look for the SVG element
        const cdIcon = container.querySelector('svg.tabler-icon-disc');
        expect(cdIcon).toBeInTheDocument();
    });

    test('renders CD ROM icon when playlist has empty images array', () => {
        const mockPlaylistMetadataEmptyImages = {
            'XXX': {
                images: [],
                tracks: {
                    total: 100
                }
            }
        };
        
        selectPlaylistsMeta
            .mockReturnValue(mockPlaylistMetadataEmptyImages);
        getPlaylistMeta
            .mockReturnValue({ type: 'someAction' });

        const { container } = render(
            <Provider store={store}>
                <MantineProvider>
                    <FavoritePlaylistItem playlist={mockPlaylist} />
                </MantineProvider>
            </Provider>
        );
        
        // Should not find the playlist cover image
        const image = screen.queryByTestId('Playlist cover');
        expect(image).not.toBeInTheDocument();
        
        // Should find the CD ROM icon (IconDisc) - look for the SVG element
        const cdIcon = container.querySelector('svg.tabler-icon-disc');
        expect(cdIcon).toBeInTheDocument();
    });



});
