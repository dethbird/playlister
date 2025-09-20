import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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
            <MemoryRouter>
                <Provider store={store}>
                    <MantineProvider>
                        <Nav spotifyUser={spotifyUser} />
                    </MantineProvider>
                </Provider>
            </MemoryRouter>
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
            <MemoryRouter>
                <Provider store={store}>
                    <MantineProvider>
                        <Nav spotifyUser={spotifyUser} />
                    </MantineProvider>
                </Provider>
            </MemoryRouter>
        );

        const button = screen.getByRole('button', { name: "Switch theme" });
        fireEvent.click(button);
        expect(toggleTheme).toHaveBeenCalledTimes(1);
    });

    test('does not render user details when no spotify user', async () => {
        const { queryByText } = render(
            <MemoryRouter>
                <Provider store={store}>
                    <MantineProvider>
                        <Nav spotifyUser={{}} />
                    </MantineProvider>
                </Provider>
            </MemoryRouter>
        );

        const userDetails = await queryByText(/Pizza/i);
        expect(userDetails).toBeNull();
    });

    test('renders user with default avatar when user has no images', () => {
        const spotifyUserWithoutImages = {
            display_name: "UserWithoutImages",
            images: []
        };
        selectUser
            .mockReturnValue({ theme: 'light'});
        
        const { getByText, container } = render(
            <MemoryRouter>
                <Provider store={store}>
                    <MantineProvider>
                        <Nav spotifyUser={spotifyUserWithoutImages} />
                    </MantineProvider>
                </Provider>
            </MemoryRouter>
        );

        // Check that the user's display name is rendered
        expect(getByText(/UserWithoutImages/i)).toBeInTheDocument();
        
        // Check that the Avatar component is present but has no src attribute (or null)
        const avatar = container.querySelector('.Avatar');
        expect(avatar).toBeInTheDocument();
        
        // The Avatar should not have an image source when images array is empty
        const img = avatar.querySelector('img');
        if (img) {
            expect(img.src).toBe('');
        }
    });

    test('renders user with default avatar when images property is undefined', () => {
        const spotifyUserNoImagesProperty = {
            display_name: "UserNoImagesProperty"
            // images property is completely missing
        };
        selectUser
            .mockReturnValue({ theme: 'light'});
        
        const { getByText, container } = render(
            <MemoryRouter>
                <Provider store={store}>
                    <MantineProvider>
                        <Nav spotifyUser={spotifyUserNoImagesProperty} />
                    </MantineProvider>
                </Provider>
            </MemoryRouter>
        );

        // Check that the user's display name is rendered
        expect(getByText(/UserNoImagesProperty/i)).toBeInTheDocument();
        
        // Check that the Avatar component is present but has no src attribute (or null)
        const avatar = container.querySelector('.Avatar');
        expect(avatar).toBeInTheDocument();
        
        // The Avatar should not have an image source when images property is missing
        const img = avatar.querySelector('img');
        if (img) {
            expect(img.src).toBe('');
        }
    });
});
