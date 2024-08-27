import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import MatchMediaMock from 'jest-matchmedia-mock';
import {
    MantineProvider,
} from '@mantine/core';
import { store } from '../app/store';
import Tos from './Tos';
import { signTos } from '../features/user/userSlice';

jest.mock('../features/user/userSlice', () => ({
    signTos: jest.fn()
}));


let matchMedia;

describe('Terms of Service Page', () => {

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
                    <Tos />
                </MantineProvider>
            </Provider>

        );

        expect(getByText(/Your privacy is important to us/i)).toBeInTheDocument();
    });

    test('dispatches signPP on clicking button', () => {
        signTos
            .mockReturnValue({ type: 'user/signTos' });
        render(
            <Provider store={store}>
                <MantineProvider>
                    <Tos signed='N' />
                </MantineProvider>
            </Provider>
        );
        const button = screen.getByTestId('signtos-button')
        button.click();
        expect(signTos).toHaveBeenCalledTimes(1);
    });

});
