const express = require('express');
const router = express.Router();
const spotifyApi = require('../modules/spotifyApi');

const { Playlist, Favorite } = require('../models/models');


/**
 * Fetch a paginated list of authenticated user's playlists
 */
router.get('/spotify', (req, res) => {
    const { limit, offset } = req.query;
    spotifyApi.getUserPlaylists({ limit, offset })
        .then(data => {
            res.json(data.body);
        })
        .catch(err => {
            console.error('Error getting page of user spotify playlists:', err);
        });

});

/**
 * Get playlist details
 */
router.get('/spotify/:id', (req, res) => {
    const { id } = req.params;
    const { fields } = req.query;
    spotifyApi.getPlaylist(id, { fields })
        .then(data => {
            res.json(data.body);
        })
        .catch(err => {
            console.error('Error getting spotify playlist images:', err);
        });

});

/**
 * Add a track to a playlist
 */
router.post('/spotify/:id/add-track', (req, res) => {
    const { id } = req.params;
    const { uri } = req.body;
    spotifyApi.removeTracksFromPlaylist(
        id,
        [{ uri }]
    ).then(() => {
        spotifyApi.addTracksToPlaylist(
            id,
            [uri]
        ).then((data) => {
            res.json(data);
        });
    });

});

/**
 * Remove a track to a playlist
 */
router.delete('/spotify/:id/remove-track', (req, res) => {
    const { id } = req.params;
    const { uri } = req.body;
    spotifyApi.removeTracksFromPlaylist(
        id,
        [{ uri }]
    ).then((data) => {
        res.json(data);
    });
});


/**
 * Add a Spotify playlist to user's managed playlists
 */
router.post('/', (req, res) => {
    const { id } = req.body;
    Playlist.findOrCreate({
        where: {
            user_id: req.user.user.id,
            spotify_playlist_id: id
        },
        defaults: {
            user_id: req.user.user.id,
            spotify_playlist_id: id
        }
    })
        .then(playlist => {
            res.status(201).json(playlist);
        });

});

/**
 * Get a user's managed playlists
 */
router.get('/', (req, res) => {
    Playlist.findAll({
        where: {
            user_id: req.user.user.id
        },
        order: [
            ['id', 'ASC']
        ]
    })
        .then(playlists => {
            res.json(playlists);
        });

});

/**
 * Remove a user's managed playlists
 */
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    Playlist.destroy({
        where: {
            id: id,
            user_id: req.user.user.id
        }
    })
        .then(data => {
            res.status(204).json(data);
        });

});

/**
 * Remove a user's managed playlists
 */
router.put('/:id/toggle-active', (req, res) => {
    const { id } = req.params;
    Playlist.findByPk(id)
        .then(playlist => {
            playlist.active = playlist.active === 'Y' ? 'N' : 'Y';
            Playlist.update({ active: playlist.active }, {
                where: {
                    id: id,
                    user_id: req.user.user.id
                },
            })
                .then(() => {
                    res.json(playlist);
                });
        });

});

/**
 * Set all user's managed playlists to active Y || N
 */
router.put('/set-active-all', (req, res) => {
    const { active } = req.body;

    Playlist.update({ active }, {
        where: {
            user_id: req.user.user.id
        },
    })
        .then((data) => {
            res.json(data);
        });
});

/**
 * Invert all user's managed playlists to active Y || N
 */
router.put('/invert-active-all', (req, res) => {
    Playlist.findAll({
        where: {
            user_id: req.user.user.id
        }
    })
        .then(playlists => {
            playlists.forEach(playlist => {
                const active = playlist.active === 'Y' ? 'N' : 'Y';
                Playlist.update({ active }, {
                    where: {
                        id: playlist.id,
                        user_id: req.user.user.id
                    }
                }).then(data => {
                    // noop
                })
            });
            res.json({});
        });
});

/**
 * Add a track to active managed playlistsa
 */
router.put('/add-track-to-active', (req, res) => {
    const { uri } = req.body;
    const updated = [];
    Playlist.findAll({
        where: {
            active: 'Y',
            user_id: req.user.user.id
        }
    })
        .then(playlists => {
            playlists.forEach(playlist => {
                spotifyApi.removeTracksFromPlaylist(
                    playlist.spotify_playlist_id,
                    [{ uri }]
                ).then(() => {
                    spotifyApi.addTracksToPlaylist(
                        playlist.spotify_playlist_id,
                        [uri]
                    ).then(() => {
                        updated.push(playlist.spotify_playlist_id);
                    });
                });
            });
        }).finally(() => {
            res.json(updated);
        });
});

/**
 * Remove a track from active managed playlistsa
 */
router.put('/remove-track-from-active', (req, res) => {
    const { uri } = req.body;
    const updated = [];
    Playlist.findAll({
        where: {
            active: 'Y',
            user_id: req.user.user.id
        }
    })
        .then(playlists => {
            playlists.forEach(playlist => {
                spotifyApi.removeTracksFromPlaylist(
                    playlist.spotify_playlist_id,
                    [{ uri }]
                ).then(() => {
                    updated.push(playlist.spotify_playlist_id);
                });
            });
        }).finally(() => {
            res.json(updated);
        });
});

module.exports = router;
