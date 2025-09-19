const spotifyApi = require('../modules/spotifyApi');
const { User } = require("../models/models");

const authenticateSpotifyUser = async (accessToken, refreshToken, expires_in, profile, done) => {
    try {
        const [user, userCreated] = await User.findOrCreate({
            where: { spotify_user_id: profile.id }
        });
        
        spotifyApi.setAccessToken(accessToken);
        
        try {
            const data = await spotifyApi.getMe();
            return done(null, { user: user, accessToken, spotifyUser: data.body });
        } catch (err) {
            console.error('Error getting user profile:', err);
            return done(err);
        }
        
    } catch (err) {
        console.error('Error finding or creating user:', err);
        return done(err);
    }
}

module.exports = { authenticateSpotifyUser };
