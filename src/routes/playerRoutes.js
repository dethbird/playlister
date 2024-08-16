const express = require('express');
const router = express.Router();
const spotifyApi = require('../modules/spotifyApi');


router.get('/currently-playing', (req, res) => {
    spotifyApi.getMyCurrentPlayingTrack()
        .then(data => {
            res.json(data.body);
        })
        .catch(err => {
            console.error('Error getting currently playing track:', err);
            res.status(err.statusCode).json({message: err.message});
        });

});

router.put('/pause', (req, res) => {
    spotifyApi.pause()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.error('Error pausing track:', err);
            res.status(err.statusCode).json({message: err.message});
        });
});

router.put('/play', (req, res) => {
    spotifyApi.play()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.error('Error resuming track:', err);
            res.status(err.statusCode).json({message: err.message});
        });
});


router.post('/next', (req, res) => {
    spotifyApi.skipToNext()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.error('Error skipping to next track:', err);
            res.status(err.statusCode).json({message: err.message});
        });
});


router.post('/previous', (req, res) => {
    spotifyApi.skipToPrevious()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.error('Error skipping to previous track:', err);
            res.status(err.statusCode).json({message: err.message});
        });
});

router.get('/liked', (req, res) => {
    const { ids } = req.query;
    spotifyApi.containsMySavedTracks(ids.split(','))
        .then(data => {
            res.json(data.body);
        })
        .catch(err => {
            console.error('Error checking if track is liked:', err);
            res.status(err.statusCode).json({message: err.message});
        });
});

router.put('/like', (req, res) => {
    const { ids } = req.query;
    spotifyApi.addToMySavedTracks(ids.split(','))
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.error('Error adding tracks to liked:', err);
            res.status(err.statusCode).json({message: err.message});
        });
});

router.delete('/unlike', (req, res) => {
    const { ids } = req.query;
    spotifyApi.removeFromMySavedTracks(ids.split(','))
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.error('Error removing tracks from liked:', err);
            res.status(err.statusCode).json({message: err.message});
        });
});


module.exports = router;
