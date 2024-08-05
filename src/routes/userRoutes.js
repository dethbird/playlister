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


module.exports = router;
