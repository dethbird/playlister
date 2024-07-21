require('dotenv').config();
const express = require('express');
const app = express();
const consolidate = require('consolidate');
const morgan = require('morgan');
const passport = require("passport");
const path = require('path');
const session = require("express-session");
const SpotifyStrategy = require('passport-spotify').Strategy;
const SpotifyWebApi = require('spotify-web-api-node');

const { User, Playlist, Favorite } = require('./models/models');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Set the view engine to Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', consolidate.nunjucks);
app.use(express.static(__dirname + '../public'));

const callbackUrl = `http://${process.env.HOSTNAME}:${process.env.PORT}/auth/spotify/callback`;

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_KEY,
    clientSecret: process.env.SPOTIFY_SECRET,
    redirectUri: callbackUrl
});

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
        // store,
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});


const PORT = process.env.PORT || 8001;

app.get('/', (req, res) => {
    console.log('USER', req.user);
    res.render('index', { title: 'Spotify Playlister', user: req.user });
});

app.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("/");
    });

});

app.get('/auth/spotify', passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private'],
    showDialog: true
}));

app.get(
    '/auth/spotify/callback',
    passport.authenticate('spotify', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    }
);

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});


// const ensureAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect('/login');
// }

