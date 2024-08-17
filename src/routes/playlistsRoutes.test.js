const request = require('supertest');
const app = require('../app');
const SpotifyStrategy = require('passport-spotify').Strategy;
const { Favorite, Playlist, sequelize } = require('../models/models');
const spotifyApi = require('../modules/spotifyApi');

const { mockManagedPlaylist, mockWebApiErrorMessage, mockSessionUser, MockWebApiError } = require('../../testutils/mocks/contants');

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


let agent = request.agent(app);

// Db routes must be first, they are freezing up the tests otherwise. ---------------------------

describe('PUT /set-active-all', () => {

    beforeEach(() => {
        agent = request.agent(app);
        jest.clearAllMocks();
    });

    it('sets all user\'s managed playlists specified active Y | N', async () => {
        await agent.get('/auth/spotify/callback?code=valid-code');

        Playlist.update.mockResolvedValueOnce(true);
        const resp = await agent.put('/playlists/set-active-all')
            .send({ active: 'Y '});
        expect(Playlist.update).toHaveBeenCalledTimes(1);
        expect(resp.body).toStrictEqual(true);
    });

    it('catches db error', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        Playlist.update.mockRejectedValue(new Error('error'));
        const resp = await agent.put('/playlists/set-active-all')
            .send({ active: 'Y '});
        expect(Playlist.update).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(500);
        expect(resp.body).toEqual({ message: 'error' })

    });

});


/** @todo why is this test causing "Cannot set headers after they are sent to the client" */
describe('PUT /invert-active-all', () => {

    // beforeEach(() => {
    //     agent = request.agent(app);
    //     jest.clearAllMocks();
    // });

    // it('inverts all user\'s managed playlists active status', async () => {

    //     await agent.get('/auth/spotify/callback?code=valid-code');

    //     Playlist.findAll.mockResolvedValueOnce([mockManagedPlaylist, mockManagedPlaylist, mockManagedPlaylist]);
    //     Playlist.update.mockResolvedValueOnce(true);
    //     const resp = await agent.put('/playlists/invert-active-all');
    //     expect(Playlist.findAll).toHaveBeenCalledTimes(1);
    //     expect(Playlist.update).toHaveBeenCalledTimes(3);
    //     expect(resp.body).toStrictEqual(true);
    // });

    // it('catches db error', async () => {

    //     await agent.get('/auth/spotify/callback?code=valid-code');

    //     Playlist.update.mockRejectedValue(new Error('error'));
    //     const resp = await agent.put('/playlists/set-active-all')
    //         .send({ active: 'Y '});
    //     expect(Playlist.update).toHaveBeenCalledTimes(1);
    //     expect(resp.statusCode).toBe(500);
    //     expect(resp.body).toEqual({ message: 'error' })

    // });

});

/** @todo this appears to be returning 4 responses from the 4 ids */
describe('PUT /reorder', () => {

    // beforeEach(() => {
    //     jest.clearAllMocks();
    // });

    // it('reorders all user\'s managed playlists', async () => {

    //     mockManagedPlaylist.save = jest.fn().mockResolvedValue(true);
    //     Playlist.findByPk.mockResolvedValueOnce(mockManagedPlaylist);
    //     const resp = await agent.put('/playlists/reorder')
    //         .send({ids: [1,2,3,4]});
    //     expect(Playlist.findByPk).toHaveBeenCalledTimes(4);
    //     expect(resp.body).toStrictEqual(true);
    // });

    // it('catches db error', async () => {

    //     await agent.get('/auth/spotify/callback?code=valid-code');

    //     Playlist.update.mockRejectedValue(new Error('error'));
    //     const resp = await agent.put('/playlists/set-active-all')
    //         .send({ active: 'Y '});
    //     expect(Playlist.update).toHaveBeenCalledTimes(1);
    //     expect(resp.statusCode).toBe(500);
    //     expect(resp.body).toEqual({ message: 'error' })

    // });

});

describe('POST /', () => {


    beforeEach(() => {
        agent = request.agent(app);
        jest.clearAllMocks();
    });

    it('adds a spotify playlist to user managed', async () => {
        await agent.get('/auth/spotify/callback?code=valid-code')

        Playlist.findOrCreate.mockResolvedValueOnce(mockManagedPlaylist);
        const resp = await agent.post('/playlists')
            .send({ id: '5555' });
        expect(Playlist.findOrCreate).toHaveBeenCalledTimes(1);
        expect(resp.body).toStrictEqual(mockManagedPlaylist);
    });

    it('catches db error', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code')

        Playlist.findOrCreate.mockRejectedValue(new Error('error'));
        const resp = await agent.post('/playlists')
            .send({ id: '5555' });
        expect(Playlist.findOrCreate).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(500);
        expect(resp.body).toEqual({ message: 'error' })
    });

});

