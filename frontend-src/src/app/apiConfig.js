export const apiBaseUrl = process.env.REACT_APP_API_BASE_URL

export const apiRequest = (path, options) => {
    return fetch(apiBaseUrl + path, options);
}
