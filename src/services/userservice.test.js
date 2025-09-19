const spotifyApi = require('../modules/spotifyApi');
const { User } = require("../models/models");
const userService = require('./userService');

const { mockUser, mockSpotifyUser } = require('../../testutils/mocks/contants');

jest.mock('../models/models');
jest.mock('../modules/spotifyApi');

describe('authenticateSpotifyUser', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('successfully authenticates and calls done with user data', async () => {
        const mockDone = jest.fn();
        const mockAccessToken = 'test-access-token';
        const mockRefreshToken = 'test-refresh-token';
        const mockExpiresIn = 3600;
        const mockProfile = { id: 'spotify-user-123' };
        
        User.findOrCreate.mockResolvedValueOnce([mockUser, false]);
        spotifyApi.getMe.mockResolvedValueOnce({ body: mockSpotifyUser });
        
        await userService.authenticateSpotifyUser(mockAccessToken, mockRefreshToken, mockExpiresIn, mockProfile, mockDone);

        expect(User.findOrCreate).toHaveBeenCalledTimes(1);
        expect(User.findOrCreate).toHaveBeenCalledWith({
            where: { spotify_user_id: mockProfile.id }
        });
        expect(spotifyApi.setAccessToken).toHaveBeenCalledTimes(1);
        expect(spotifyApi.setAccessToken).toHaveBeenCalledWith(mockAccessToken);
        expect(spotifyApi.getMe).toHaveBeenCalledTimes(1);
        expect(mockDone).toHaveBeenCalledTimes(1);
        expect(mockDone).toHaveBeenCalledWith(null, { 
            user: mockUser, 
            accessToken: mockAccessToken, 
            spotifyUser: mockSpotifyUser 
        });
    });

    it('handles User.findOrCreate error and calls done with error', async () => {
        const mockDone = jest.fn();
        const mockError = new Error('Find or create failed');
        const mockProfile = { id: 'spotify-user-123' };
        
        User.findOrCreate.mockRejectedValueOnce(mockError);
        
        await userService.authenticateSpotifyUser('XXX', 'YYY', 555, mockProfile, mockDone);

        expect(User.findOrCreate).toHaveBeenCalledTimes(1);
        expect(spotifyApi.setAccessToken).toHaveBeenCalledTimes(0);
        expect(spotifyApi.getMe).toHaveBeenCalledTimes(0);
        expect(mockDone).toHaveBeenCalledTimes(1);
        expect(mockDone).toHaveBeenCalledWith(mockError);
    });

    it('handles spotifyApi.getMe error and calls done with error', async () => {
        const mockDone = jest.fn();
        const mockError = new Error('Fetch /me failed');
        const mockProfile = { id: 'spotify-user-123' };
        
        User.findOrCreate.mockResolvedValueOnce([mockUser, false]);
        spotifyApi.getMe.mockRejectedValueOnce(mockError);
        
        await userService.authenticateSpotifyUser('XXX', 'YYY', 555, mockProfile, mockDone);

        expect(User.findOrCreate).toHaveBeenCalledTimes(1);
        expect(spotifyApi.setAccessToken).toHaveBeenCalledTimes(1);
        expect(spotifyApi.getMe).toHaveBeenCalledTimes(1);
        expect(mockDone).toHaveBeenCalledTimes(1);
        expect(mockDone).toHaveBeenCalledWith(mockError);
    });

    it('successfully authenticates when user is created for first time', async () => {
        const mockDone = jest.fn();
        const mockAccessToken = 'new-user-token';
        const mockProfile = { id: 'new-spotify-user-456' };
        
        // Mock findOrCreate returning user and true (user was created)
        User.findOrCreate.mockResolvedValueOnce([mockUser, true]);
        spotifyApi.getMe.mockResolvedValueOnce({ body: mockSpotifyUser });
        
        await userService.authenticateSpotifyUser(mockAccessToken, 'refresh', 7200, mockProfile, mockDone);

        expect(User.findOrCreate).toHaveBeenCalledWith({
            where: { spotify_user_id: mockProfile.id }
        });
        expect(spotifyApi.setAccessToken).toHaveBeenCalledWith(mockAccessToken);
        expect(mockDone).toHaveBeenCalledWith(null, { 
            user: mockUser, 
            accessToken: mockAccessToken, 
            spotifyUser: mockSpotifyUser 
        });
    });
})
