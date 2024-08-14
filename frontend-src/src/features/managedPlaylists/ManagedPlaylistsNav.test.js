import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import MatchMediaMock from 'jest-matchmedia-mock';
import { Provider } from 'react-redux';
import {
    MantineProvider,
} from '@mantine/core';
import { store } from '../../app/store';
import {
    selectPlaylists,
    selectFavoritePlaylists,
    invertActiveAll,
    setActiveAll,
    addTrackToActive,
    removeTrackFromActive,
    toggleFavoriteDialog
} from './managedPlaylistsSlice';
import {
    selectCurrentTrack
} from '../player/playerSlice';
import {
    toggleDialog,
} from '../spotifyPlaylists/spotifyPlaylistsSlice';
import { ManagedPlaylistsNav } from './ManagedPlaylistsNav';

let matchMedia;

jest.mock('./managedPlaylistsSlice', () => ({
    selectPlaylists: jest.fn(),
    selectFavoritePlaylists: jest.fn(),
    invertActiveAll: jest.fn(),
    setActiveAll: jest.fn(),
    addTrackToActive: jest.fn(),
    removeTrackFromActive: jest.fn(),
    toggleFavoriteDialog: jest.fn()
}));

jest.mock('../player/playerSlice', () => ({
    selectCurrentTrack: jest.fn(),
}));

jest.mock('../spotifyPlaylists/spotifyPlaylistsSlice', () => ({
    toggleDialog: jest.fn(),
}));

let mockTrack;

describe('ManagedPlaylistsNav', () => {
    beforeAll(() => {
        matchMedia = new MatchMediaMock();
        mockTrack = {
            timestamp: 555,
            item: {
                uri: 'http://music'
            }
        }
    });

    afterEach(() => {
        matchMedia.clear();
    });

    test('renders the nav', () => {
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectPlaylists
            .mockReturnValue([]);
        selectFavoritePlaylists
            .mockReturnValue([]);
        const { getByText } = render(
            <Provider store={store}>
                <MantineProvider>
                    <ManagedPlaylistsNav />
                </MantineProvider>
            </Provider>
        );

        expect(getByText(/Playlists/i)).toBeInTheDocument();
        expect(getByText(/Add \/ Remove currently playing/i)).toBeInTheDocument();

    });

    test('dispatches toggleDialog() when the open Spotify dialog is clicked button is clicked', () => {
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectPlaylists
            .mockReturnValue([]);
        selectFavoritePlaylists
            .mockReturnValue([]);
        toggleDialog
            .mockReturnValue({ type: 'actionType' });
        render(
            <Provider store={store}>
                <MantineProvider>
                    <ManagedPlaylistsNav />
                </MantineProvider>
            </Provider>
        );
        const button = screen.getByRole('button', { name: "Add a spotify playlist to manage" });
        button.click();
        expect(toggleDialog).toHaveBeenCalledTimes(1);

    });



    test('dispatches toggleFavoriteDialog() when the open Spotify dialog is clicked button is clicked', () => {
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectPlaylists
            .mockReturnValue([]);
        selectFavoritePlaylists
            .mockReturnValue([{ id: 'XXX' }]);
        toggleFavoriteDialog
            .mockReturnValue({ type: 'actionType' });
        render(
            <Provider store={store}>
                <MantineProvider>
                    <ManagedPlaylistsNav />
                </MantineProvider>
            </Provider>
        );
        const button = screen.getByRole('button', { name: "Favorite playlists" });
        fireEvent.click(button);
        expect(toggleFavoriteDialog).toHaveBeenCalledTimes(1);

    });


    test('dispatches setActiveAll() with Y when the set activa all button is clicked', () => {
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectPlaylists
            .mockReturnValue([{ id: 100 }]);
        selectFavoritePlaylists
            .mockReturnValue([{ id: 'XXX' }]);
        setActiveAll
            .mockReturnValue({ type: 'actionType' });
        render(
            <Provider store={store}>
                <MantineProvider>
                    <ManagedPlaylistsNav />
                </MantineProvider>
            </Provider>
        );
        const button = screen.getByRole('button', { name: "Activate all" });
        fireEvent.click(button);
        expect(setActiveAll).toHaveBeenCalledTimes(1);
        expect(setActiveAll).toHaveBeenCalledWith('Y');

    });


    test('dispatches setActiveAll() with N when the set deactivate all button is clicked', () => {
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectPlaylists
            .mockReturnValue([{ id: 100 }]);
        selectFavoritePlaylists
            .mockReturnValue([{ id: 'XXX' }]);
        setActiveAll
            .mockReturnValue({ type: 'actionType' });
        render(
            <Provider store={store}>
                <MantineProvider>
                    <ManagedPlaylistsNav />
                </MantineProvider>
            </Provider>
        );
        const button = screen.getByRole('button', { name: "Dectivate all" });
        fireEvent.click(button);
        expect(setActiveAll).toHaveBeenCalledTimes(1);
        expect(setActiveAll).toHaveBeenCalledWith('N');

    });

    test('dispatches invertActiveAll() with N when the set invert all button is clicked', () => {
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectPlaylists
            .mockReturnValue([{ id: 100 }]);
        selectFavoritePlaylists
            .mockReturnValue([{ id: 'XXX' }]);
        invertActiveAll
            .mockReturnValue({ type: 'actionType' });
        render(
            <Provider store={store}>
                <MantineProvider>
                    <ManagedPlaylistsNav />
                </MantineProvider>
            </Provider>
        );
        const button = screen.getByRole('button', { name: "Invert active" });
        fireEvent.click(button);
        expect(invertActiveAll).toHaveBeenCalledTimes(1);

    });

    test('dispatches removeTrackFromActive() when remove track is clicked', () => {
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectPlaylists
            .mockReturnValue([{ id: 100 }]);
        selectFavoritePlaylists
            .mockReturnValue([{ id: 'XXX' }]);
        removeTrackFromActive
            .mockReturnValue({ type: 'actionType' });
        render(
            <Provider store={store}>
                <MantineProvider>
                    <ManagedPlaylistsNav />
                </MantineProvider>
            </Provider>
        );
        const button = screen.getByRole('button', { name: "Remove track from active" });
        fireEvent.click(button);
        expect(removeTrackFromActive).toHaveBeenCalledTimes(1);

    });

    test('dispatches addTrackToActive() when add track is clicked', () => {
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectPlaylists
            .mockReturnValue([{ id: 100 }]);
        selectFavoritePlaylists
            .mockReturnValue([{ id: 'XXX' }]);
        addTrackToActive
            .mockReturnValue({ type: 'actionType' });
        render(
            <Provider store={store}>
                <MantineProvider>
                    <ManagedPlaylistsNav />
                </MantineProvider>
            </Provider>
        );
        const button = screen.getByRole('button', { name: "Add track to active" });
        fireEvent.click(button);
        expect(addTrackToActive).toHaveBeenCalledTimes(1);

    });


});
