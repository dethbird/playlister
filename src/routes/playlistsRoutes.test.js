// NOTE: tests for many playlist routes live below. The consolidated "all" endpoint
// tests are implemented in a separate file to avoid colliding with the existing
// route test suite that uses app-level session/auth mocks.
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


describe('PUT /invert-active-all', () => {

    beforeEach(() => {
        agent = request.agent(app);
        jest.clearAllMocks();
    });

    it('inverts all user\'s managed playlists active status', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        Playlist.findAll.mockResolvedValueOnce([mockManagedPlaylist, mockManagedPlaylist, mockManagedPlaylist]);
        Playlist.update.mockResolvedValue(true); // Use mockResolvedValue (not Once) for multiple calls
        const resp = await agent.put('/playlists/invert-active-all');
        expect(Playlist.findAll).toHaveBeenCalledTimes(1);
        expect(Playlist.update).toHaveBeenCalledTimes(3);
        expect(resp.body).toStrictEqual(true);
    });

    it('handles empty playlist list', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        Playlist.findAll.mockResolvedValueOnce([]);
        const resp = await agent.put('/playlists/invert-active-all');
        expect(Playlist.findAll).toHaveBeenCalledTimes(1);
        expect(Playlist.update).not.toHaveBeenCalled();
        expect(resp.body).toStrictEqual(true);
    });

    it('inverts mixed active/inactive playlists correctly', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        const activePlaylists = [
            { ...mockManagedPlaylist, id: 1, active: 'Y' },
            { ...mockManagedPlaylist, id: 2, active: 'N' },
            { ...mockManagedPlaylist, id: 3, active: 'Y' }
        ];

        Playlist.findAll.mockResolvedValueOnce(activePlaylists);
        Playlist.update.mockResolvedValue(true);
        
        const resp = await agent.put('/playlists/invert-active-all');
        
        expect(Playlist.findAll).toHaveBeenCalledWith({
            where: { user_id: mockSessionUser.user.id }
        });
        expect(Playlist.update).toHaveBeenCalledTimes(3);
        
        // Check that active 'Y' becomes 'N'
        expect(Playlist.update).toHaveBeenCalledWith(
            { active: 'N' },
            { where: { id: 1, user_id: mockSessionUser.user.id } }
        );
        // Check that active 'N' becomes 'Y'
        expect(Playlist.update).toHaveBeenCalledWith(
            { active: 'Y' },
            { where: { id: 2, user_id: mockSessionUser.user.id } }
        );
        expect(Playlist.update).toHaveBeenCalledWith(
            { active: 'N' },
            { where: { id: 3, user_id: mockSessionUser.user.id } }
        );
        
        expect(resp.body).toStrictEqual(true);
    });

    it('catches db error during findAll', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        Playlist.findAll.mockRejectedValue(new Error('database error'));
        const resp = await agent.put('/playlists/invert-active-all');
        expect(Playlist.findAll).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(500);
        expect(resp.body).toEqual({ message: 'database error' })

    });

    it('catches db error during update operations', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        Playlist.findAll.mockResolvedValueOnce([mockManagedPlaylist]);
        Playlist.update.mockRejectedValue(new Error('update error'));
        
        const resp = await agent.put('/playlists/invert-active-all');
        
        expect(Playlist.findAll).toHaveBeenCalledTimes(1);
        expect(Playlist.update).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(500);
        expect(resp.body).toEqual({ message: 'update error' });

    });

});

