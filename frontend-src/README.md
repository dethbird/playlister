# Playlister Frontend

The frontend is a React / Redux which makes requests to the Express backend in `/src` to make authenticated calls to the Spotify on behalf of the logged in user.

Redux breaks the application state into slices which correspond the way the backend routes are organized.

## Development

### Setup

#### Mock API

For strictly frontend UI development, use an app like [Mockoon](https://mockoon.com/) to mock the backend. You can start with an [initial setup JSON](https://gist.github.com/dethbird/fa9e5c4ce7ba8cffc4fc317cbef7e783). This will set the base API url to `http://localhost:3000`.

### Configure

#### .env

In `/frontend-src/` create a `.env ` file if it doesn't exist with the contents:

```bash
REACT_APP_ENVIRONMENT="development"
```

If you look at `/frontend-src/app/apiConfig.js` you will notice that it sets the API base url based on environment being `production` or `development`.

Additionally, in `/frontend-src/app/apiConfig.js` you can set the user as logged in or not by commenting / uncommenting the required values for `window.spotifyUser`. Setting to `{}` means the user is not logged in / authenticated with Spotify and will show the login screen.

### Run

To start the app, run

```bash
npm run start
```

This will start a fakely functioning app talking to a mock API at localhost:3001 or other specified port (other than 3001, as that is the API).
