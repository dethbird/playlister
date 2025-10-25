const express = require('express');
const request = require('supertest');

// mock the spotifyApi module used by the router
const mockGetUserPlaylists = jest.fn();
jest.mock('../modules/spotifyApi', () => ({
    getUserPlaylists: (...args) => mockGetUserPlaylists(...args)
}));

// require the router AFTER mocking the spotify module
const playlistsRouter = require('./playlistsRoutes');

describe('GET /playlists/spotify/all (consolidated)', () => {
    let app;

    beforeEach(() => {
        app = express();

        // simple middleware to set an authenticated user
        app.use((req, res, next) => {
            req.user = { user: { id: 1 }, accessToken: 'dummy' };
            next();
        });

        app.use('/playlists', playlistsRouter);
        mockGetUserPlaylists.mockReset();
    });

    it('aggregates multiple pages into one response', async () => {
        // first page: next exists
        mockGetUserPlaylists
            .mockImplementationOnce(() => Promise.resolve({ body: { items: [{ id: 'p1' }, { id: 'p2' }], next: 'url', total: 4 } }))
            .mockImplementationOnce(() => Promise.resolve({ body: { items: [{ id: 'p3' }, { id: 'p4' }], next: null, total: 4 } }));

        const res = await request(app).get('/playlists/spotify/all');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('total', 4);
        expect(res.body).toHaveProperty('limit', 50);
        expect(Array.isArray(res.body.items)).toBe(true);
        expect(res.body.items.map(i => i.id)).toEqual(['p1', 'p2', 'p3', 'p4']);
        // ensure the spotifyApi was called at least twice (two pages)
        expect(mockGetUserPlaylists.mock.calls.length).toBeGreaterThanOrEqual(2);
    });

    it('retries when Spotify returns 429 and respects Retry-After', async () => {
        // First call: simulate 429 with Retry-After=0 (to avoid test delay)
        mockGetUserPlaylists
            .mockImplementationOnce(() => Promise.reject({ statusCode: 429, headers: { 'retry-after': '0' }, message: 'rate limit' }))
            .mockImplementationOnce(() => Promise.resolve({ body: { items: [{ id: 'p1' }], next: null, total: 1 } }));

        const res = await request(app).get('/playlists/spotify/all');
        expect(res.status).toBe(200);
        expect(res.body.items.map(i => i.id)).toEqual(['p1']);
        // ensure retries happened (called at least twice)
        expect(mockGetUserPlaylists.mock.calls.length).toBeGreaterThanOrEqual(2);
    });

    it('returns 401 when unauthenticated', async () => {
        const unauthApp = express();
        // mount router without auth middleware
        unauthApp.use('/playlists', playlistsRouter);

        const res = await request(unauthApp).get('/playlists/spotify/all');
        expect(res.status).toBe(401);
    });
});
