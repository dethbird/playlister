const spotifyApi = require('../modules/spotifyApi');
const { User } = require("../models/models");

const refreshSpotifyToken = async (userId) => {
    try {
        const user = await User.findByPk(userId);
        if (!user || !user.spotify_refresh_token) {
            throw new Error('No refresh token found for user');
        }

        // Check if token is expired or will expire in next 5 minutes
        const now = new Date();
        const expiryBuffer = new Date(now.getTime() + (5 * 60 * 1000)); // 5 minutes buffer
        
        if (!user.spotify_token_expires_at || user.spotify_token_expires_at <= expiryBuffer) {
            console.log('Refreshing Spotify token for user:', userId);
            
            spotifyApi.setRefreshToken(user.spotify_refresh_token);
            const data = await spotifyApi.refreshAccessToken();
            
            const newAccessToken = data.body.access_token;
            const expiresIn = data.body.expires_in;
            const newRefreshToken = data.body.refresh_token || user.spotify_refresh_token;
            const newExpiresAt = new Date(Date.now() + (expiresIn * 1000));
            
            // Update user with new tokens
            await user.update({
                spotify_refresh_token: newRefreshToken,
                spotify_token_expires_at: newExpiresAt
            });
            
            spotifyApi.setAccessToken(newAccessToken);
            spotifyApi.setRefreshToken(newRefreshToken);
            
            console.log('Token refreshed successfully, expires at:', newExpiresAt);
            return { accessToken: newAccessToken, refreshToken: newRefreshToken, expiresAt: newExpiresAt };
        }
        
        return null; // Token is still valid
    } catch (err) {
        console.error('Error refreshing token:', err);
        throw err;
    }
};

const authenticateSpotifyUser = async (accessToken, refreshToken, expires_in, profile, done) => {
    try {
        // Calculate expiry timestamp (expires_in is in seconds)
        const expiresAt = new Date(Date.now() + (expires_in * 1000));
        
        const [user, userCreated] = await User.findOrCreate({
            where: { spotify_user_id: profile.id },
            defaults: {
                spotify_refresh_token: refreshToken,
                spotify_token_expires_at: expiresAt
            }
        });
        
        // Update refresh token and expiry for existing users
        if (!userCreated) {
            await user.update({
                spotify_refresh_token: refreshToken,
                spotify_token_expires_at: expiresAt
            });
        }
        
        console.log('Token expires at:', expiresAt);
        console.log('Refresh token saved for user:', profile.id);
        
        spotifyApi.setAccessToken(accessToken);
        spotifyApi.setRefreshToken(refreshToken);
        
        try {
            const data = await spotifyApi.getMe();
            return done(null, { 
                user: user, 
                accessToken, 
                refreshToken,
                expiresAt,
                spotifyUser: data.body 
            });
        } catch (err) {
            console.error('Error getting user profile:', err);
            return done(err);
        }
        
    } catch (err) {
        console.error('Error finding or creating user:', err);
        return done(err);
    }
}

module.exports = { authenticateSpotifyUser, refreshSpotifyToken };
