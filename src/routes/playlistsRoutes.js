const express = require('express');
const router = express.Router();
const spotifyApi = require('../modules/spotifyApi');
const { QueryTypes } = require('sequelize');
const { sequelize, Playlist, Favorite } = require('../models/models');


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
            res.status(err.statusCode).json({ message: err.message });
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
            console.error('Error getting spotify playlist meta:', err);
            res.status(err.statusCode).json({ message: err.message });
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
        })
            .catch(err => {
                console.error('Error adding track to playlist:', err);
                res.status(err.statusCode).json({ message: err.message });
            });;
    })
        .catch(err => {
            console.error('Error removing track from playlist:', err);
            res.status(err.statusCode).json({ message: err.message });
        });

});

/**
 * Remove a track from a playlist
 */
router.delete('/spotify/:id/remove-track', (req, res) => {
    const { id } = req.params;
    const { uri } = req.body;
    spotifyApi.removeTracksFromPlaylist(
        id,
        [{ uri }]
    ).then((data) => {
        res.json(data);
    }).catch(err => {
        console.error('Error removing track from playlist:', err);
        res.status(err.statusCode).json({ message: err.message });
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
    }).then(playlist => {
        res.status(201).json(playlist);
    }).
        catch(err => {
            console.error('Error adding playlist to manage:', err);
            res.status(500).json({ message: err.message });
        });

});

/**
 * Get a user's managed playlists joining on favorites
 */
router.get('/', (req, res) => {
    sequelize.query(`
        SELECT
            playlist.*,
            favorite.id as favorited
        FROM playlist
        LEFT JOIN favorite
            ON playlist.spotify_playlist_id = favorite.spotify_playlist_id
            AND playlist.user_id = favorite.user_id
        WHERE playlist.user_id = ?
        ORDER BY playlist.sort_order ASC, playlist.id ASC`, {
        replacements: [req.user.user.id],
        type: QueryTypes.SELECT,
    }).then(data => {
        res.json(data);
    }).
        catch(err => {
            console.error('Error fetching user/s playlists:', err);
            res.status(500).json({ message: err.message });
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
    }).then(data => {
        res.status(204).json(data);
    }).catch(err => {
        console.error('Error deleting user/s playlists:', err);
        res.status(500).json({ message: err.message });
    });

});

/**
 * Remove a user's managed playlists
 */
router.put('/:id/toggle-active', (req, res) => {
    const { id } = req.params;
    try {
        Playlist.findByPk(id)
            .then(playlist => {
                playlist.active = playlist.active === 'Y' ? 'N' : 'Y';
                Playlist.update({ active: playlist.active }, {
                    where: {
                        id: id,
                        user_id: req.user.user.id
                    },
                }).then(() => {
                    res.json(playlist);
                }).catch(err => {
                    console.error('Error updating user/s playlist:', err);
                    res.status(500).json({ message: err.message });
                });;
            }).catch(err => {
                console.error('Error finding user/s playlist:', err);
                res.status(500).json({ message: err.message });
            });
    } catch (err) {
        console.error('Error toggle-active user/s playlist:', err);
        res.status(500).json({ message: err.message });
    }
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
    }).then((data) => {

        res.json(data);
    }).catch(err => {
        console.error('Error updating user/s playlist:', err);
        res.status(500).json({ message: err.message });
    });
});

/**
 * Invert all user's managed playlists to active Y || N
 */
router.put('/invert-active-all', (req, res) => {
    try {
        Playlist.findAll({
            where: {
                user_id: req.user.user.id
            }
        }).then(playlists => {
            playlists.forEach(playlist => {
                const active = playlist.active === 'Y' ? 'N' : 'Y';
                Playlist.update({ active }, {
                    where: {
                        id: playlist.id,
                        user_id: req.user.user.id
                    }
                }).catch(err => {
                    console.error('Error updating user/s playlist:', err);
                    res.status(500).json({ message: err.message });
                });
            });
        }).catch(err => {
            console.error('Error finding user/s playlist:', err);
            res.status(500).json({ message: err.message });
        }).finally(() => {
            res.json(true);
        });
    } catch (err) {
        console.error('Error invert-active-all user/s playlist:', err);
        res.status(500).json({ message: err.message });
    }

});

/**
 * Reorder playlists based on order of ids passed in
 */
router.put('/reorder', (req, res) => {
    const { ids } = req.body;
    try {
        ids.forEach(async (id, index) => {
            const playlist = await Playlist.findByPk(id);
            playlist.sort_order = index;
            await playlist.save();
        });
        res.json(true);
    } catch (err) {
        console.error('Error reordering user/s playlist:', err);
        res.status(500).json({ message: err.message });
    }
});

/**
 * Add a track to active managed playlists
 */
router.put('/add-track-to-active', (req, res) => {
    const { uri } = req.body;
    const updated = [];
    try {
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
    } catch (err) {
        console.error('Error add-track-to-active user/s playlist:', err);
        res.status(500).json({ message: err.message });
    }
});

/**
 * Remove a track from active managed playlists
 */
router.put('/remove-track-from-active', (req, res) => {
    const { uri } = req.body;
    const updated = [];
    try {
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
    } catch (err) {
        console.error('Error remove-track-from-active user/s playlist:', err);
        res.status(500).json({ message: err.message });
    }
});

/**
 * Toggle a managed playlist as favorite
 */
router.put('/favorite', (req, res) => {
    const { id } = req.body;
    try {
        Favorite.findOne({
            where: {
                user_id: req.user.user.id,
                spotify_playlist_id: id
            }
        }).then(favorite => {
            if (!favorite) {
                Favorite.create({
                    user_id: req.user.user.id,
                    spotify_playlist_id: id
                }).then(favorite => {
                    res.json(favorite);
                });
            } else {
                Favorite.destroy({
                    where: {
                        user_id: req.user.user.id,
                        spotify_playlist_id: id
                    }
                }).then(data => res.json(data));
            }
        });
    } catch (err) {
        console.error('Error remove-track-from-active user/s playlist:', err);
        res.status(500).json({ message: err.message });
    }
});

/**
 * Get a user's favorited playlists
 */
router.get('/favorite', (req, res) => {
    Favorite.findAll({
        where: {
            user_id: req.user.user.id
        }
    }).then(favorites => {
        res.json(favorites);
    });
});

module.exports = router;