describe('PUT /reorder', () => {

    beforeEach(() => {
        agent = request.agent(app);
        jest.clearAllMocks();
    });

    it('reorders all user\'s managed playlists', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        const mockPlaylist1 = { ...mockManagedPlaylist, id: 1, save: jest.fn().mockResolvedValue(true) };
        const mockPlaylist2 = { ...mockManagedPlaylist, id: 2, save: jest.fn().mockResolvedValue(true) };
        const mockPlaylist3 = { ...mockManagedPlaylist, id: 3, save: jest.fn().mockResolvedValue(true) };
        const mockPlaylist4 = { ...mockManagedPlaylist, id: 4, save: jest.fn().mockResolvedValue(true) };

        Playlist.findByPk.mockResolvedValueOnce(mockPlaylist1);
        Playlist.findByPk.mockResolvedValueOnce(mockPlaylist2);
        Playlist.findByPk.mockResolvedValueOnce(mockPlaylist3);
        Playlist.findByPk.mockResolvedValueOnce(mockPlaylist4);

        const resp = await agent.put('/playlists/reorder')
            .send({ids: [1,2,3,4]});
        
        expect(Playlist.findByPk).toHaveBeenCalledTimes(4);
        expect(Playlist.findByPk).toHaveBeenCalledWith(1);
        expect(Playlist.findByPk).toHaveBeenCalledWith(2);
        expect(Playlist.findByPk).toHaveBeenCalledWith(3);
        expect(Playlist.findByPk).toHaveBeenCalledWith(4);
        
        // Check that sort_order was set correctly
        expect(mockPlaylist1.sort_order).toBe(0);
        expect(mockPlaylist2.sort_order).toBe(1);
        expect(mockPlaylist3.sort_order).toBe(2);
        expect(mockPlaylist4.sort_order).toBe(3);
        
        expect(mockPlaylist1.save).toHaveBeenCalledTimes(1);
        expect(mockPlaylist2.save).toHaveBeenCalledTimes(1);
        expect(mockPlaylist3.save).toHaveBeenCalledTimes(1);
        expect(mockPlaylist4.save).toHaveBeenCalledTimes(1);
        
        expect(resp.body).toStrictEqual(true);
    });

    it('handles empty ids array', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        const resp = await agent.put('/playlists/reorder')
            .send({ids: []});
        
        expect(Playlist.findByPk).not.toHaveBeenCalled();
        expect(resp.body).toStrictEqual(true);
    });

    it('handles non-existent playlist ids gracefully', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        const mockPlaylist1 = { ...mockManagedPlaylist, id: 1, save: jest.fn().mockResolvedValue(true) };
        
        Playlist.findByPk.mockResolvedValueOnce(mockPlaylist1);
        Playlist.findByPk.mockResolvedValueOnce(null); // Non-existent playlist
        Playlist.findByPk.mockResolvedValueOnce(null); // Non-existent playlist

        const resp = await agent.put('/playlists/reorder')
            .send({ids: [1,999,1000]});
        
        expect(Playlist.findByPk).toHaveBeenCalledTimes(3);
        expect(mockPlaylist1.sort_order).toBe(0);
        expect(mockPlaylist1.save).toHaveBeenCalledTimes(1);
        expect(resp.body).toStrictEqual(true);
    });

    it('catches db error during findByPk', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        Playlist.findByPk.mockRejectedValue(new Error('database error'));
        const resp = await agent.put('/playlists/reorder')
            .send({ids: [1,2,3]});
        
        expect(Playlist.findByPk).toHaveBeenCalledTimes(3); // Promise.all will call all 3 before failing
        expect(resp.statusCode).toBe(500);
        expect(resp.body).toEqual({ message: 'database error' });

    });

    it('catches db error during save operation', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        const mockPlaylist = { 
            ...mockManagedPlaylist, 
            id: 1, 
            save: jest.fn().mockRejectedValue(new Error('save error'))
        };
        
        Playlist.findByPk.mockResolvedValueOnce(mockPlaylist);
        
        const resp = await agent.put('/playlists/reorder')
            .send({ids: [1]});
        
        expect(Playlist.findByPk).toHaveBeenCalledTimes(1);
        expect(mockPlaylist.save).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(500);
        expect(resp.body).toEqual({ message: 'save error' });

    });

});