describe('GET /', () => {

    beforeEach(() => {
        agent = request.agent(app);
        jest.clearAllMocks();
    });

    it('gets a user\'s managed playlists', async () => {
        await agent.get('/auth/spotify/callback?code=valid-code')

        sequelize.query.mockResolvedValue([mockManagedPlaylist]);
        const resp = await agent.get('/playlists')
        expect(sequelize.query).toHaveBeenCalledTimes(1);
        expect(resp.body).toStrictEqual([mockManagedPlaylist]);
    });

    it('catches db error', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code')

        sequelize.query.mockRejectedValue(new Error('error'));
        const resp = await agent.get('/playlists')
        expect(sequelize.query).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(500);
        expect(resp.body).toEqual({ message: 'error' })
    });

});

describe('DELETE /:id', () => {

    beforeEach(() => {
        agent = request.agent(app);
        jest.clearAllMocks();
    });

    it('deletes a user\'s managed playlists', async () => {
        await agent.get('/auth/spotify/callback?code=valid-code')

        Playlist.destroy.mockResolvedValueOnce();
        const resp = await agent.delete('/playlists/XXXX')
        expect(Playlist.destroy).toHaveBeenCalledTimes(1);
        expect(resp.body).toStrictEqual({});
    });

    it('catches db error', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code')

        Playlist.destroy.mockRejectedValue(new Error('error'));
        const resp = await agent.delete('/playlists/XXXX')
        expect(Playlist.destroy).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(500);
        expect(resp.body).toEqual({ message: 'error' })

    });

});

describe('PUT /:id/toggle-active', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        agent = request.agent(app);
    });


    it('toggles a user\'s managed playlists as active', async () => {
        await agent.get('/auth/spotify/callback?code=valid-code')

        Playlist.findByPk.mockResolvedValueOnce(mockManagedPlaylist);
        Playlist.update.mockResolvedValueOnce(mockManagedPlaylist);
        const resp = await agent.put('/playlists/XXXX/toggle-active')
        expect(Playlist.findByPk).toHaveBeenCalledTimes(1);
        expect(Playlist.update).toHaveBeenCalledTimes(1);
        expect(resp.body).toStrictEqual({ ...mockManagedPlaylist, active: 'N'});
    });

    it('catches db error 1/2', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code')

        Playlist.findByPk.mockRejectedValueOnce(new Error('error'));
        Playlist.update.mockResolvedValueOnce(mockManagedPlaylist);
        const resp = await agent.put('/playlists/XXXX/toggle-active')
        expect(Playlist.findByPk).toHaveBeenCalledTimes(1);
        expect(Playlist.update).toHaveBeenCalledTimes(0);
        expect(resp.statusCode).toBe(500);
        expect(resp.body).toEqual({ message: 'error' })

    });

    it('catches db error 2/2', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code')


        Playlist.findByPk.mockResolvedValueOnce(mockManagedPlaylist);
        Playlist.update.mockRejectedValueOnce(new Error('error'));
        const resp = await agent.put('/playlists/XXXX/toggle-active')
        expect(Playlist.findByPk).toHaveBeenCalledTimes(1);
        expect(Playlist.update).toHaveBeenCalledTimes(1);
        /** @todo why does this inner error not result in a 500 */
        // expect(resp.statusCode).toBe(500);
        // expect(resp.body).toEqual({ message: 'error' })

    });

});

describe('GET /favorite', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        agent = request.agent(app);
    });


    it('gets a user\'s favorite managed playlists', async () => {
        await agent.get('/auth/spotify/callback?code=valid-code')

        Favorite.findAll.mockResolvedValueOnce([mockManagedPlaylist]);
        const resp = await agent.get('/playlists/favorite')
        expect(Playlist.findAll).toHaveBeenCalledTimes(1);
        expect(resp.body).toStrictEqual([mockManagedPlaylist]);
    });

    // it('catches db error 1/2', async () => {

    //     await agent.get('/auth/spotify/callback?code=valid-code')

    //     Playlist.findByPk.mockRejectedValueOnce(new Error('error'));
    //     Playlist.update.mockResolvedValueOnce(mockManagedPlaylist);
    //     const resp = await agent.put('/playlists/XXXX/toggle-active')
    //     expect(Playlist.findByPk).toHaveBeenCalledTimes(1);
    //     expect(Playlist.update).toHaveBeenCalledTimes(0);
    //     expect(resp.statusCode).toBe(500);
    //     expect(resp.body).toEqual({ message: 'error' })

    // });

    // it('catches db error 2/2', async () => {

    //     await agent.get('/auth/spotify/callback?code=valid-code')


    //     Playlist.findByPk.mockResolvedValueOnce(mockManagedPlaylist);
    //     Playlist.update.mockRejectedValueOnce(new Error('error'));
    //     const resp = await agent.put('/playlists/XXXX/toggle-active')
    //     expect(Playlist.findByPk).toHaveBeenCalledTimes(1);
    //     expect(Playlist.update).toHaveBeenCalledTimes(1);
    //     /** @todo why does this inner error not result in a 500 */
    //     // expect(resp.statusCode).toBe(500);
    //     // expect(resp.body).toEqual({ message: 'error' })

    // });

});

