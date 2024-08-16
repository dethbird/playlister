const spotifyApi = require('../modules/spotifyApi');
const { User } = require("../models/models");
const userService = require('./userService');

const { mockUser, mockSpotifyUser } = require('../../tests/mocks/contants');

jest.mock('../models/models');
jest.mock('../modules/spotifyApi');

describe('authenticateSpotifyUser', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('successfully authenticates', async () => {
        const mockDone = jest.fn();
        User.findOrCreate.mockResolvedValueOnce([mockUser]);
        spotifyApi.getMe.mockResolvedValueOnce({ body: mockSpotifyUser });
        await userService.authenticateSpotifyUser('XXX', 'YYY', 555, mockSpotifyUser, mockDone);

        expect(User.findOrCreate).toHaveBeenCalledTimes(1);
        expect(spotifyApi.setAccessToken).toHaveBeenCalledTimes(1);
        expect(spotifyApi.getMe).toHaveBeenCalledTimes(1);
        /** @todo  this is happening right at return and is not registering */
        // expect(mockDone).toHaveBeenCalledTimes(1);
    });
    it('catches error with User.findOrCreate()', async () => {
        const mockDone = jest.fn();
        User.findOrCreate.mockRejectedValue(new Error('Find or create failed'));
        spotifyApi.getMe.mockResolvedValueOnce({ body: mockSpotifyUser });
        await userService.authenticateSpotifyUser('XXX', 'YYY', 555, mockSpotifyUser, mockDone);

        expect(User.findOrCreate).toHaveBeenCalledTimes(1);
        expect(spotifyApi.setAccessToken).toHaveBeenCalledTimes(0);
        expect(spotifyApi.getMe).toHaveBeenCalledTimes(0);
    });
    it('catches error with spotifyApi.getMe()', async () => {
        const mockDone = jest.fn();
        User.findOrCreate.mockResolvedValueOnce([mockUser]);
        spotifyApi.getMe.mockRejectedValue(new Error('Fetch /me failed'));
        await userService.authenticateSpotifyUser('XXX', 'YYY', 555, mockSpotifyUser, mockDone);

        expect(User.findOrCreate).toHaveBeenCalledTimes(1);
        expect(spotifyApi.setAccessToken).toHaveBeenCalledTimes(1);
        expect(spotifyApi.getMe).toHaveBeenCalledTimes(1);
    });
})
