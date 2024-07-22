const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_KEY,
    clientSecret: process.env.SPOTIFY_SECRET,
    redirectUri: `http://${process.env.HOSTNAME}:${process.env.PORT}/auth/spotify/callback`
});

module.exports = spotifyApi;