describe('PUT /add-track-to-active', () => {

    beforeEach(() => {
        agent = request.agent(app);
        jest.clearAllMocks();
    });

    it('adds track to all active managed playlists', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        const activePlaylists = [
            { ...mockManagedPlaylist, id: 1, spotify_playlist_id: 'playlist1', active: 'Y' },
            { ...mockManagedPlaylist, id: 2, spotify_playlist_id: 'playlist2', active: 'Y' },
            { ...mockManagedPlaylist, id: 3, spotify_playlist_id: 'playlist3', active: 'Y' }
        ];

        Playlist.findAll.mockResolvedValueOnce(activePlaylists);
        spotifyApi.removeTracksFromPlaylist.mockResolvedValue({ body: { snapshot_id: 'snap1' } });
        spotifyApi.addTracksToPlaylist.mockResolvedValue({ body: { snapshot_id: 'snap2' } });

        const resp = await agent.put('/playlists/add-track-to-active')
            .send({ uri: 'spotify:track:4uLU6hMCjMI75M1A2tKUQC' });
        
        expect(Playlist.findAll).toHaveBeenCalledWith({
            where: { 
                active: 'Y',
                user_id: mockSessionUser.user.id 
            }
        });
        
        // Should remove track from each playlist first
        expect(spotifyApi.removeTracksFromPlaylist).toHaveBeenCalledTimes(3);
        expect(spotifyApi.removeTracksFromPlaylist).toHaveBeenCalledWith('playlist1', [{ uri: 'spotify:track:4uLU6hMCjMI75M1A2tKUQC' }]);
        expect(spotifyApi.removeTracksFromPlaylist).toHaveBeenCalledWith('playlist2', [{ uri: 'spotify:track:4uLU6hMCjMI75M1A2tKUQC' }]);
        expect(spotifyApi.removeTracksFromPlaylist).toHaveBeenCalledWith('playlist3', [{ uri: 'spotify:track:4uLU6hMCjMI75M1A2tKUQC' }]);
        
        // Then add track to each playlist
        expect(spotifyApi.addTracksToPlaylist).toHaveBeenCalledTimes(3);
        expect(spotifyApi.addTracksToPlaylist).toHaveBeenCalledWith('playlist1', ['spotify:track:4uLU6hMCjMI75M1A2tKUQC']);
        expect(spotifyApi.addTracksToPlaylist).toHaveBeenCalledWith('playlist2', ['spotify:track:4uLU6hMCjMI75M1A2tKUQC']);
        expect(spotifyApi.addTracksToPlaylist).toHaveBeenCalledWith('playlist3', ['spotify:track:4uLU6hMCjMI75M1A2tKUQC']);
        
        expect(resp.body).toEqual(['playlist1', 'playlist2', 'playlist3']);
    });

    it('handles empty active playlists list', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        Playlist.findAll.mockResolvedValueOnce([]);

        const resp = await agent.put('/playlists/add-track-to-active')
            .send({ uri: 'spotify:track:4uLU6hMCjMI75M1A2tKUQC' });
        
        expect(Playlist.findAll).toHaveBeenCalledTimes(1);
        expect(spotifyApi.removeTracksFromPlaylist).not.toHaveBeenCalled();
        expect(spotifyApi.addTracksToPlaylist).not.toHaveBeenCalled();
        expect(resp.body).toEqual([]);
    });

    it('handles partial failures in Spotify API operations', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        const activePlaylists = [
            { ...mockManagedPlaylist, id: 1, spotify_playlist_id: 'playlist1', active: 'Y' },
            { ...mockManagedPlaylist, id: 2, spotify_playlist_id: 'playlist2', active: 'Y' },
            { ...mockManagedPlaylist, id: 3, spotify_playlist_id: 'playlist3', active: 'Y' }
        ];

        Playlist.findAll.mockResolvedValueOnce(activePlaylists);
        
        // First playlist succeeds
        spotifyApi.removeTracksFromPlaylist.mockResolvedValueOnce({ body: { snapshot_id: 'snap1' } });
        spotifyApi.addTracksToPlaylist.mockResolvedValueOnce({ body: { snapshot_id: 'snap2' } });
        
        // Second playlist fails on remove
        spotifyApi.removeTracksFromPlaylist.mockRejectedValueOnce(new MockWebApiError({}, {}, 404, 'Not found'));
        
        // Third playlist succeeds
        spotifyApi.removeTracksFromPlaylist.mockResolvedValueOnce({ body: { snapshot_id: 'snap3' } });
        spotifyApi.addTracksToPlaylist.mockResolvedValueOnce({ body: { snapshot_id: 'snap4' } });

        const resp = await agent.put('/playlists/add-track-to-active')
            .send({ uri: 'spotify:track:4uLU6hMCjMI75M1A2tKUQC' });
        
        expect(spotifyApi.removeTracksFromPlaylist).toHaveBeenCalledTimes(3);
        expect(spotifyApi.addTracksToPlaylist).toHaveBeenCalledTimes(2); // Only called for successful removals
        
        // Should only return successfully updated playlists
        expect(resp.body).toEqual(['playlist1', 'playlist3']);
    });

    it('catches database error during findAll', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        Playlist.findAll.mockRejectedValue(new Error('database error'));

        const resp = await agent.put('/playlists/add-track-to-active')
            .send({ uri: 'spotify:track:4uLU6hMCjMI75M1A2tKUQC' });
        
        expect(Playlist.findAll).toHaveBeenCalledTimes(1);
        expect(spotifyApi.removeTracksFromPlaylist).not.toHaveBeenCalled();
        expect(spotifyApi.addTracksToPlaylist).not.toHaveBeenCalled();
        expect(resp.statusCode).toBe(500);
        expect(resp.body).toEqual({ message: 'database error' });

    });

    it('handles missing track URI in request body', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        const activePlaylists = [
            { ...mockManagedPlaylist, id: 1, spotify_playlist_id: 'playlist1', active: 'Y' }
        ];

        Playlist.findAll.mockResolvedValueOnce(activePlaylists);
        spotifyApi.removeTracksFromPlaylist.mockResolvedValue({ body: { snapshot_id: 'snap1' } });
        spotifyApi.addTracksToPlaylist.mockResolvedValue({ body: { snapshot_id: 'snap2' } });

        const resp = await agent.put('/playlists/add-track-to-active')
            .send({}); // No URI provided
        
        expect(Playlist.findAll).toHaveBeenCalledTimes(1);
        expect(spotifyApi.removeTracksFromPlaylist).toHaveBeenCalledWith('playlist1', [{ uri: undefined }]);
        expect(spotifyApi.addTracksToPlaylist).toHaveBeenCalledWith('playlist1', [undefined]);
        expect(resp.body).toEqual(['playlist1']);
    });

});

