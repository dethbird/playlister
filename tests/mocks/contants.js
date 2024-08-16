
const mockUser = {
    theme: 'dark'
};
const mockSpotifyUser = {
    id: '1267654234',
    display_name: 'David Coldplay',
    images: [
        { url: 'https://i.scdn.co/image/ab67757000003b82bfe4a87bb89364982a8ea74d' }
    ]
}
const mockSessionUser = {
    user: mockUser,
    spotifyUser: mockSpotifyUser,
    accessToken: 'XXXX'
};

module.exports = { mockUser, mockSpotifyUser, mockSessionUser };
