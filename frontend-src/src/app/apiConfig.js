export const apiBaseUrl = process.env.REACT_APP_ENVIRONMENT === 'development' ? 'http://localhost:3000' : '';

if (process.env.REACT_APP_ENVIRONMENT === 'development') {
    window.spotifyUser = {
        id: '1267654234',
        display_name: 'David Coldplay',
        images: [
            { url: 'https://i.scdn.co/image/ab67757000003b82bfe4a87bb89364982a8ea74d' }
        ]
    }
}

export const apiRequest = (path, options) => {
    return fetch(apiBaseUrl + path, options);
}
