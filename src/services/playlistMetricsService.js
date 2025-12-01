const spotifyApi = require('../modules/spotifyApi');
const { 
    getCached, 
    setCached, 
    getMultipleCached, 
    CACHE_KEYS, 
    CACHE_TTL 
} = require('../modules/redisClient');

/**
 * Fetch artist info with caching
 * @param {string} artistId - Spotify artist ID
 * @returns {Promise<object|null>} - Artist info or null
 */
async function getArtistWithCache(artistId) {
    const cacheKey = CACHE_KEYS.ARTIST + artistId;
    
    // Try cache first
    const cached = await getCached(cacheKey);
    if (cached) {
        return cached;
    }
    
    // Fetch from Spotify API
    try {
        const response = await spotifyApi.getArtist(artistId);
        const artist = response.body;
        
        // Cache the result
        await setCached(cacheKey, artist, CACHE_TTL.ARTIST);
        
        return artist;
    } catch (err) {
        console.error(`Error fetching artist ${artistId}:`, err.message);
        return null;
    }
}

/**
 * Fetch multiple artists with caching (batched)
 * @param {string[]} artistIds - Array of Spotify artist IDs
 * @returns {Promise<Map<string, object>>} - Map of artistId to artist info
 */
async function getArtistsWithCache(artistIds) {
    const uniqueIds = [...new Set(artistIds)];
    const result = new Map();
    
    if (uniqueIds.length === 0) {
        return result;
    }
    
    // Check cache for all artists
    const cacheKeys = uniqueIds.map(id => CACHE_KEYS.ARTIST + id);
    const cached = await getMultipleCached(cacheKeys);
    
    // Separate cached and uncached IDs
    const uncachedIds = [];
    uniqueIds.forEach((id, index) => {
        const cacheKey = cacheKeys[index];
        if (cached.has(cacheKey)) {
            result.set(id, cached.get(cacheKey));
        } else {
            uncachedIds.push(id);
        }
    });
    
    // Fetch uncached artists in batches of 50 (Spotify API limit)
    const batchSize = 50;
    for (let i = 0; i < uncachedIds.length; i += batchSize) {
        const batch = uncachedIds.slice(i, i + batchSize);
        
        try {
            const response = await spotifyApi.getArtists(batch);
            const artists = response.body.artists || [];
            
            for (const artist of artists) {
                if (artist) {
                    result.set(artist.id, artist);
                    // Cache each artist
                    await setCached(CACHE_KEYS.ARTIST + artist.id, artist, CACHE_TTL.ARTIST);
                }
            }
        } catch (err) {
            console.error('Error fetching artists batch:', err.message);
            // Continue with other batches
        }
        
        // Small delay between batches to avoid rate limiting
        if (i + batchSize < uncachedIds.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    return result;
}

/**
 * Fetch album info with caching
 * @param {string} albumId - Spotify album ID
 * @returns {Promise<object|null>} - Album info or null
 */
async function getAlbumWithCache(albumId) {
    const cacheKey = CACHE_KEYS.ALBUM + albumId;
    
    // Try cache first
    const cached = await getCached(cacheKey);
    if (cached) {
        return cached;
    }
    
    // Fetch from Spotify API
    try {
        const response = await spotifyApi.getAlbum(albumId);
        const album = response.body;
        
        // Cache the result
        await setCached(cacheKey, album, CACHE_TTL.ALBUM);
        
        return album;
    } catch (err) {
        console.error(`Error fetching album ${albumId}:`, err.message);
        return null;
    }
}

/**
 * Fetch multiple albums with caching (batched)
 * @param {string[]} albumIds - Array of Spotify album IDs
 * @returns {Promise<Map<string, object>>} - Map of albumId to album info
 */
async function getAlbumsWithCache(albumIds) {
    const uniqueIds = [...new Set(albumIds)];
    const result = new Map();
    
    if (uniqueIds.length === 0) {
        return result;
    }
    
    // Check cache for all albums
    const cacheKeys = uniqueIds.map(id => CACHE_KEYS.ALBUM + id);
    const cached = await getMultipleCached(cacheKeys);
    
    // Separate cached and uncached IDs
    const uncachedIds = [];
    uniqueIds.forEach((id, index) => {
        const cacheKey = cacheKeys[index];
        if (cached.has(cacheKey)) {
            result.set(id, cached.get(cacheKey));
        } else {
            uncachedIds.push(id);
        }
    });
    
    // Fetch uncached albums in batches of 20 (Spotify API limit)
    const batchSize = 20;
    for (let i = 0; i < uncachedIds.length; i += batchSize) {
        const batch = uncachedIds.slice(i, i + batchSize);
        
        try {
            const response = await spotifyApi.getAlbums(batch);
            const albums = response.body.albums || [];
            
            for (const album of albums) {
                if (album) {
                    result.set(album.id, album);
                    // Cache each album
                    await setCached(CACHE_KEYS.ALBUM + album.id, album, CACHE_TTL.ALBUM);
                }
            }
        } catch (err) {
            console.error('Error fetching albums batch:', err.message);
            // Continue with other batches
        }
        
        // Small delay between batches to avoid rate limiting
        if (i + batchSize < uncachedIds.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    return result;
}

/**
 * Fetch all tracks from a playlist (handles pagination)
 * @param {string} playlistId - Spotify playlist ID
 * @returns {Promise<object[]>} - Array of track objects
 */
async function getAllPlaylistTracks(playlistId) {
    const allTracks = [];
    let offset = 0;
    const limit = 100; // Spotify max
    
    while (true) {
        try {
            const response = await spotifyApi.getPlaylistTracks(playlistId, {
                offset,
                limit,
                fields: 'items(track(id,name,artists(id,name),album(id,name))),next,total'
            });
            
            const items = response.body.items || [];
            allTracks.push(...items.filter(item => item.track)); // Filter out null tracks
            
            if (!response.body.next) {
                break;
            }
            
            offset += limit;
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 50));
        } catch (err) {
            console.error('Error fetching playlist tracks:', err.message);
            throw err;
        }
    }
    
    return allTracks;
}

/**
 * Calculate playlist metrics (top artists and genres)
 * @param {string} playlistId - Spotify playlist ID
 * @returns {Promise<object>} - Metrics object with top_artists and top_genres
 */
async function calculatePlaylistMetrics(playlistId) {
    // Fetch all tracks from the playlist
    const trackItems = await getAllPlaylistTracks(playlistId);
    const totalTracks = trackItems.length;
    
    if (totalTracks === 0) {
        return {
            top_artists: [],
            top_genres: [],
            total_tracks: 0
        };
    }
    
    // Collect all unique artist and album IDs
    const artistIds = new Set();
    const albumIds = new Set();
    const artistTrackCount = new Map(); // artistId -> count
    
    for (const item of trackItems) {
        const track = item.track;
        if (!track) continue;
        
        // Count tracks per artist
        for (const artist of (track.artists || [])) {
            if (artist.id) {
                artistIds.add(artist.id);
                artistTrackCount.set(
                    artist.id, 
                    (artistTrackCount.get(artist.id) || 0) + 1
                );
            }
        }
        
        // Collect album IDs
        if (track.album && track.album.id) {
            albumIds.add(track.album.id);
        }
    }
    
    // Fetch artist and album details (with caching)
    const [artistsMap, albumsMap] = await Promise.all([
        getArtistsWithCache([...artistIds]),
        getAlbumsWithCache([...albumIds])
    ]);
    
    // Calculate genre counts from artists
    const genreCount = new Map();
    
    for (const [artistId, artist] of artistsMap) {
        if (artist && artist.genres) {
            const trackCount = artistTrackCount.get(artistId) || 0;
            for (const genre of artist.genres) {
                genreCount.set(
                    genre,
                    (genreCount.get(genre) || 0) + trackCount
                );
            }
        }
    }
    
    // Also collect genres from albums (some albums have genre tags)
    // Note: Spotify album genres are often empty, but we include them if present
    for (const [_albumId, album] of albumsMap) {
        if (album && album.genres) {
            for (const genre of album.genres) {
                // For albums, we'd need to count tracks per album - for simplicity, 
                // we'll skip album genres as they're usually empty anyway
            }
        }
    }
    
    // Build top artists list
    const topArtists = [...artistTrackCount.entries()]
        .map(([artistId, count]) => {
            const artist = artistsMap.get(artistId);
            return {
                id: artistId,
                name: artist ? artist.name : 'Unknown Artist',
                count,
                percent: parseFloat(((count / totalTracks) * 100).toFixed(1))
            };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 25);
    
    // Build top genres list
    // Total genre occurrences for percentage calculation
    const totalGenreOccurrences = [...genreCount.values()].reduce((a, b) => a + b, 0);
    
    const topGenres = [...genreCount.entries()]
        .map(([genre, count]) => ({
            name: genre,
            count,
            percent: totalGenreOccurrences > 0 
                ? parseFloat(((count / totalGenreOccurrences) * 100).toFixed(1))
                : 0
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 25);
    
    return {
        top_artists: topArtists,
        top_genres: topGenres,
        total_tracks: totalTracks,
        unique_artists: artistIds.size,
        unique_albums: albumIds.size
    };
}

module.exports = {
    getArtistWithCache,
    getArtistsWithCache,
    getAlbumWithCache,
    getAlbumsWithCache,
    getAllPlaylistTracks,
    calculatePlaylistMetrics
};
