const express = require('express');
const router = express.Router();
const spotifyApi = require('../modules/spotifyApi');


router.get('/currently-playing', (req, res) => {
    spotifyApi.getMyCurrentPlayingTrack()
        .then(data => {
            res.json(data.body);
        })
        .catch(err => {
            console.error('Error getting currently playing profile:', err);
        });

});

router.put('/pause', (req, res) => {
    spotifyApi.pause()
        .then(data => {
            res.json(data.body);
        })
        .catch(err => {
            console.error('Error pausing track:', err);
        });
});

router.put('/play', (req, res) => {
    spotifyApi.play()
        .then(data => {
            res.json(data.body);
        })
        .catch(err => {
            console.error('Error resuming track:', err);
        });
});


router.post('/next', (req, res) => {
    spotifyApi.skipToNext()
        .then(data => {
            res.json(data.body);
        })
        .catch(err => {
            console.error('Error skipping to next track:', err);
        });
});


router.post('/previous', (req, res) => {
    spotifyApi.skipToPrevious()
        .then(data => {
            res.json(data.body);
        })
        .catch(err => {
            console.error('Error skipping to previous track:', err);
        });
});


module.exports = router;
