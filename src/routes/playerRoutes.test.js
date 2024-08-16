const request = require('supertest');
const app = require('../app');
const spotifyApi = require('../modules/spotifyApi');

const { mockSpotifyTrack, mockWebApiErrorMessage, MockWebApiError } = require('../../testutils/mocks/contants');

jest.mock('../modules/spotifyApi');

describe('GET /currently-playing', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it ('gets current track', async () => {

        spotifyApi.getMyCurrentPlayingTrack.mockResolvedValueOnce({ body: mockSpotifyTrack });
        const resp = await request(app).get('/player/currently-playing');
        expect(spotifyApi.getMyCurrentPlayingTrack).toHaveBeenCalledTimes(1);
        expect(resp.body).toStrictEqual(mockSpotifyTrack);
    });

    it ('catches WebApiError', async () => {

        spotifyApi.getMyCurrentPlayingTrack.mockRejectedValue( new MockWebApiError('', '', 403, mockWebApiErrorMessage));
        const resp = await request(app).get('/player/currently-playing');
        expect(spotifyApi.getMyCurrentPlayingTrack).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(403);
        expect(resp.body).toStrictEqual({ message: mockWebApiErrorMessage});
    });
});

describe('PUT /pause', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it ('player pauses', async () => {
        spotifyApi.pause.mockResolvedValueOnce(null);
        const resp = await request(app).put('/player/pause');
        expect(spotifyApi.pause).toHaveBeenCalledTimes(1);
        expect(resp.body).toStrictEqual(null);
    });

    it ('catches WebApiError', async () => {

        spotifyApi.pause.mockRejectedValue( new MockWebApiError('', '', 403, mockWebApiErrorMessage));
        const resp = await request(app).put('/player/pause');
        expect(spotifyApi.pause).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(403);
        expect(resp.body).toStrictEqual({ message: mockWebApiErrorMessage});
    });
});

describe('PUT /play', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it ('player plays', async () => {
        spotifyApi.play.mockResolvedValueOnce(null);
        const resp = await request(app).put('/player/play');
        expect(spotifyApi.play).toHaveBeenCalledTimes(1);
        expect(resp.body).toStrictEqual(null);
    });

    it ('catches WebApiError', async () => {

        spotifyApi.play.mockRejectedValue( new MockWebApiError('', '', 403, mockWebApiErrorMessage));
        const resp = await request(app).put('/player/play');
        expect(spotifyApi.play).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(403);
        expect(resp.body).toStrictEqual({ message: mockWebApiErrorMessage});
    });
});


describe('POST /next', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it ('player skips to next', async () => {
        spotifyApi.skipToNext.mockResolvedValueOnce(null);
        const resp = await request(app).post('/player/next');
        expect(spotifyApi.skipToNext).toHaveBeenCalledTimes(1);
        expect(resp.body).toStrictEqual(null);
    });

    it ('catches WebApiError', async () => {

        spotifyApi.skipToNext.mockRejectedValue( new MockWebApiError('', '', 403, mockWebApiErrorMessage));
        const resp = await request(app).post('/player/next');
        expect(spotifyApi.skipToNext).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(403);
        expect(resp.body).toStrictEqual({ message: mockWebApiErrorMessage});
    });
});


describe('POST /previous', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it ('player skips to previous', async () => {
        spotifyApi.skipToPrevious.mockResolvedValueOnce(null);
        const resp = await request(app).post('/player/previous');
        expect(spotifyApi.skipToPrevious).toHaveBeenCalledTimes(1);
        expect(resp.body).toStrictEqual(null);
    });

    it ('catches WebApiError', async () => {

        spotifyApi.skipToPrevious.mockRejectedValue( new MockWebApiError('', '', 403, mockWebApiErrorMessage));
        const resp = await request(app).post('/player/previous');
        expect(spotifyApi.skipToPrevious).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(403);
        expect(resp.body).toStrictEqual({ message: mockWebApiErrorMessage});
    });
});

describe('GET /liked', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it ('checks if track in library', async () => {
        spotifyApi.containsMySavedTracks.mockResolvedValueOnce({ body: [true] });
        const resp = await request(app).get('/player/liked?ids=[1]');
        expect(spotifyApi.containsMySavedTracks).toHaveBeenCalledTimes(1);
        expect(resp.body).toStrictEqual([true]);
    });

    it ('catches WebApiError', async () => {

        spotifyApi.containsMySavedTracks.mockRejectedValue( new MockWebApiError('', '', 403, mockWebApiErrorMessage));
        const resp = await request(app).get('/player/liked?ids=[1]');
        expect(spotifyApi.containsMySavedTracks).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(403);
        expect(resp.body).toStrictEqual({ message: mockWebApiErrorMessage});
    });
});

describe('PUT /like', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it ('add track to user library', async () => {
        spotifyApi.addToMySavedTracks.mockResolvedValueOnce(null);
        const resp = await request(app).put('/player/like?ids=[1]');
        expect(spotifyApi.addToMySavedTracks).toHaveBeenCalledTimes(1);
        expect(resp.body).toStrictEqual(null);
    });

    it ('catches WebApiError', async () => {

        spotifyApi.addToMySavedTracks.mockRejectedValue( new MockWebApiError('', '', 403, mockWebApiErrorMessage));
        const resp = await request(app).put('/player/like?ids=[1]');
        expect(spotifyApi.addToMySavedTracks).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(403);
        expect(resp.body).toStrictEqual({ message: mockWebApiErrorMessage});
    });
});

describe('DELETE /unlike', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it ('remove track from user library', async () => {
        spotifyApi.removeFromMySavedTracks.mockResolvedValueOnce(null);
        const resp = await request(app).delete('/player/unlike?ids=[1]');
        expect(spotifyApi.removeFromMySavedTracks).toHaveBeenCalledTimes(1);
        expect(resp.body).toStrictEqual(null);
    });

    it ('catches WebApiError', async () => {

        spotifyApi.removeFromMySavedTracks.mockRejectedValue( new MockWebApiError('', '', 403, mockWebApiErrorMessage));
        const resp = await request(app).delete('/player/unlike?ids=[1]');
        expect(spotifyApi.removeFromMySavedTracks).toHaveBeenCalledTimes(1);
        expect(resp.statusCode).toBe(403);
        expect(resp.body).toStrictEqual({ message: mockWebApiErrorMessage});
    });
});
