const Redis = require('ioredis');

// Redis connection config from environment or defaults
const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    // Retry strategy for connection failures
    retryStrategy: (times) => {
        if (times > 3) {
            console.warn('Redis connection failed after 3 retries, giving up');
            return null; // stop retrying
        }
        return Math.min(times * 200, 2000);
    },
    // Don't block app startup if Redis is unavailable
    lazyConnect: true,
    maxRetriesPerRequest: 3
};

let redis = null;
let connected = false;

/**
 * Get or create Redis client instance
 * Returns null if Redis is not available
 */
function getRedisClient() {
    if (redis === null) {
        try {
            redis = new Redis(redisConfig);
            
            redis.on('connect', () => {
                connected = true;
                console.log('Redis connected');
            });
            
            redis.on('error', (err) => {
                connected = false;
                console.warn('Redis error:', err.message);
            });
            
            redis.on('close', () => {
                connected = false;
                console.log('Redis connection closed');
            });
        } catch (err) {
            console.warn('Failed to create Redis client:', err.message);
            return null;
        }
    }
    return redis;
}

/**
 * Check if Redis is connected
 */
function isRedisConnected() {
    return connected && redis && redis.status === 'ready';
}

/**
 * Cache key prefixes for different entity types
 */
const CACHE_KEYS = {
    ARTIST: 'spotify:artist:',
    ALBUM: 'spotify:album:',
    PLAYLIST_METRICS: 'playlist:metrics:'
};

/**
 * Default TTL values (in seconds)
 */
const CACHE_TTL = {
    ARTIST: 60 * 60 * 24 * 7, // 7 days - artist info doesn't change often
    ALBUM: 60 * 60 * 24 * 7,  // 7 days - album info doesn't change often
    PLAYLIST_METRICS: 60 * 60 * 24 // 1 day - playlist composition can change
};

/**
 * Get cached value by key
 * @param {string} key - Cache key
 * @returns {Promise<object|null>} - Parsed JSON value or null
 */
async function getCached(key) {
    const client = getRedisClient();
    if (!client || !isRedisConnected()) {
        return null;
    }
    
    try {
        const value = await client.get(key);
        return value ? JSON.parse(value) : null;
    } catch (err) {
        console.warn('Redis get error:', err.message);
        return null;
    }
}

/**
 * Set cached value with TTL
 * @param {string} key - Cache key
 * @param {object} value - Value to cache (will be JSON stringified)
 * @param {number} ttl - TTL in seconds
 * @returns {Promise<boolean>} - Success status
 */
async function setCached(key, value, ttl) {
    const client = getRedisClient();
    if (!client || !isRedisConnected()) {
        return false;
    }
    
    try {
        await client.setex(key, ttl, JSON.stringify(value));
        return true;
    } catch (err) {
        console.warn('Redis set error:', err.message);
        return false;
    }
}

/**
 * Delete cached value
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} - Success status
 */
async function deleteCached(key) {
    const client = getRedisClient();
    if (!client || !isRedisConnected()) {
        return false;
    }
    
    try {
        await client.del(key);
        return true;
    } catch (err) {
        console.warn('Redis delete error:', err.message);
        return false;
    }
}

/**
 * Get multiple cached values by keys
 * @param {string[]} keys - Array of cache keys
 * @returns {Promise<Map<string, object>>} - Map of key to parsed value
 */
async function getMultipleCached(keys) {
    const result = new Map();
    const client = getRedisClient();
    
    if (!client || !isRedisConnected() || keys.length === 0) {
        return result;
    }
    
    try {
        const values = await client.mget(keys);
        keys.forEach((key, index) => {
            if (values[index]) {
                try {
                    result.set(key, JSON.parse(values[index]));
                } catch (e) {
                    // skip invalid JSON
                }
            }
        });
    } catch (err) {
        console.warn('Redis mget error:', err.message);
    }
    
    return result;
}

module.exports = {
    getRedisClient,
    isRedisConnected,
    getCached,
    setCached,
    deleteCached,
    getMultipleCached,
    CACHE_KEYS,
    CACHE_TTL
};
