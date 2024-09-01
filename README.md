# Playlister Backend

The backend is a Node / Express app using Passport.js to authenticate via Spotify.

The Express app serves not only as the Oauth endpoints, and the React app (/fontend-src) injection point, but also the application's API as a wrapper to Spotify's API.

It uses router delegation to break the routes into relevant domains.

Persistence happens using a Postgres database.

## Development Quickstart

### Setup

- Create an app on Spotify Developers and note the client id and secret, and add an `/auth/spotify/callback` callback url to your localhost in the settings.
- Create a `postgres` DB and run `/database/init.sql` to intiialize the schema.
- Checkout the repo

### Configure

Copy `shadow.env` to `.env` and fill in credentials specific to your instance.

```bash
PORT=8001

SESSION_SECRET=""
SESSION_TIMEOUT=300000000

SPOTIFY_KEY=""
SPOTIFY_SECRET=""
SPOTIFY_CALLBACK_URL="http://playlistervm:8001/auth/spotify/callback"

DB_USER=""
DB_PASSWORD=""
DB_HOST=""
DB_NAME=""
```

### Build

In project root

```bash
sh build.sh
```

This will do the following:

    - build `frontend-src` project into a single bundle (`main.js` and `main.css`).
    - run `/deploy-tools` and move the built frontend static assets into the `/publc` dir, where the express app is server is setup to serve static files from
    - build the express app

### Run

```bash
npm run start
```

This will begin the development server.

## Testing

To run the tests in watch mode, simply run
```bash
npm run test
```

To output a coverage report to `/coverage`, use
```bash
npm run test-coverage
```

To view the output locally, scp the coverage report to your host machine (example):

```bash
cd ~/Documents
rm -rf backend-coverage
scp -r vm@playlistervm:/home/vm/code/playlister/coverage ~/Documents/backend-coverage
```

Then double click `index.html` in `~/Documents/backend-covergage`.
