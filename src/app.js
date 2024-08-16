const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const app = express();
const compression = require("compression");
const consolidate = require('consolidate');
const morgan = require('morgan');
const passport = require("passport");
const RateLimit = require("express-rate-limit");
const session = require("express-session");
const SpotifyStrategy = require('passport-spotify').Strategy;

const { User } = require('./models/models');
const spotifyApi = require('./modules/spotifyApi');

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
        function (accessToken, refreshToken, expires_in, profile, done) {
            User.findOrCreate({
                where: { spotify_user_id: profile.id }
            }).then((user, userCreated) => {
                spotifyApi.setAccessToken(accessToken);
                spotifyApi.getMe()
                    .then(data => {
                        return done(null, { user: user[0], accessToken, spotifyUser: data.body });
                    })
                    .catch(err => {
                        console.error('Error getting user profile:', err);
                    });

            }).catch(err => {
                console.log(err);
            });
        }
    )
);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        cookie: { maxAge: process.env.SESSION_MAXAGE, secure: false },
        saveUninitialized: false,
        resave: false,
        // store, // use a persistent store like connect-mongo
    })
);

app.use((req, res, next) => {
    if (req.user) {
        spotifyApi.setAccessToken(req.user.accessToken);
    }
    next();
});

app.use(passport.initialize());
app.use(passport.session());

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
        title: 'Spotify Playlister',
        user: req.user,
        spotifyUserJson: req.user ? JSON.stringify({
            id: req.user.spotifyUser.id,
            display_name: req.user.spotifyUser.display_name,
            images: req.user.spotifyUser.images
        }) : '{}'
    });
});

app.get('/hello', (req, res) => {
    res.status(200).send({ message: 'Hello, World!' });
});

app.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("/");
    });

});

app.get('/auth/spotify', passport.authenticate('spotify', {
    scope: requiredScopes,
    showDialog: true
}));

app.get(
    '/auth/spotify/callback',
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
// const ensureAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect('/login');
// }
