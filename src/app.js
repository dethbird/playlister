require('dotenv').config();
const express = require('express');
const app = express();
const consolidate = require('consolidate');
const morgan = require('morgan');
const passport = require("passport");
const path = require('path');
const session = require("express-session");
const SpotifyStrategy = require('passport-spotify').Strategy;

const { User } = require('./models/models');
const spotifyApi = require('./modules/spotifyApi');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', consolidate.nunjucks);
// server static contents from /public dir relative to the view templates
app.use(express.static(__dirname + '../../public'));

// constants
const callbackUrl = `http://${process.env.HOSTNAME}:${process.env.PORT}/auth/spotify/callback`;
const PORT = process.env.PORT || 8001;

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
            callbackURL: callbackUrl
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
    console.log('USER', req.user);
    res.render('index', {
        title: 'Spotify Playlister',
        user: req.user,
        spotifyUserJson: req.user ? JSON.stringify(req.user.spotifyUser) : '{}'
    });
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
// Player Routes
const playerRoutes = require('./routes/playerRoutes');
app.use('/player', playerRoutes);

// Playlists Routes
const playlistsRoutes = require('./routes/playlistsRoutes');
app.use('/playlists', playlistsRoutes);



app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});


// const ensureAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect('/login');
// }

