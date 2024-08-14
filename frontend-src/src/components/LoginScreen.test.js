import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import MatchMediaMock from 'jest-matchmedia-mock';
import {
    MantineProvider,
} from '@mantine/core';
import { store } from '../app/store';
import LoginScreen from './LoginScreen';

let matchMedia;

describe('LoginScreen', () => {

    beforeAll(() => {
        matchMedia = new MatchMediaMock();
        delete window.location;
        window.location = { assign: jest.fn() };
    });

    afterEach(() => {
        matchMedia.clear();
    });

    test('renders a login button', () => {

        const { getByText } = render(
            <Provider store={store}>
                <MantineProvider>
                    <LoginScreen />
                </MantineProvider>
            </Provider>

        );

        expect(getByText(/login with spotify/i)).toBeInTheDocument();
    });

    test('clicking login button should set document location to /auth/spotify', () => {

        render(
            <Provider store={store}>
                <MantineProvider>
                    <LoginScreen />
                </MantineProvider>
            </Provider>
        );

        const button = screen.getByRole('button', { name: 'Login with Spotify' });
        button.click();
        expect(window.location.assign).toHaveBeenCalledWith('/auth/spotify');
    });

});
