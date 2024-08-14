import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import MatchMediaMock from 'jest-matchmedia-mock';
import { Provider } from 'react-redux';
import {
    MantineProvider,
} from '@mantine/core';
import { store } from '../../app/store';
import {
    getFavoritePlaylists,
    selectFavoriteStatus,
    selectFavoritePlaylists,
    selectFavoriteDialogIsOpen,
    getPlaylistMeta,
    selectPlaylistsMeta,
    toggleFavoriteDialog
} from '../managedPlaylists/managedPlaylistsSlice';
import { FavoritePlaylists } from './FavoritePlaylists';

let matchMedia;

jest.mock('../managedPlaylists/managedPlaylistsSlice', () => ({
    getFavoritePlaylists: jest.fn(),
    selectFavoriteStatus: jest.fn(),
    selectFavoritePlaylists: jest.fn(),
    selectFavoriteDialogIsOpen: jest.fn(),
    getPlaylistMeta: jest.fn(),
    selectPlaylistsMeta: jest.fn(),
    toggleFavoriteDialog: jest.fn()
}));


let mockPlaylistMetadata;

describe('ManagedPlaylists', () => {
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
            },
            'YYY': {
                images: [
                    { url: 'http://image2' }
                ],
                tracks: {
                    total: 130
                }
            }
        }
    });

    afterEach(() => {
        matchMedia.clear();
    });

    test('renders a busy state when status is pending', () => {
        getFavoritePlaylists
            .mockReturnValue({ type: 'someAction' });
        getPlaylistMeta
            .mockReturnValue({ type: 'someAction' });
        selectFavoritePlaylists
            .mockReturnValue([]);
        selectFavoriteStatus
            .mockReturnValue('pending');
        selectFavoriteDialogIsOpen
            .mockReturnValue(true);

        render(
            <Provider store={store}>
                <MantineProvider>
                    <FavoritePlaylists />
                </MantineProvider>
            </Provider>
        );
        const loader = screen.getByRole('alert', { busy: true });
        expect(loader).toBeInTheDocument();

    });


    test('renders favorite playlist items when they exist', async () => {
        getFavoritePlaylists
            .mockReturnValue({ type: 'someAction' });
        getPlaylistMeta
            .mockReturnValue({ type: 'playlists/getMeta' });
        selectFavoritePlaylists
            .mockReturnValue([{ id: 100, spotify_playlist_id: 'XXX' }, { id: 200, spotify_playlist_id: 'YYY' }]);
        selectFavoriteStatus
            .mockReturnValue('fulfilled');
        selectFavoriteDialogIsOpen
            .mockReturnValue(true);
        selectPlaylistsMeta.mockReturnValue(mockPlaylistMetadata);
        const container = render(
            <Provider store={store}>
                <MantineProvider>
                    <FavoritePlaylists />
                </MantineProvider>
            </Provider>
        );
        const items = await screen.queryAllByRole('li');
        expect(items.length).toBe(2);

    });

    test('dispatches toggleFavoriteDialog() when onHandleDrag it triggered', async () => {
        getFavoritePlaylists
            .mockReturnValue({ type: 'someAction' });
        getPlaylistMeta
            .mockReturnValue({ type: 'playlists/getMeta' });
        selectFavoritePlaylists
            .mockReturnValue([{ id: 100, spotify_playlist_id: 'XXX' }, { id: 200, spotify_playlist_id: 'YYY' }]);
        selectFavoriteStatus
            .mockReturnValue('fulfilled');
        selectFavoriteDialogIsOpen
            .mockReturnValue(true);
        selectPlaylistsMeta.mockReturnValue(mockPlaylistMetadata);
        toggleFavoriteDialog
            .mockReturnValue({ type: 'someAction' });
        render(
            <Provider store={store}>
                <MantineProvider>
                    <FavoritePlaylists />
                </MantineProvider>
            </Provider>
        );
        const modal = await screen.getByRole('dialog', { name: 'Your favorited playlists'});
        fireEvent.keyDown(modal, { key: 'Escape', code: 'Escape' });
        expect(toggleFavoriteDialog).toHaveBeenCalledTimes(1);
    });

});
