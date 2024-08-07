import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import MatchMediaMock from 'jest-matchmedia-mock';
import {
    MantineProvider,
} from '@mantine/core';
import { store } from '../app/store';
import Nav from './Nav';

let matchMedia;

describe('Nav', () => {

    beforeAll(() => {
        matchMedia = new MatchMediaMock();
    });

    afterEach(() => {
        matchMedia.clear();
    });

    test('renders logged in when display name is present', () => {
        const user = {
            display_name: "Pizza",
            images: [
                { url: 'http://image' }
            ]
        }
        const { getByText } = render(
            <Provider store={store}>
                <MantineProvider>
                    <Nav spotifyUser={user} />
                </MantineProvider>
            </Provider>
        );

        expect(getByText(/Pizza/i)).toBeInTheDocument();
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


