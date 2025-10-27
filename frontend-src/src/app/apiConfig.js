// Determine environment in a test-friendly way. Prefer process.env (used in Jest),
// fall back to a window-injected value if available. Avoid using `import.meta` so
// this file parses cleanly under Jest (which doesn't support import.meta in CJS).
const detectedEnv = (typeof process !== 'undefined' && process.env && process.env.VITE_ENVIRONMENT)
    || (typeof process !== 'undefined' && process.env && process.env.NODE_ENV)
    || (typeof window !== 'undefined' && window.__VITE_ENV__)
    || 'production';

export const apiBaseUrl = detectedEnv === 'development' ? 'http://playlister:8001' : '';

// During local development (non-test) we may want to stub a logged-in spotifyUser
// for dev pages. Only set this when window exists and the environment looks like development.
if (typeof window !== 'undefined' && detectedEnv === 'development') {
    // logged in:
    window.spotifyUser = {
        id: '1267654234',
        display_name: 'David Coldplay',
        images: [
            { url: 'https://i.scdn.co/image/ab67757000003b82bfe4a87bb89364982a8ea74d' }
        ]
    };
    // not logged in:
    // window.spotifyUser = {};
}

export const apiRequest = async (path, options) => {
    try {
        const response = await fetch(apiBaseUrl + path, options);
        if (!response.ok && path !== '/me') {
            if (typeof window !== 'undefined') {
                window.location.assign(apiBaseUrl + '/logout?error=apiRequestFailed');
            }
        }
        return response;
    } catch (err) {
        if (typeof window !== 'undefined') {
            window.location.assign(apiBaseUrl + '/logout?error=sessionTimeout');
        }
    }
};
