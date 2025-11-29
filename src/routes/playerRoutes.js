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

router.get('/artist/:id', (req, res) => {
    const { id } = req.params;
    spotifyApi.getArtist(id)
        .then(data => {
            res.json(data.body);
        })
        .catch(err => {
            console.error('Error getting artist:', err);
            res.status(err.statusCode || 500).json({message: err.message});
        });
});

router.get('/album/:id', (req, res) => {
    const { id } = req.params;
    spotifyApi.getAlbum(id)
        .then(data => {
            res.json(data.body);
        })
        .catch(err => {
            console.error('Error getting album:', err);
            res.status(err.statusCode || 500).json({message: err.message});
        });
});

router.get('/lastfm/artist', async (req, res) => {
    const { artist } = req.query;
    const apiKey = process.env.LASTFM_API_KEY;
    
    if (!artist) {
        return res.status(400).json({ message: 'Artist name is required' });
    }
    
    if (!apiKey) {
        return res.status(500).json({ message: 'Last.fm API key not configured' });
    }
    
    try {
        const url = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artist)}&api_key=${apiKey}&format=json`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
            return res.status(404).json({ message: data.message || 'Artist not found' });
        }
        
        res.json(data.artist);
    } catch (err) {
        console.error('Error fetching Last.fm artist info:', err);
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
