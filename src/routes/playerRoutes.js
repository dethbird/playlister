const express = require('express');
const router = express.Router();

router.get('/currently-playing', (req, res) => {
    // console.log('UUUU', req.user.accessToken);
    spotifyApi.getMe()
                    .then(data => {
                        res.json(data);
                    })
                    .catch(err => {
                        console.error('Error getting user profile:', err);
                    });

});


module.exports = router;
