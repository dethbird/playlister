const request = require('supertest');
const app = require('../app');
const SpotifyStrategy = require('passport-spotify').Strategy;
const { User } = require('../models/models');
const spotifyApi = require('../modules/spotifyApi');

const { mockUser, mockSpotifyUser, mockWebApiErrorMessage, mockSessionUser, MockWebApiError } = require('../../testutils/mocks/contants');

// mock spotify strategy to set the session user
jest.mock('passport-spotify', () => {
    const Strategy = jest.fn();
    Strategy.prototype.name = 'spotify';
    Strategy.prototype.authenticate = jest.fn(function (req) {
        this.success(mockSessionUser);
    });
    return { Strategy };
});

jest.mock('../models/models');
jest.mock('../modules/spotifyApi');


let agent;

describe('GET /', () => {


    beforeEach(() => {
        jest.clearAllMocks();
        agent = request.agent(app);
    });

    it ('gets application user', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code')

        User.findByPk.mockResolvedValueOnce(mockUser);
        const resp = await agent.get('/me');
        
        const expectedResponse = {
            theme: mockUser.theme,
            tos_signed: mockUser.tos_signed,
            pp_signed: mockUser.pp_signed
        };
        
        expect(User.findByPk).toHaveBeenCalledTimes(1);
        expect(resp.body).toStrictEqual(expectedResponse);
    });

    it ('catches db error', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code')

        User.findByPk.mockRejectedValue(new Error('error'));
        const resp = await agent.get('/me');
        expect(User.findByPk).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(500);
        expect(resp.body).toEqual({message: 'error'})
    });

    it ('catches 404 when not logged in', async () => {
        const resp = await request(app).get('/me');
        expect(resp.statusCode).toBe(404);
    });
});

describe('GET /spotify', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it ('gets my spotify user', async () => {
        spotifyApi.getMe.mockResolvedValueOnce({ body: mockSpotifyUser });
        const resp = await request(app).get('/me/spotify');
        expect(spotifyApi.getMe).toHaveBeenCalledTimes(1);
        expect(resp.body).toStrictEqual(mockSpotifyUser);
    });

    it ('catches WebApiError', async () => {

        spotifyApi.getMe.mockRejectedValue( new MockWebApiError('', '', 403, mockWebApiErrorMessage));
        const resp = await request(app).get('/me/spotify');
        expect(spotifyApi.getMe).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(403);
        expect(resp.body).toStrictEqual({ message: mockWebApiErrorMessage});
    });
});

describe('PUT /toggle-theme', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it ('toggles user theme', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code')

        mockUser.save = jest.fn().mockResolvedValue(mockUser);
        User.findByPk.mockResolvedValueOnce(mockUser);
        const resp = await agent.put('/me/toggle-theme');
        
        const expectedResponse = {
            theme: mockUser.theme,
            tos_signed: mockUser.tos_signed,
            pp_signed: mockUser.pp_signed
        };
        
        expect(User.findByPk).toHaveBeenCalledTimes(1);
        expect(resp.body).toEqual(expectedResponse);
    });

    it ('catches 404 user not found error', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code')

        User.findByPk.mockResolvedValueOnce(null); // User not found
        const resp = await agent.put('/me/toggle-theme');
        expect(User.findByPk).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual({ message: 'User not found' });

    });

    it ('catches error on save', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code')

        mockUser.save = jest.fn().mockRejectedValue(new Error('db error'));
        User.findByPk.mockResolvedValueOnce(mockUser);
        const resp = await agent.put('/me/toggle-theme');
        expect(User.findByPk).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(500);

    });

});

