import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import MatchMediaMock from 'jest-matchmedia-mock';
import {
    MantineProvider,
} from '@mantine/core';
import { store } from '../app/store';
import Pp from './Pp';
import { signPP } from '../features/user/userSlice';

jest.mock('../features/user/userSlice', () => ({
    signPP: jest.fn()
}));


let matchMedia;

describe('Privacy Policy Page', () => {

    beforeAll(() => {
        matchMedia = new MatchMediaMock();
    });

    afterEach(() => {
        matchMedia.clear();
    });

    test('renders copy', () => {

        const { getByText } = render(
            <Provider store={store}>
                <MantineProvider>
                    <Pp />
                </MantineProvider>
            </Provider>

        );

        expect(getByText(/Your privacy is important to us/i)).toBeInTheDocument();
    });

    test('dispatches signPP on clicking button', () => {
        signPP
            .mockReturnValue({ type: 'user/signPP' });
        render(
            <Provider store={store}>
                <MantineProvider>
                    <Pp signed='N' />
                </MantineProvider>
            </Provider>
        );
        const button = screen.getByTestId('signpp-button')
        button.click();
        expect(signPP).toHaveBeenCalledTimes(1);
    });

});
