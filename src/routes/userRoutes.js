const express = require('express');
const router = express.Router();
const spotifyApi = require('../modules/spotifyApi');
const { User } = require('../models/models');


router.get('/', (req, res) => {
    User.findByPk(req.user.user.id)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.error('Error fetching app user:', err);
        });

});

router.get('/spotify', (req, res) => {
    spotifyApi.getMe()
        .then(data => {
            res.json(data.body);
        })
        .catch(err => {
            console.error('Error pausing track:', err);
        });
});

router.put('/toggle-theme', async (req, res) => {

    User.findByPk(req.user.user.id)
        .then(user => {
            user.theme = user.theme === 'light' ? 'dark' : 'light';
            user.save()
            .then(data => {
                res.json(data);
            });
        })
        .catch(err => {
            console.error('Error toggling theme:', err);
        });
});


module.exports = router;
