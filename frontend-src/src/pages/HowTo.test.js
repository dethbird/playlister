import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import MatchMediaMock from 'jest-matchmedia-mock';
import {
    MantineProvider,
} from '@mantine/core';
import { store } from '../app/store';
import HowTo from './HowTo';

let matchMedia;

describe('HowTo Page', () => {

    beforeAll(() => {
        matchMedia = new MatchMediaMock();
    });

    afterEach(() => {
        matchMedia.clear();
    });

    test('renders HowTo page', () => {

        const { getByText } = render(
            <Provider store={store}>
                <MantineProvider>
                    <HowTo />
                </MantineProvider>
            </Provider>

        );

        expect(getByText(/Your playlists will hopefully thank you/i)).toBeInTheDocument();
    });

});
