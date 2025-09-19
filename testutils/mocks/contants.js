const { resolve } = require("path");

const mockUser = {
    theme: 'dark',
    tos_signed: 'N',
    pp_signed: 'N'
};;

const mockSpotifyUser = {
    id: '1267654234',
    display_name: 'David Coldplay',
    images: [
        { url: 'https://i.scdn.co/image/ab67757000003b82bfe4a87bb89364982a8ea74d' }
    ]
};

const mockSessionUser = {
    user: mockUser,
    spotifyUser: mockSpotifyUser,
    accessToken: 'XXXX'
};

const mockSpotifyTrack = {
    id: 100
};

const mockManagedPlaylist = {
    id: 1000,
    spotify_playlist_id: 'XXXXX',
    active: 'Y',
    sort_order: 300
};

const mockWebApiErrorMessage = 'web api error';

class MockWebApiError extends Error {
    constructor(body, headers, statusCode, message) {
        super(message);
        this.body = body;
        this.headers = headers;
        this.statusCode = statusCode;
    }

};


module.exports = {
    mockUser,
    mockSpotifyUser,
    mockSessionUser,
    mockSpotifyTrack,
    mockManagedPlaylist,
    mockWebApiErrorMessage,
    MockWebApiError
};;
