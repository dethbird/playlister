const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const fs = require('fs');
const app = express();
const compression = require("compression");
const consolidate = require('consolidate');
const morgan = require('morgan');
const passport = require("passport");
const RateLimit = require("express-rate-limit");
const session = require("express-session");
const pgSession = require('connect-pg-simple')(session);
const SpotifyStrategy = require('passport-spotify').Strategy;
const { Pool } = require('pg');

const spotifyApi = require('./modules/spotifyApi');
const { authenticateSpotifyUser, refreshSpotifyToken } = require('./services/userService');

const limiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 250,
});

app.use(limiter);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', consolidate.nunjucks);
// server static contents from /public dir relative to the view templates
app.use(express.static(__dirname + '../../public'));

// Try to load a Vite manifest copied into the public directory at build time.
// If present, this lets templates reference the exact hashed files instead
// of relying on legacy /js/main.js and /css/main.css filenames.
const publicViteManifestPath = path.join(__dirname, '../public/vite-manifest.json');
try {
    if (fs.existsSync(publicViteManifestPath)) {
        const raw = fs.readFileSync(publicViteManifestPath, 'utf8');
        const assetManifest = JSON.parse(raw);
        app.locals.assetManifest = assetManifest;
        console.log('Loaded asset manifest from', publicViteManifestPath);
    } else {
        app.locals.assetManifest = null;
    }
} catch (err) {
    console.warn('Unable to load vite asset manifest:', err);
    app.locals.assetManifest = null;
}

// Middleware to set template variables for main JS/CSS. Templates use these
// (with fallbacks) to include the correct static files.
app.use((req, res, next) => {
    const manifest = app.locals.assetManifest;
    if (manifest && manifest['src/main.jsx']) {
        const entry = manifest['src/main.jsx'];
        res.locals.mainJs = '/' + (entry.file || 'js/main.js');
        res.locals.mainCss = (entry.css && entry.css.length) ? '/' + entry.css[0] : '/css/main.css';
    } else if (manifest) {
        // if manifest exists but key differs, try to find the first entry that isEntry
        const key = Object.keys(manifest).find(k => manifest[k].isEntry) || Object.keys(manifest)[0];
        if (key && manifest[key]) {
            const e = manifest[key];
            res.locals.mainJs = '/' + (e.file || 'js/main.js');
            res.locals.mainCss = (e.css && e.css.length) ? '/' + e.css[0] : '/css/main.css';
        } else {
            res.locals.mainJs = '/js/main.js';
            res.locals.mainCss = '/css/main.css';
        }
    } else {
        // no manifest available — use legacy filenames
        res.locals.mainJs = '/js/main.js';
        res.locals.mainCss = '/css/main.css';
    }
    next();
});

// constants
const requiredScopes = [
    'user-library-read',
    'user-library-modify',
    'user-read-playback-state',
    'user-read-currently-playing',
    'playlist-read-private',
    'playlist-modify-private',
    'user-read-private',
    'playlist-modify-public',
    'app-remote-control',
    'streaming'
];

passport.use(
    new SpotifyStrategy(
        {
            clientID: process.env.SPOTIFY_KEY,
            clientSecret: process.env.SPOTIFY_SECRET,
            callbackURL: process.env.SPOTIFY_CALLBACK_URL
        },
        authenticateSpotifyUser
    )
);

// Create PostgreSQL connection pool for sessions
// const pgPool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: 5432,
// });

