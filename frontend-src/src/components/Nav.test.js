import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import MatchMediaMock from 'jest-matchmedia-mock';
import {
    MantineProvider,
} from '@mantine/core';
import { store } from '../app/store';
import { toggleTheme, selectUser } from '../features/user/userSlice';
import Nav from './Nav';

let matchMedia;

jest.mock('../features/user/userSlice', () => ({
    toggleTheme: jest.fn(),
    selectUser: jest.fn()
}));

describe('Nav', () => {

    beforeAll(() => {
        matchMedia = new MatchMediaMock();
    });

    afterEach(() => {
        matchMedia.clear();
    });

    test('renders logged in when display name is present', () => {
        const spotifyUser = {
            display_name: "Pizza",
            images: [
                { url: 'http://image' }
            ]
        }
        selectUser
            .mockReturnValue({ theme: 'light'});
        const { getByText } = render(
            <Provider store={store}>
                <MantineProvider>
                    <Nav spotifyUser={spotifyUser} />
                </MantineProvider>
            </Provider>
        );

        expect(getByText(/Pizza/i)).toBeInTheDocument();
    });

    test('dispatches toggleTheme() when toggle theme is clicked', () => {
        const spotifyUser = {
            display_name: "Pizza",
            images: [
                { url: 'http://image' }
            ]
        }
        selectUser
            .mockReturnValue({ theme: 'light'});
        toggleTheme
            .mockReturnValue({ type: 'someAction' });
        render(
            <Provider store={store}>
                <MantineProvider>
                    <Nav spotifyUser={spotifyUser} />
                </MantineProvider>
            </Provider>
        );

        const button = screen.getByRole('button', { name: "Switch theme" });
        button.click();
        expect(toggleTheme).toHaveBeenCalledTimes(1);
    });

    test('does not render user details when no spotify user', async () => {
        const { queryByText } = render(
            <Provider store={store}>
                <MantineProvider>
                    <Nav spotifyUser={{}} />
                </MantineProvider>
            </Provider>
        );

        const userDetails = await queryByText(/Pizza/i);
        expect(userDetails).toBeNull();
    });
});
