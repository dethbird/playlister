const express = require('express');
const router = express.Router();
const spotifyApi = require('../modules/spotifyApi');
const { User } = require('../models/models');


router.get('/', (req, res) => {
    if (req.user) {
        User.findByPk(req.user.user.id)
            .then(user => {
                // Return only the necessary user data, not the full Sequelize instance
                const response = {
                    theme: user.theme,
                    tos_signed: user.tos_signed,
                    pp_signed: user.pp_signed
                };
                
                // Add cache-control headers to prevent browser caching issues
                res.set({
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                });
                
                res.json(response);
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
    try {
        const user = await User.findByPk(req.user.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.theme = user.theme === 'light' ? 'dark' : 'light';
        await user.save();
        
        // Return only the necessary user data, not the full Sequelize instance
        const response = {
            theme: user.theme,
            tos_signed: user.tos_signed,
            pp_signed: user.pp_signed
        };
        
        // Add cache-control headers to prevent browser caching issues
        res.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        
        res.json(response);
    } catch (err) {
        console.error('Error toggling user theme:', err);
        res.status(500).json({ message: err.message });
    }
});

router.put('/sign-tos', async (req, res) => {
    try {
        const user = await User.findByPk(req.user.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.tos_signed = 'Y';
        await user.save();
        
        // Return only the necessary user data, not the full Sequelize instance
        res.json({
            theme: user.theme,
            tos_signed: user.tos_signed,
            pp_signed: user.pp_signed
        });
    } catch (err) {
        console.error('Error signing TOS:', err);
        res.status(500).json({ message: err.message });
    }
});

router.put('/sign-pp', async (req, res) => {
    try {
        const user = await User.findByPk(req.user.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.pp_signed = 'Y';
        await user.save();
        
        // Return only the necessary user data, not the full Sequelize instance
        res.json({
            theme: user.theme,
            tos_signed: user.tos_signed,
            pp_signed: user.pp_signed
        });
    } catch (err) {
        console.error('Error signing PP:', err);
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;