app.use(
    session({
        // Temporarily disabled until permissions are fixed
        // store: new pgSession({
        //     pool: pgPool,
        //     tableName: 'session'
        // }),
        secret: process.env.SESSION_SECRET,
        cookie: { maxAge: Number(process.env.SESSION_MAXAGE), secure: false },
        saveUninitialized: true,
        resave: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Token refresh middleware (runs after passport has restored req.user)
app.use(async (req, res, next) => {
    try {
        // skip for health checks and static assets
        if (!req.path || req.path === '/hello' || req.path.startsWith('/static') || req.path.startsWith('/favicon')) {
            return next();
        }

        if (req.user && req.user.user && req.user.user.id) {
            const refreshResult = await refreshSpotifyToken(req.user.user.id);
            if (refreshResult) {
                // Update session user and persist it
                req.user.accessToken = refreshResult.accessToken;
                req.user.refreshToken = refreshResult.refreshToken;
                req.user.expiresAt = refreshResult.expiresAt;

                // Re-login to persist updated user in session store
                return req.login(req.user, (err) => {
                    if (err) console.error('Error re-saving session after token refresh:', err);
                    spotifyApi.setAccessToken(req.user.accessToken);
                    return next();
                });
            }

            // no refresh needed, just set access token for outgoing API calls
            spotifyApi.setAccessToken(req.user.accessToken);
        }
    } catch (err) {
        console.error('Error refreshing token in middleware:', err);
        // Continue without refresh - let the API calls handle the expired token
    }
    return next();
});

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

/**
 * Auth and view routes
 */
app.get('/', (req, res) => {
    console.log('USER', req.user)
    res.render('index', {
        title: 'Playlister',
        user: req.user,
        spotifyUserJson: req.user ? JSON.stringify({
            id: req.user.spotifyUser.id,
            display_name: req.user.spotifyUser.display_name,
            images: req.user.spotifyUser.images
        }) : '{}'
    });
});

app.get('/about', (req, res) => {
    console.log('USER', req.user)
    res.render('index', {
        title: 'Playlister',
        user: req.user,
        spotifyUserJson: req.user ? JSON.stringify({
            id: req.user.spotifyUser.id,
            display_name: req.user.spotifyUser.display_name,
            images: req.user.spotifyUser.images
        }) : '{}'
    });
});

app.get('/howto', (req, res) => {
    console.log('USER', req.user)
    res.render('index', {
        title: 'Playlister',
        user: req.user,
        spotifyUserJson: req.user ? JSON.stringify({
            id: req.user.spotifyUser.id,
            display_name: req.user.spotifyUser.display_name,
            images: req.user.spotifyUser.images
        }) : '{}'
    });
});

// terms of service
app.get('/tos', (req, res) => {
    console.log('USER', req.user)
    res.render('index', {
        title: 'Playlister',
        user: req.user,
        spotifyUserJson: req.user ? JSON.stringify({
            id: req.user.spotifyUser.id,
            display_name: req.user.spotifyUser.display_name,
            images: req.user.spotifyUser.images
        }) : '{}'
    });
});

// privacy policy
app.get('/pp', (req, res) => {
    console.log('USER', req.user)
    res.render('index', {
        title: 'Playlister',
        user: req.user,
        spotifyUserJson: req.user ? JSON.stringify({
            id: req.user.spotifyUser.id,
            display_name: req.user.spotifyUser.display_name,
            images: req.user.spotifyUser.images
        }) : '{}'
    });
});

// health check
app.get('/hello', (req, res) => {
    res.status(200).send({ message: 'Hello, World!' });
});

// logout
app.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("/");
    });

});

// Oauth routes
const shouldShowDialog = () => {
    const cb = process.env.SPOTIFY_CALLBACK_URL || '';
    return cb.startsWith('http://');
}; 

app.get('/auth/spotify', (req, res, next) => {
    console.log('Starting OAuth, Session ID:', req.sessionID);
    console.log('Session contents:', req.session);
    next();
}, passport.authenticate('spotify', {
    scope: requiredScopes,
    showDialog: shouldShowDialog()
}));

// callback to get access token
app.get(
    '/auth/spotify/callback',
    (req, res, next) => {
        next();
    },
    passport.authenticate('spotify', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    }
);


/**
 * API Routes
 */

// User Routes
const userRoutes = require('./routes/userRoutes');
app.use('/me', userRoutes);

// Player Routes
const playerRoutes = require('./routes/playerRoutes');
app.use('/player', playerRoutes);

// Playlists Routes
const playlistsRoutes = require('./routes/playlistsRoutes');
app.use('/playlists', playlistsRoutes);



module.exports = app;
