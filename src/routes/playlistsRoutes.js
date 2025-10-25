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
 * Fetch all playlists for authenticated user, paginating under the hood.
 * Respects 429 Retry-After headers and performs exponential backoff on transient errors.
 * Returns consolidated JSON: { total, limit, items }
 */
router.get('/spotify/all', async (req, res) => {
    // optional per-page size, capped to Spotify's max (50)
    const perPage = Math.min(50, parseInt(req.query.per_page, 10) || 50);

    if (!req.user || !req.user.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const allItems = [];
    let offset = 0;
    const maxRetries = 5;

    try {
        // Page sequentially to avoid hitting rate limits
        while (true) {
            let attempt = 0;
            while (true) {
                try {
                    const data = await spotifyApi.getUserPlaylists({ limit: perPage, offset });
                    const body = data.body || {};
                    allItems.push(...(body.items || []));

                    // If there's another page, advance and continue looping
                    if (body.next) {
                        offset += perPage;
                        break; // break retry loop, proceed to next page
                    }

                    // No next page – return consolidated result
                    return res.json({
                        total: body.total || allItems.length,
                        limit: perPage,
                        items: allItems
                    });
                } catch (err) {
                    attempt++;

                    // Spotify rate limit – respect Retry-After if provided
                    if (err && err.statusCode === 429) {
                        const ra = err.headers && (err.headers['retry-after'] || err.headers['Retry-After']);
                        const waitMs = ra ? parseInt(ra, 10) * 1000 : Math.min(1000 * Math.pow(2, attempt), 10000);
                        console.warn(`Spotify rate limit hit, waiting ${waitMs}ms before retrying (attempt ${attempt})`);
                        await sleep(waitMs + Math.floor(Math.random() * 200));
                        continue;
                    }

                    // Transient errors – retry a limited number of times with exponential backoff
                    if (attempt < maxRetries) {
                        const backoff = Math.min(300 * Math.pow(2, attempt), 5000);
                        console.warn(`Transient error fetching playlists (attempt ${attempt}), retrying in ${backoff}ms`, err && err.message);
                        await sleep(backoff + Math.floor(Math.random() * 200));
                        continue;
                    }

                    // Exhausted retries – return error
                    console.error('Error fetching playlists page after retries:', err);
                    return res.status(err && err.statusCode ? err.statusCode : 500).json({ message: err && err.message ? err.message : 'Error fetching playlists' });
                }
            }
        }
    } catch (outerErr) {
        console.error('Unexpected error consolidating playlists:', outerErr);
        res.status(500).json({ message: outerErr.message || 'Unexpected error' });
    }
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
 * Toggle a managed playlist's active status
 */
router.put('/:id/toggle-active', async (req, res) => {
    const { id } = req.params;
    try {
        // First find the playlist and ensure it belongs to the user
        const playlist = await Playlist.findOne({
            where: {
                id: id,
                user_id: req.user.user.id
            }
        });

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found or access denied' });
        }

        // Toggle the active status
        const newActiveStatus = playlist.active === 'Y' ? 'N' : 'Y';
        
        // Update the playlist
        await Playlist.update(
            { active: newActiveStatus }, 
            {
                where: {
                    id: id,
                    user_id: req.user.user.id
                }
            }
        );

        // Update the playlist object to return the new status
        playlist.active = newActiveStatus;
        res.json(playlist);
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
router.put('/invert-active-all', async (req, res) => {
    try {
        const playlists = await Playlist.findAll({
            where: {
                user_id: req.user.user.id
            }
        });

        // Use Promise.all to wait for all updates to complete
        const updatePromises = playlists.map(playlist => {
            const active = playlist.active === 'Y' ? 'N' : 'Y';
            return Playlist.update({ active }, {
                where: {
                    id: playlist.id,
                    user_id: req.user.user.id
                }
            });
        });

        await Promise.all(updatePromises);
        res.json(true);
    } catch (err) {
        console.error('Error invert-active-all user/s playlist:', err);
        res.status(500).json({ message: err.message });
    }
});

/**
 * Reorder playlists based on order of ids passed in
 */
router.put('/reorder', async (req, res) => {
    const { ids } = req.body;
    try {
        // Use Promise.all to wait for all updates to complete
        const updatePromises = ids.map(async (id, index) => {
            const playlist = await Playlist.findByPk(id);
            if (playlist) {
                playlist.sort_order = index;
                return await playlist.save();
            }
        });
        
        await Promise.all(updatePromises);
        res.json(true);
    } catch (err) {
        console.error('Error reordering user/s playlist:', err);
        res.status(500).json({ message: err.message });
    }
});

/**
 * Add a track to active managed playlists
 */
router.put('/add-track-to-active', async (req, res) => {
    const { uri } = req.body;
    try {
        const playlists = await Playlist.findAll({
            where: {
                active: 'Y',
                user_id: req.user.user.id
            }
        });

        // Use Promise.all to wait for all Spotify API operations to complete
        const updatePromises = playlists.map(async (playlist) => {
            try {
                // Remove track first, then add it (to move it to the end)
                await spotifyApi.removeTracksFromPlaylist(
                    playlist.spotify_playlist_id,
                    [{ uri }]
                );
                await spotifyApi.addTracksToPlaylist(
                    playlist.spotify_playlist_id,
                    [uri]
                );
                return playlist.spotify_playlist_id;
            } catch (spotifyError) {
                console.error(`Error updating playlist ${playlist.spotify_playlist_id}:`, spotifyError);
                // Return null for failed operations, filter them out later
                return null;
            }
        });

        const results = await Promise.all(updatePromises);
        // Filter out failed operations (null values)
        const updated = results.filter(id => id !== null);
        
        res.json(updated);
    } catch (err) {
        console.error('Error add-track-to-active user/s playlist:', err);
        res.status(500).json({ message: err.message });
    }
});

/**
 * Remove a track from active managed playlists
 */
router.put('/remove-track-from-active', async (req, res) => {
    const { uri } = req.body;
    try {
        const playlists = await Playlist.findAll({
            where: {
                active: 'Y',
                user_id: req.user.user.id
            }
        });

        // Use Promise.all to wait for all Spotify API operations to complete
        const updatePromises = playlists.map(async (playlist) => {
            try {
                await spotifyApi.removeTracksFromPlaylist(
                    playlist.spotify_playlist_id,
                    [{ uri }]
                );
                return playlist.spotify_playlist_id;
            } catch (spotifyError) {
                console.error(`Error removing track from playlist ${playlist.spotify_playlist_id}:`, spotifyError);
                // Return null for failed operations, filter them out later
                return null;
            }
        });

        const results = await Promise.all(updatePromises);
        // Filter out failed operations (null values)
        const updated = results.filter(id => id !== null);
        
        res.json(updated);
    } catch (err) {
        console.error('Error remove-track-from-active user/s playlist:', err);
        res.status(500).json({ message: err.message });
    }
});

/**
 * Toggle a managed playlist as favorite
 */
router.put('/favorite', async (req, res) => {
    const { id } = req.body;
    try {
        const favorite = await Favorite.findOne({
            where: {
                user_id: req.user.user.id,
                spotify_playlist_id: id
            }
        });

        if (!favorite) {
            // Create new favorite
            const newFavorite = await Favorite.create({
                user_id: req.user.user.id,
                spotify_playlist_id: id
            });
            res.json(newFavorite);
        } else {
            // Remove existing favorite
            const result = await Favorite.destroy({
                where: {
                    user_id: req.user.user.id,
                    spotify_playlist_id: id
                }
            });
            res.json(result);
        }
    } catch (err) {
        console.error('Error toggling playlist favorite status:', err);
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