describe('PUT /sign-tos', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        agent = request.agent(app);
    });

    it('signs Terms of Service successfully', async () => {
        await agent.get('/auth/spotify/callback?code=valid-code');

        const expectedUser = { theme: 'dark', tos_signed: 'Y', pp_signed: 'N' };
        const mockUserWithoutTos = { ...mockUser, tos_signed: 'N', save: jest.fn().mockResolvedValue(expectedUser) };
        
        User.findByPk.mockResolvedValueOnce(mockUserWithoutTos);
        
        const resp = await agent.put('/me/sign-tos');
        
        expect(User.findByPk).toHaveBeenCalledWith(mockSessionUser.user.id);
        expect(mockUserWithoutTos.tos_signed).toBe('Y');
        expect(mockUserWithoutTos.save).toHaveBeenCalledTimes(1);
        expect(resp.body).toEqual(expectedUser);
    });

    it('handles user not found error', async () => {
        await agent.get('/auth/spotify/callback?code=valid-code');

        User.findByPk.mockResolvedValueOnce(null); // User not found
        
        const resp = await agent.put('/me/sign-tos');
        
        expect(User.findByPk).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual({ message: 'User not found' });
    });

    it('catches database error during findByPk', async () => {
        await agent.get('/auth/spotify/callback?code=valid-code');

        User.findByPk.mockRejectedValue(new Error('database connection failed'));
        
        const resp = await agent.put('/me/sign-tos');
        
        expect(User.findByPk).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(500);
        expect(resp.body).toEqual({ message: 'database connection failed' });
    });

    it('catches error during save operation', async () => {
        await agent.get('/auth/spotify/callback?code=valid-code');

        const mockUserWithSaveError = { 
            ...mockUser, 
            tos_signed: 'N',
            save: jest.fn().mockRejectedValue(new Error('save operation failed'))
        };
        
        User.findByPk.mockResolvedValueOnce(mockUserWithSaveError);
        
        const resp = await agent.put('/me/sign-tos');
        
        expect(User.findByPk).toHaveBeenCalledTimes(1);
        expect(mockUserWithSaveError.tos_signed).toBe('Y'); // Should be updated before save fails
        expect(mockUserWithSaveError.save).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(500);
        expect(resp.body).toEqual({ message: 'save operation failed' });
    });

    it('handles already signed TOS', async () => {
        await agent.get('/auth/spotify/callback?code=valid-code');

        const expectedUser = { theme: 'dark', tos_signed: 'Y', pp_signed: 'N' };
        const mockUserAlreadySigned = { 
            ...mockUser, 
            tos_signed: 'Y',
            save: jest.fn().mockResolvedValue(expectedUser)
        };
        
        User.findByPk.mockResolvedValueOnce(mockUserAlreadySigned);
        
        const resp = await agent.put('/me/sign-tos');
        
        expect(User.findByPk).toHaveBeenCalledTimes(1);
        expect(mockUserAlreadySigned.tos_signed).toBe('Y'); // Should remain Y
        expect(mockUserAlreadySigned.save).toHaveBeenCalledTimes(1);
        expect(resp.body).toEqual(expectedUser);
    });

});

describe('PUT /sign-pp', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        agent = request.agent(app);
    });

    it('signs Privacy Policy successfully', async () => {
        await agent.get('/auth/spotify/callback?code=valid-code');

        const expectedUser = { theme: 'dark', tos_signed: 'N', pp_signed: 'Y' };
        const mockUserWithoutPp = { ...mockUser, pp_signed: 'N', save: jest.fn().mockResolvedValue(expectedUser) };
        
        User.findByPk.mockResolvedValueOnce(mockUserWithoutPp);
        
        const resp = await agent.put('/me/sign-pp');
        
        expect(User.findByPk).toHaveBeenCalledWith(mockSessionUser.user.id);
        expect(mockUserWithoutPp.pp_signed).toBe('Y');
        expect(mockUserWithoutPp.save).toHaveBeenCalledTimes(1);
        expect(resp.body).toEqual(expectedUser);
    });

    it('handles user not found error', async () => {
        await agent.get('/auth/spotify/callback?code=valid-code');

        User.findByPk.mockResolvedValueOnce(null); // User not found
        
        const resp = await agent.put('/me/sign-pp');
        
        expect(User.findByPk).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual({ message: 'User not found' });
    });

    it('catches database error during findByPk', async () => {
        await agent.get('/auth/spotify/callback?code=valid-code');

        User.findByPk.mockRejectedValue(new Error('database connection failed'));
        
        const resp = await agent.put('/me/sign-pp');
        
        expect(User.findByPk).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(500);
        expect(resp.body).toEqual({ message: 'database connection failed' });
    });

    it('catches error during save operation', async () => {
        await agent.get('/auth/spotify/callback?code=valid-code');

        const mockUserWithSaveError = { 
            ...mockUser, 
            pp_signed: 'N',
            save: jest.fn().mockRejectedValue(new Error('save operation failed'))
        };
        
        User.findByPk.mockResolvedValueOnce(mockUserWithSaveError);
        
        const resp = await agent.put('/me/sign-pp');
        
        expect(User.findByPk).toHaveBeenCalledTimes(1);
        expect(mockUserWithSaveError.pp_signed).toBe('Y'); // Should be updated before save fails
        expect(mockUserWithSaveError.save).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(500);
        expect(resp.body).toEqual({ message: 'save operation failed' });
    });

    it('handles already signed Privacy Policy', async () => {
        await agent.get('/auth/spotify/callback?code=valid-code');

        const expectedUser = { theme: 'dark', tos_signed: 'N', pp_signed: 'Y' };
        const mockUserAlreadySigned = { 
            ...mockUser, 
            pp_signed: 'Y',
            save: jest.fn().mockResolvedValue(expectedUser)
        };
        
        User.findByPk.mockResolvedValueOnce(mockUserAlreadySigned);
        
        const resp = await agent.put('/me/sign-pp');
        
        expect(User.findByPk).toHaveBeenCalledTimes(1);
        expect(mockUserAlreadySigned.pp_signed).toBe('Y'); // Should remain Y
        expect(mockUserAlreadySigned.save).toHaveBeenCalledTimes(1);
        expect(resp.body).toEqual(expectedUser);
    });

});
