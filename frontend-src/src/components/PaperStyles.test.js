import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import MatchMediaMock from 'jest-matchmedia-mock';
import {
    MantineProvider,
} from '@mantine/core';
import {
    selectUser
} from '../features/user/userSlice';
import { store } from '../app/store';
import { PaperStyled } from './PaperStyled';

let matchMedia;

jest.mock('../features/user/userSlice', () => ({
    selectUser: jest.fn()
}));

describe('PaperStyled', () => {

    beforeAll(() => {
        matchMedia = new MatchMediaMock();
    });

    afterEach(() => {
        matchMedia.clear();
    });

    test('renders light bg when user theme is light', () => {


        selectUser
            .mockReturnValue({theme: 'light'});

        render(
            <Provider store={store}>
                <MantineProvider>
                    <PaperStyled>
                        <div>hi</div>
                    </PaperStyled>
                 </MantineProvider>
             </Provider>

        );

        const el = screen.getByTestId('paper-styled');
        const styles = window.getComputedStyle(el);
        expect(styles.backgroundColor).toBe("rgb(255, 255, 255)");
    });

    test('renders dark bg when user theme is dark', () => {


        selectUser
            .mockReturnValue({theme: 'dark'});

        render(
            <Provider store={store}>
                <MantineProvider>
                    <PaperStyled>
                        <div>hi</div>
                    </PaperStyled>
                 </MantineProvider>
             </Provider>

        );

        const el = screen.getByTestId('paper-styled');
        const styles = window.getComputedStyle(el);
        expect(styles.backgroundColor).toBe("rgb(31, 31, 31)");
    });

});