describe('PUT /remove-track-from-active', () => {

    beforeEach(() => {
        agent = request.agent(app);
        jest.clearAllMocks();
    });

    it('removes track from all active managed playlists', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        const activePlaylists = [
            { ...mockManagedPlaylist, id: 1, spotify_playlist_id: 'playlist1', active: 'Y' },
            { ...mockManagedPlaylist, id: 2, spotify_playlist_id: 'playlist2', active: 'Y' },
            { ...mockManagedPlaylist, id: 3, spotify_playlist_id: 'playlist3', active: 'Y' }
        ];

        Playlist.findAll.mockResolvedValueOnce(activePlaylists);
        spotifyApi.removeTracksFromPlaylist.mockResolvedValue({ body: { snapshot_id: 'snap1' } });

        const resp = await agent.put('/playlists/remove-track-from-active')
            .send({ uri: 'spotify:track:4uLU6hMCjMI75M1A2tKUQC' });
        
        expect(Playlist.findAll).toHaveBeenCalledWith({
            where: { 
                active: 'Y',
                user_id: mockSessionUser.user.id 
            }
        });
        
        // Should remove track from each playlist
        expect(spotifyApi.removeTracksFromPlaylist).toHaveBeenCalledTimes(3);
        expect(spotifyApi.removeTracksFromPlaylist).toHaveBeenCalledWith('playlist1', [{ uri: 'spotify:track:4uLU6hMCjMI75M1A2tKUQC' }]);
        expect(spotifyApi.removeTracksFromPlaylist).toHaveBeenCalledWith('playlist2', [{ uri: 'spotify:track:4uLU6hMCjMI75M1A2tKUQC' }]);
        expect(spotifyApi.removeTracksFromPlaylist).toHaveBeenCalledWith('playlist3', [{ uri: 'spotify:track:4uLU6hMCjMI75M1A2tKUQC' }]);
        
        expect(resp.body).toEqual(['playlist1', 'playlist2', 'playlist3']);
    });

    it('handles empty active playlists list', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        Playlist.findAll.mockResolvedValueOnce([]);

        const resp = await agent.put('/playlists/remove-track-from-active')
            .send({ uri: 'spotify:track:4uLU6hMCjMI75M1A2tKUQC' });
        
        expect(Playlist.findAll).toHaveBeenCalledTimes(1);
        expect(spotifyApi.removeTracksFromPlaylist).not.toHaveBeenCalled();
        expect(resp.body).toEqual([]);
    });

    it('handles partial failures in Spotify API operations', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        const activePlaylists = [
            { ...mockManagedPlaylist, id: 1, spotify_playlist_id: 'playlist1', active: 'Y' },
            { ...mockManagedPlaylist, id: 2, spotify_playlist_id: 'playlist2', active: 'Y' },
            { ...mockManagedPlaylist, id: 3, spotify_playlist_id: 'playlist3', active: 'Y' }
        ];

        Playlist.findAll.mockResolvedValueOnce(activePlaylists);
        
        // First playlist succeeds
        spotifyApi.removeTracksFromPlaylist.mockResolvedValueOnce({ body: { snapshot_id: 'snap1' } });
        
        // Second playlist fails
        spotifyApi.removeTracksFromPlaylist.mockRejectedValueOnce(new MockWebApiError({}, {}, 404, 'Track not found'));
        
        // Third playlist succeeds
        spotifyApi.removeTracksFromPlaylist.mockResolvedValueOnce({ body: { snapshot_id: 'snap2' } });

        const resp = await agent.put('/playlists/remove-track-from-active')
            .send({ uri: 'spotify:track:4uLU6hMCjMI75M1A2tKUQC' });
        
        expect(spotifyApi.removeTracksFromPlaylist).toHaveBeenCalledTimes(3);
        
        // Should only return successfully updated playlists
        expect(resp.body).toEqual(['playlist1', 'playlist3']);
    });

    it('handles all Spotify API failures gracefully', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        const activePlaylists = [
            { ...mockManagedPlaylist, id: 1, spotify_playlist_id: 'playlist1', active: 'Y' },
            { ...mockManagedPlaylist, id: 2, spotify_playlist_id: 'playlist2', active: 'Y' }
        ];

        Playlist.findAll.mockResolvedValueOnce(activePlaylists);
        
        // All API calls fail
        spotifyApi.removeTracksFromPlaylist.mockRejectedValue(new MockWebApiError({}, {}, 403, 'Insufficient permissions'));

        const resp = await agent.put('/playlists/remove-track-from-active')
            .send({ uri: 'spotify:track:4uLU6hMCjMI75M1A2tKUQC' });
        
        expect(spotifyApi.removeTracksFromPlaylist).toHaveBeenCalledTimes(2);
        
        // Should return empty array when all operations fail
        expect(resp.body).toEqual([]);
    });

    it('catches database error during findAll', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        Playlist.findAll.mockRejectedValue(new Error('database error'));

        const resp = await agent.put('/playlists/remove-track-from-active')
            .send({ uri: 'spotify:track:4uLU6hMCjMI75M1A2tKUQC' });
        
        expect(Playlist.findAll).toHaveBeenCalledTimes(1);
        expect(spotifyApi.removeTracksFromPlaylist).not.toHaveBeenCalled();
        expect(resp.statusCode).toBe(500);
        expect(resp.body).toEqual({ message: 'database error' });

    });

    it('handles missing track URI in request body', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        const activePlaylists = [
            { ...mockManagedPlaylist, id: 1, spotify_playlist_id: 'playlist1', active: 'Y' }
        ];

        Playlist.findAll.mockResolvedValueOnce(activePlaylists);
        spotifyApi.removeTracksFromPlaylist.mockResolvedValue({ body: { snapshot_id: 'snap1' } });

        const resp = await agent.put('/playlists/remove-track-from-active')
            .send({}); // No URI provided
        
        expect(Playlist.findAll).toHaveBeenCalledTimes(1);
        expect(spotifyApi.removeTracksFromPlaylist).toHaveBeenCalledWith('playlist1', [{ uri: undefined }]);
        expect(resp.body).toEqual(['playlist1']);
    });

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

    it('toggles a playlist from active Y to N', async () => {
        await agent.get('/auth/spotify/callback?code=valid-code');

        const activePlaylist = { ...mockManagedPlaylist, active: 'Y' };
        
        Playlist.findOne.mockResolvedValueOnce(activePlaylist);
        Playlist.update.mockResolvedValueOnce([1]); // Returns array with count of updated rows

        const resp = await agent.put('/playlists/123/toggle-active');
        
        expect(Playlist.findOne).toHaveBeenCalledWith({
            where: {
                id: '123',
                user_id: mockSessionUser.user.id
            }
        });
        expect(Playlist.update).toHaveBeenCalledWith(
            { active: 'N' },
            {
                where: {
                    id: '123',
                    user_id: mockSessionUser.user.id
                }
            }
        );
        expect(resp.body).toEqual({ ...activePlaylist, active: 'N' });
    });

    it('toggles a playlist from active N to Y', async () => {
        await agent.get('/auth/spotify/callback?code=valid-code');

        const inactivePlaylist = { ...mockManagedPlaylist, active: 'N' };
        
        Playlist.findOne.mockResolvedValueOnce(inactivePlaylist);
        Playlist.update.mockResolvedValueOnce([1]);

        const resp = await agent.put('/playlists/123/toggle-active');
        
        expect(Playlist.findOne).toHaveBeenCalledWith({
            where: {
                id: '123',
                user_id: mockSessionUser.user.id
            }
        });
        expect(Playlist.update).toHaveBeenCalledWith(
            { active: 'Y' },
            {
                where: {
                    id: '123',
                    user_id: mockSessionUser.user.id
                }
            }
        );
        expect(resp.body).toEqual({ ...inactivePlaylist, active: 'Y' });
    });

    it('returns 404 when playlist does not exist', async () => {
        await agent.get('/auth/spotify/callback?code=valid-code');

        Playlist.findOne.mockResolvedValueOnce(null); // Playlist not found

        const resp = await agent.put('/playlists/nonexistent/toggle-active');
        
        expect(Playlist.findOne).toHaveBeenCalledTimes(1);
        expect(Playlist.update).not.toHaveBeenCalled();
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual({ message: 'Playlist not found or access denied' });
    });

    it('returns 404 when playlist belongs to different user', async () => {
        await agent.get('/auth/spotify/callback?code=valid-code');

        // Mock returns null because playlist doesn't belong to authenticated user
        Playlist.findOne.mockResolvedValueOnce(null);

        const resp = await agent.put('/playlists/123/toggle-active');
        
        expect(Playlist.findOne).toHaveBeenCalledWith({
            where: {
                id: '123',
                user_id: mockSessionUser.user.id
            }
        });
        expect(Playlist.update).not.toHaveBeenCalled();
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual({ message: 'Playlist not found or access denied' });
    });

    it('catches database error during findOne', async () => {
        await agent.get('/auth/spotify/callback?code=valid-code');

        Playlist.findOne.mockRejectedValue(new Error('database connection failed'));

        const resp = await agent.put('/playlists/123/toggle-active');
        
        expect(Playlist.findOne).toHaveBeenCalledTimes(1);
        expect(Playlist.update).not.toHaveBeenCalled();
        expect(resp.statusCode).toBe(500);
        expect(resp.body).toEqual({ message: 'database connection failed' });
    });

    it('catches database error during update', async () => {
        await agent.get('/auth/spotify/callback?code=valid-code');

        const activePlaylist = { ...mockManagedPlaylist, active: 'Y' };
        
        Playlist.findOne.mockResolvedValueOnce(activePlaylist);
        Playlist.update.mockRejectedValue(new Error('update operation failed'));

        const resp = await agent.put('/playlists/123/toggle-active');
        
        expect(Playlist.findOne).toHaveBeenCalledTimes(1);
        expect(Playlist.update).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(500);
        expect(resp.body).toEqual({ message: 'update operation failed' });
    });

    it('handles invalid playlist ID parameter', async () => {
        await agent.get('/auth/spotify/callback?code=valid-code');

        Playlist.findOne.mockResolvedValueOnce(null);

        const resp = await agent.put('/playlists/invalid-id/toggle-active');
        
        expect(Playlist.findOne).toHaveBeenCalledWith({
            where: {
                id: 'invalid-id',
                user_id: mockSessionUser.user.id
            }
        });
        expect(Playlist.update).not.toHaveBeenCalled();
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual({ message: 'Playlist not found or access denied' });
    });

});

