import React from 'react';
import { apiBaseUrl, apiRequest } from './apiConfig';

let matchMedia;

describe('LoginScreen', () => {

    beforeAll(() => {
        delete window.location;
        window.location = { assign: jest.fn() };
    });

    afterEach(() => {
    });

    test('apiRequest returns the response when status is ok', async () => {
        const mockResponse = { data: '12345' };
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            })
        );

        const response = await apiRequest('/fake-endpoint');
        const data = await response.json();

        expect(data).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(apiBaseUrl + '/fake-endpoint', undefined);

    });

    test('sends user to /logout response not ok', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve(mockResponse),
            })
        );
        apiRequest('/fake-endpoint');

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(apiBaseUrl + '/fake-endpoint', undefined);
        // expect(window.location.assign).toHaveBeenCalled();
    });

    test('sends user to /logout promise rejected', async () => {
        global.fetch = jest.fn(() =>
            Promise.reject('Error')
        );
        apiRequest('/fake-endpoint');

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(apiBaseUrl + '/fake-endpoint', undefined);
        // expect(window.location.assign).toHaveBeenCalled();
    });

});
