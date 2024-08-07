import React from 'react';
import { render, screen } from '@testing-library/react';
import MatchMediaMock from 'jest-matchmedia-mock';
import { Provider } from 'react-redux';
import {
    MantineProvider,
} from '@mantine/core';
import { store } from '../../app/store';
import {
    liked,
    like,
    unlike,
    selectIsLiked
} from './playerSlice';
import { LikeButton, Player } from './LikeButton';

let matchMedia;

jest.mock('./playerSlice', () => ({
    liked: jest.fn(),
    like: jest.fn(),
    unlike: jest.fn(),
    selectIsLiked: jest.fn()
}));

describe('LikeButton', () => {
    beforeAll(() => {
        matchMedia = new MatchMediaMock();
    });

    afterEach(() => {
        matchMedia.clear();
    });

    test('renders a like button and dispatches unlike when liked', () => {
        liked
            .mockReturnValue({ type: 'player/liked' });
        like
            .mockReturnValue({ type: 'player/like' });
        unlike
            .mockReturnValue({ type: 'player/unlike' });
        selectIsLiked
            .mockReturnValue(false);
        render(
            <Provider store={store}>
                <MantineProvider>
                    <LikeButton />
                </MantineProvider>
            </Provider>
        );

        const button = screen.getByRole('button', { name: 'Like / Unlike' });
        button.click();
        expect(like).toHaveBeenCalledTimes(1);
    });

    test('renders a like button and dispatches like when not liked', () => {
        liked
            .mockReturnValue({ type: 'player/liked' });
        like
            .mockReturnValue({ type: 'player/like' });
        unlike
            .mockReturnValue({ type: 'player/unlike' });
        selectIsLiked
            .mockReturnValue(true);
        render(
            <Provider store={store}>
                <MantineProvider>
                    <LikeButton />
                </MantineProvider>
            </Provider>
        );

        const button = screen.getByRole('button', { name: 'Like / Unlike' });
        button.click();
        expect(unlike).toHaveBeenCalledTimes(1);
    });

});