// Non-db routes ------------------------------------------------------------------------------------------------------

describe('GET /spotify', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('gets a page of playlists', async () => {
        spotifyApi.getUserPlaylists.mockResolvedValueOnce({ body: 'whatever' });
        const resp = await request(app).get('/playlists/spotify?limit=25&offset=25');
        expect(spotifyApi.getUserPlaylists).toHaveBeenCalledTimes(1);
        expect(resp.body).toStrictEqual('whatever');
    });

    it('catches WebApiError', async () => {

        spotifyApi.getUserPlaylists.mockRejectedValue(new MockWebApiError('', '', 403, mockWebApiErrorMessage));
        const resp = await request(app).get('/playlists/spotify?limit=25&offset=25');
        expect(spotifyApi.getUserPlaylists).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(403);
        expect(resp.body).toStrictEqual({ message: mockWebApiErrorMessage });
    });
});

describe('GET /spotify/:id', () => {


    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('gets playlist details', async () => {
        spotifyApi.getPlaylist.mockResolvedValueOnce({ body: 'whatever' });
        const resp = await request(app).get('/playlists/spotify/XXX?fields=name,id');
        expect(spotifyApi.getPlaylist).toHaveBeenCalledTimes(1);
        expect(resp.body).toStrictEqual('whatever');
    });

    it('catches WebApiError', async () => {

        spotifyApi.getPlaylist.mockRejectedValue(new MockWebApiError('', '', 403, mockWebApiErrorMessage));
        const resp = await request(app).get('/playlists/spotify/XXX?fields=name,id');
        expect(spotifyApi.getPlaylist).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(403);
        expect(resp.body).toStrictEqual({ message: mockWebApiErrorMessage });
    });
});

describe('POST /spotify/:id/add-track', () => {


    beforeEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
    });

    it('adds track to playlist', async () => {
        spotifyApi.removeTracksFromPlaylist.mockResolvedValueOnce('whatever');
        spotifyApi.addTracksToPlaylist.mockResolvedValueOnce('whatever2');
        const resp = await request(app).post('/playlists/spotify/XXX/add-track')
            .send({ uri: 'http://track' });
        expect(spotifyApi.removeTracksFromPlaylist).toHaveBeenCalledTimes(1);
        expect(spotifyApi.addTracksToPlaylist).toHaveBeenCalledTimes(1);
        expect(resp.body).toStrictEqual('whatever2');
    });

    it('catches WebApiError 1/2', async () => {
        spotifyApi.removeTracksFromPlaylist.mockRejectedValueOnce(new MockWebApiError('', '', 403, mockWebApiErrorMessage));
        spotifyApi.addTracksToPlaylist.mockResolvedValueOnce('whatever2');
        const resp = await request(app).post('/playlists/spotify/XXX/add-track')
            .send({ uri: 'http://track' });
        expect(spotifyApi.removeTracksFromPlaylist).toHaveBeenCalledTimes(1);
        expect(spotifyApi.addTracksToPlaylist).toHaveBeenCalledTimes(0);
        expect(resp.body).toStrictEqual({ message: mockWebApiErrorMessage });
    });

    it('catches WebApiError 2/2', async () => {
        spotifyApi.removeTracksFromPlaylist.mockResolvedValueOnce('whatever');
        spotifyApi.addTracksToPlaylist.mockRejectedValueOnce(new MockWebApiError('', '', 403, mockWebApiErrorMessage));
        const resp = await request(app).post('/playlists/spotify/XXX/add-track')
            .send({ uri: 'http://track' });
        expect(spotifyApi.removeTracksFromPlaylist).toHaveBeenCalledTimes(1);
        expect(spotifyApi.addTracksToPlaylist).toHaveBeenCalledTimes(1);

        expect(resp.body).toStrictEqual({ message: mockWebApiErrorMessage });
    });
});

describe('DELETE /spotify/:id/remove-track', () => {


    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('removes track from playlist', async () => {
        spotifyApi.removeTracksFromPlaylist.mockResolvedValueOnce('whatever');
        const resp = await request(app).delete('/playlists/spotify/XXX/remove-track')
            .send({ uri: 'http://track' });
        expect(spotifyApi.removeTracksFromPlaylist).toHaveBeenCalledTimes(1);
        expect(resp.body).toStrictEqual('whatever');
    });

    it('catches WebApiError', async () => {
        spotifyApi.removeTracksFromPlaylist.mockRejectedValueOnce(new MockWebApiError('', '', 403, mockWebApiErrorMessage));
        const resp = await request(app).delete('/playlists/spotify/XXX/remove-track')
            .send({ uri: 'http://track' });
        expect(spotifyApi.removeTracksFromPlaylist).toHaveBeenCalledTimes(1);
        expect(resp.body).toStrictEqual({ message: mockWebApiErrorMessage });
    });


});
