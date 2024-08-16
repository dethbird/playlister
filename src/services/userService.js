const spotifyApi = require('../modules/spotifyApi');
const { User } = require("../models/models");

const authenticateSpotifyUser = (accessToken, refreshToken, expires_in, profile, done) => {
    User.findOrCreate({
        where: { spotify_user_id: profile.id }
    }).then((user, userCreated) => {
        spotifyApi.setAccessToken(accessToken);
        spotifyApi.getMe()
            .then(data => {
                return done(null, { user: user[0], accessToken, spotifyUser: data.body });
            })
            .catch(err => {
                console.error('Error getting user profile:', err);
            });

    }).catch(err => {
        console.error('Error finding or creating user', err);
    });
}

module.exports = { authenticateSpotifyUser };
