const express = require('express');
const router = express.Router();
const spotifyApi = require('../modules/spotifyApi');


/**
 * Fetch a paginated list of authenticated user's playlists
 */
router.get('/spotify', (req, res) => {
    const { limit, offset } = req.query;
    spotifyApi.getUserPlaylists({limit, offset})
        .then(data => {
            res.json(data.body);
        })
        .catch(err => {
            console.error('Error getting page of user spotify playlists:', err);
        });

});


module.exports = router;