describe('PUT /favorite', () => {

    beforeEach(() => {
        agent = request.agent(app);
        jest.clearAllMocks();
    });

    it('adds a playlist to favorites when it is not already favorited', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        const mockNewFavorite = {
            id: 1,
            user_id: mockSessionUser.user.id,
            spotify_playlist_id: 'playlist123'
        };

        Favorite.findOne.mockResolvedValueOnce(null); // No existing favorite
        Favorite.create.mockResolvedValueOnce(mockNewFavorite);

        const resp = await agent.put('/playlists/favorite')
            .send({ id: 'playlist123' });
        
        expect(Favorite.findOne).toHaveBeenCalledWith({
            where: {
                user_id: mockSessionUser.user.id,
                spotify_playlist_id: 'playlist123'
            }
        });
        expect(Favorite.create).toHaveBeenCalledWith({
            user_id: mockSessionUser.user.id,
            spotify_playlist_id: 'playlist123'
        });
        expect(Favorite.destroy).not.toHaveBeenCalled();
        expect(resp.body).toEqual(mockNewFavorite);
    });

    it('removes a playlist from favorites when it is already favorited', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        const mockExistingFavorite = {
            id: 1,
            user_id: mockSessionUser.user.id,
            spotify_playlist_id: 'playlist123'
        };

        Favorite.findOne.mockResolvedValueOnce(mockExistingFavorite); // Existing favorite
        Favorite.destroy.mockResolvedValueOnce(1); // Returns number of deleted rows

        const resp = await agent.put('/playlists/favorite')
            .send({ id: 'playlist123' });
        
        expect(Favorite.findOne).toHaveBeenCalledWith({
            where: {
                user_id: mockSessionUser.user.id,
                spotify_playlist_id: 'playlist123'
            }
        });
        expect(Favorite.destroy).toHaveBeenCalledWith({
            where: {
                user_id: mockSessionUser.user.id,
                spotify_playlist_id: 'playlist123'
            }
        });
        expect(Favorite.create).not.toHaveBeenCalled();
        expect(resp.body).toBe(1);
    });

    it('handles missing playlist id in request body', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        Favorite.findOne.mockResolvedValueOnce(null);
        Favorite.create.mockResolvedValueOnce({
            id: 1,
            user_id: mockSessionUser.user.id,
            spotify_playlist_id: undefined
        });

        const resp = await agent.put('/playlists/favorite')
            .send({}); // No id provided
        
        expect(Favorite.findOne).toHaveBeenCalledWith({
            where: {
                user_id: mockSessionUser.user.id,
                spotify_playlist_id: undefined
            }
        });
        expect(Favorite.create).toHaveBeenCalledWith({
            user_id: mockSessionUser.user.id,
            spotify_playlist_id: undefined
        });
    });

    it('catches database error during findOne', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        Favorite.findOne.mockRejectedValue(new Error('database connection failed'));

        const resp = await agent.put('/playlists/favorite')
            .send({ id: 'playlist123' });
        
        expect(Favorite.findOne).toHaveBeenCalledTimes(1);
        expect(Favorite.create).not.toHaveBeenCalled();
        expect(Favorite.destroy).not.toHaveBeenCalled();
        expect(resp.statusCode).toBe(500);
        expect(resp.body).toEqual({ message: 'database connection failed' });
    });

    it('catches database error during create', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        Favorite.findOne.mockResolvedValueOnce(null); // No existing favorite
        Favorite.create.mockRejectedValue(new Error('create operation failed'));

        const resp = await agent.put('/playlists/favorite')
            .send({ id: 'playlist123' });
        
        expect(Favorite.findOne).toHaveBeenCalledTimes(1);
        expect(Favorite.create).toHaveBeenCalledTimes(1);
        expect(Favorite.destroy).not.toHaveBeenCalled();
        expect(resp.statusCode).toBe(500);
        expect(resp.body).toEqual({ message: 'create operation failed' });
    });

    it('catches database error during destroy', async () => {

        await agent.get('/auth/spotify/callback?code=valid-code');

        const mockExistingFavorite = {
            id: 1,
            user_id: mockSessionUser.user.id,
            spotify_playlist_id: 'playlist123'
        };

        Favorite.findOne.mockResolvedValueOnce(mockExistingFavorite); // Existing favorite
        Favorite.destroy.mockRejectedValue(new Error('destroy operation failed'));

        const resp = await agent.put('/playlists/favorite')
            .send({ id: 'playlist123' });
        
        expect(Favorite.findOne).toHaveBeenCalledTimes(1);
        expect(Favorite.destroy).toHaveBeenCalledTimes(1);
        expect(Favorite.create).not.toHaveBeenCalled();
        expect(resp.statusCode).toBe(500);
        expect(resp.body).toEqual({ message: 'destroy operation failed' });
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
