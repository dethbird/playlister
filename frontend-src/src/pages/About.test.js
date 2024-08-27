import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import MatchMediaMock from 'jest-matchmedia-mock';
import {
    MantineProvider,
} from '@mantine/core';
import { store } from '../app/store';
import About from './About';

let matchMedia;

describe('About Page', () => {

    beforeAll(() => {
        matchMedia = new MatchMediaMock();
    });

    afterEach(() => {
        matchMedia.clear();
    });

    test('renders about page', () => {

        const { getByText } = render(
            <Provider store={store}>
                <MantineProvider>
                    <About />
                </MantineProvider>
            </Provider>

        );

        expect(getByText(/From the Developer/i)).toBeInTheDocument();
    });

});
