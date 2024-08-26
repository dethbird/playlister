const express = require('express');
const router = express.Router();
const spotifyApi = require('../modules/spotifyApi');
const { User } = require('../models/models');


router.get('/', (req, res) => {
    if (req.user) {
        User.findByPk(req.user.user.id)
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                console.error('Error fetching app user:', err);
                res.status(500).json({ message: err.message });
            });
    } else {
        res.status(404).json({ message: 'No session user, user not found' });
    }


});

router.get('/spotify', (req, res) => {
    spotifyApi.getMe()
        .then(data => {
            res.json(data.body);
        })
        .catch(err => {
            console.error('Error getting spotify user:', err);
            res.status(err.statusCode).json({ message: err.message });
        });
});

router.put('/toggle-theme', async (req, res) => {

    User.findByPk(req.user.user.id)
        .then(user => {
            user.theme = user.theme === 'light' ? 'dark' : 'light';
            user.save()
                .then(data => {
                    res.json(data);
                })
                .catch(err => {
                    console.error('Error toggling user theme:', err);
                    res.status(500).json({ message: err.message });
                });
        })
        .catch(err => {
            console.error('Error getting user theme:', err);
            res.status(404).json({ message: err.message });
        });
});

router.put('/sign-tos', async (req, res) => {

    User.findByPk(req.user.user.id)
        .then(user => {
            user.tos_signed = 'Y';
            user.save()
                .then(data => {
                    res.json(data);
                })
                .catch(err => {
                    console.error('Error signing TOS:', err);
                    res.status(500).json({ message: err.message });
                });
        })
        .catch(err => {
            console.error('Error finding user to sign TOS:', err);
            res.status(404).json({ message: err.message });
        });
});

router.put('/sign-pp', async (req, res) => {

    User.findByPk(req.user.user.id)
        .then(user => {
            user.pp_signed = 'Y';
            user.save()
                .then(data => {
                    res.json(data);
                })
                .catch(err => {
                    console.error('Error signing PP:', err);
                    res.status(500).json({ message: err.message });
                });
        })
        .catch(err => {
            console.error('Error finding user to sign PP:', err);
            res.status(404).json({ message: err.message });
        });
});



module.exports = router;
