require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const passport = require("passport");
const path = require('path');
const session = require("express-session");
const SpotifyStrategy = require('passport-spotify').Strategy;

const { User, Playlist, Favorite } = require('./models/models');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Set the view engine to Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

passport.use(
    new SpotifyStrategy(
        {
            clientID: process.env.SPOTIFY_KEY,
            clientSecret: process.env.SPOTIFY_SECRET,
            callbackURL: `http://${process.env.HOSTNAME}:${process.env.PORT}/auth/spotify/callback`
        },
        function (accessToken, refreshToken, expires_in, profile, done) {
            // User.findOrCreate({ spotifyId: profile.id }, function (err, user) {
            //     return done(err, user);
            // });
            return done(err, profile);
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
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.users.findById(id, function (err, user) {
        if (err) {
            return done(err);
        }
        done(null, user);
    });
});


const PORT = process.env.PORT || 8001;

app.get('/', (req, res) => {
    res.render('index', { title: 'Spotify Playlister'});
});


// app.get("/logout", (req, res) => {
//     req.logout();
//     res.redirect("/login");

// });

// app.get("/login", (req, res) => {
//     res.render("login");
// });

// app.post(
//     "/login",
//     passport.authenticate("local", { failureRedirect: "/login" }),
//     (req, res) => {
//         res.redirect("profile");
//     }
// );

// app.get("/profile", (req, res) => {
//     res.render("profile", { user: req.user });
// });

// app.post("/register", async (req, res) => {
//     const { username, password } = req.body;
//     const newUser = await db.users.createUser({ username, password });
//     if (newUser) {
//         res.status(201).json({
//             msg: "New user created!",
//             newUser,
//         });
//     } else {
//         res.status(500).json({ msg: "Unable to create user" });
//     }
// });

app.get('/auth/spotify', passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private'],
    showDialog: true
}));

app.get(
    '/auth/spotify/callback',
    passport.authenticate('spotify', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        console.log(req, req.user);
        res.redirect('/');
    }
);

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});
