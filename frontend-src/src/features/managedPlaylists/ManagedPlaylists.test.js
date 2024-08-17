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
    getManagedPlaylists,
    reorderPlaylists,
    selectPlaylists,
    selectPlaylistsMeta,
    selectStatus
} from './managedPlaylistsSlice';
import { ManagedPlaylists } from './ManagedPlaylists';

let matchMedia;

jest.mock('./managedPlaylistsSlice', () => ({
    getPlaylistMeta: jest.fn(),
    getManagedPlaylists: jest.fn(),
    reorderPlaylists: jest.fn(),
    selectPlaylists: jest.fn(),
    selectPlaylistsMeta: jest.fn(),
    selectStatus: jest.fn(),
}));


let mockTrack;
let mockPlaylist;
let mockPlaylistMetadata;

describe('ManagedPlaylists', () => {
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
        jest.clearAllMocks();
    });


    test('renders an error when satus is rejected', () => {
        getManagedPlaylists
            .mockReturnValue({ type: 'playlists/get' });
        selectPlaylists
            .mockReturnValue([{ id: 100 }]);
        selectStatus
            .mockReturnValue('rejected');
        render(
            <Provider store={store}>
                <MantineProvider>
                    <ManagedPlaylists />
                </MantineProvider>
            </Provider>
        );
        const loader = screen.getByRole('alert', { name: 'error' });
        expect(loader).toBeInTheDocument();

    });



    test('renders playlist items when they exist', async () => {
        getPlaylistMeta
            .mockReturnValue({ type: 'playlists/getMeta' });
        getManagedPlaylists
            .mockReturnValue({ type: 'playlists/get' });
        selectPlaylists
            .mockReturnValue([{ id: 100 }, { id: 200 }]);
        selectPlaylistsMeta
            .mockReturnValue([{ id: 100 }]);
        selectStatus
            .mockReturnValue('fulfilled');
        render(
            <Provider store={store}>
                <MantineProvider>
                    <ManagedPlaylists />
                </MantineProvider>
            </Provider>
        );
        const items = await screen.queryAllByRole('li');
        expect(items.length).toBe(2);

    });

    test('dispatches reorderPlaylists() when onHandleDrag it triggered', async () => {

        getPlaylistMeta
            .mockReturnValue({ type: 'playlists/getMeta' });
        getManagedPlaylists
            .mockReturnValue({ type: 'playlists/get' });
        selectPlaylists
            .mockReturnValue([{ id: 100 }, { id: 200 }]);
        selectPlaylistsMeta
            .mockReturnValue([{ id: 100 }]);
        selectStatus
            .mockReturnValue('fulfilled');
        reorderPlaylists
            .mockReturnValue();
        render(
            <Provider store={store}>
                <MantineProvider>
                    <ManagedPlaylists />
                </MantineProvider>
            </Provider>
        );
        const items = await screen.queryAllByRole('li');
        fireEvent.dragEnd(items[0]);

        /** @todo figure out how to trigger a reorder */
        // expect(reorderPlaylists).toHaveBeenCalledTimes(1);
    });

});
