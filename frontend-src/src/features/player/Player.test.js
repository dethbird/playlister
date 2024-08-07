import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import MatchMediaMock from 'jest-matchmedia-mock';
import { Provider } from 'react-redux';
import {
    MantineProvider,
} from '@mantine/core';
import { store } from '../../app/store';
import {
    getCurrentTrack,
    selectCurrentTrack,
    selectIsPlaying,
    selectStatus,
    selectIsLiked,
    liked,
    play,
    pause,
    next,
    previous
} from './playerSlice';
import { Player } from './Player';

let matchMedia;

jest.mock('./playerSlice', () => ({
    selectStatus: jest.fn(),
    selectCurrentTrack: jest.fn(),
    selectIsPlaying: jest.fn(),
    getCurrentTrack: jest.fn(),
    selectIsLiked: jest.fn(),
    liked: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
    next: jest.fn(),
    previous: jest.fn(),
}));

const mockTrack = {
    progress_ms: 500,
    item: {
        duration_ms: 3000,
        album: {
            images: [
                {},
                {
                    url: 'http://image'
                }
            ]
        },
        artists: [
            {
                name: 'Artist'
            }
        ]
    }
}


describe('Player', () => {
    beforeAll(() => {
        matchMedia = new MatchMediaMock();
        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout');
    });

    afterEach(() => {
        matchMedia.clear();
        jest.clearAllTimers();
        jest.restoreAllMocks();
    });

    test('renders nothing playing alert when nothing is playing', () => {
        getCurrentTrack
            .mockReturnValue({ type: 'player/getCurrentTrack' });
        selectCurrentTrack
            .mockReturnValue(false);
        selectIsPlaying
            .mockReturnValue(false);
        selectStatus
            .mockReturnValue('fulfulled');
        const { getByText } = render(
            <Provider store={store}>
                <MantineProvider>
                    <Player />
                </MantineProvider>
            </Provider>
        );
        expect(getByText(/nothing is playing/i)).toBeInTheDocument();
    });

    test('renders nothing if status is rejected', () => {
        getCurrentTrack
            .mockReturnValue({ type: 'player/getCurrentTrack' });
        selectCurrentTrack
            .mockReturnValue(false);
        selectIsPlaying
            .mockReturnValue(false);
        selectStatus
            .mockReturnValue('rejected');
        const { queryByText } = render(
            <Provider store={store}>
                <MantineProvider>
                    <Player />
                </MantineProvider>
            </Provider>
        );
        expect(queryByText(/nothing is playing/i)).toBeNull();
    });

    test('renders loading for idle state', () => {
        getCurrentTrack
            .mockReturnValue({ type: 'player/getCurrentTrack' });
        selectCurrentTrack
            .mockReturnValue(false);
        selectIsPlaying
            .mockReturnValue(false);
        selectStatus
            .mockReturnValue('idle');
        const { queryByText } = render(
            <Provider store={store}>
                <MantineProvider>
                    <Player />
                </MantineProvider>
            </Provider>
        );
        const loader = screen.getByRole('alert', { busy: true });
        expect(loader).toBeInTheDocument();
    });

    test('renders loading for pending state', () => {
        getCurrentTrack
            .mockReturnValue({ type: 'player/getCurrentTrack' });
        selectCurrentTrack
            .mockReturnValue(false);
        selectIsPlaying
            .mockReturnValue(false);
        selectStatus
            .mockReturnValue('pending');
        const { queryByText } = render(
            <Provider store={store}>
                <MantineProvider>
                    <Player />
                </MantineProvider>
            </Provider>
        );
        const loader = screen.getByRole('alert', { busy: true });
        expect(loader).toBeInTheDocument();
    });

    test('sets a timer for getCurrentTrack when track is playing', () => {
        liked
            .mockReturnValue({ type: 'player/liked' });
        getCurrentTrack
            .mockReturnValue({ type: 'player/getCurrentTrack' });
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectIsPlaying
            .mockReturnValue(true);
        selectStatus
            .mockReturnValue('fulfilled');
        selectIsLiked
            .mockReturnValue(true);
        jest.spyOn(global, 'setTimeout');
        jest.runAllTimers();
        render(
            <Provider store={store}>
                <MantineProvider>
                    <Player />
                </MantineProvider>
            </Provider>
        );
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 2600);
    });

    test('renders player controls and dispatches correct actions (play is disabled)', () => {
        play
            .mockReturnValue({ type: 'player/play' });
        pause
            .mockReturnValue({ type: 'player/pause' });
        next
            .mockReturnValue({ type: 'player/next' });
        previous
            .mockReturnValue({ type: 'player/previous' });
        next
            .mockReturnValue({ type: 'player/next' });
        liked
            .mockReturnValue({ type: 'player/liked' });
        getCurrentTrack
            .mockReturnValue({ type: 'player/getCurrentTrack' });
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectIsPlaying
            .mockReturnValue(true);
        selectStatus
            .mockReturnValue('fulfilled');
        selectIsLiked
            .mockReturnValue(true);
        render(
            <Provider store={store}>
                <MantineProvider>
                    <Player />
                </MantineProvider>
            </Provider>
        );

        // Make sure the controls are there
        const likeButton = screen.getByRole('button', { name: 'Like / Unlike' });
        expect(likeButton).toBeInTheDocument();
        const playButton = screen.getByRole('button', { name: 'Play' });
        expect(playButton).toBeInTheDocument();
        const pauseButton = screen.getByRole('button', { name: 'Pause' });
        expect(pauseButton).toBeInTheDocument();
        const prevButton = screen.getByRole('button', { name: 'Previous Track' });
        expect(prevButton).toBeInTheDocument();
        const nextButton = screen.getByRole('button', { name: 'Next Track' });
        expect(nextButton).toBeInTheDocument();

        // Make sure clicking the buttons dispatches the correct actions
        playButton.click();
        expect(play).toHaveBeenCalledTimes(0);

        pauseButton.click();
        expect(pause).toHaveBeenCalledTimes(1);

        nextButton.click();
        expect(next).toHaveBeenCalledTimes(1);

        prevButton.click();
        expect(previous).toHaveBeenCalledTimes(1);

    });

    test('play button dispatches play event when player is paused', () => {
        play
            .mockReturnValue({ type: 'player/play' });
        liked
            .mockReturnValue({ type: 'player/liked' });
        getCurrentTrack
            .mockReturnValue({ type: 'player/getCurrentTrack' });
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectIsPlaying
            .mockReturnValue(false);
        selectStatus
            .mockReturnValue('fulfilled');
        selectIsLiked
            .mockReturnValue(true);
        render(
            <Provider store={store}>
                <MantineProvider>
                    <Player />
                </MantineProvider>
            </Provider>
        );

        const playButton = screen.getByRole('button', { name: 'Play' });
        playButton.click();
        expect(play).toHaveBeenCalledTimes(1);
    });

    test('window.focus triggers getCurrentTrack', () => {
        liked
            .mockReturnValue({ type: 'player/liked' });
        getCurrentTrack
            .mockReturnValue({ type: 'player/getCurrentTrack' });
        selectCurrentTrack
            .mockReturnValue(mockTrack);
        selectIsPlaying
            .mockReturnValue(false);
        selectStatus
            .mockReturnValue('fulfilled');
        selectIsLiked
            .mockReturnValue(true);
        render(
            <Provider store={store}>
                <MantineProvider>
                    <Player />
                </MantineProvider>
            </Provider>
        );
        fireEvent.focus(window);
        expect(getCurrentTrack).toHaveBeenCalledTimes(2);
    });

});

