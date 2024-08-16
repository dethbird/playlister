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
        expect(User.findByPk).toHaveBeenCalledTimes(1);
        expect(resp.body).toStrictEqual(mockUser);
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
        expect(User.findByPk).toHaveBeenCalledTimes(1);
        expect(resp.body.theme).toBe(mockUser.theme);
    });

    it ('catches 404 user not found error', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code')

        User.findByPk.mockRejectedValue(new Error('not found'));
        const resp = await agent.put('/me/toggle-theme');
        expect(User.findByPk).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(404);

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
