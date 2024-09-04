const express = require("express");
const router = express.Router();
const User = require('../models/user');
const Movie = require('../models/movie');
const TvSeries = require('../models/tvSeries');
const verifyJWT = require('../middleware/verifyJWT');
const { validateBookmark } = require('../middleware/validation');
const handleValidationErrors = require('../middleware/validationErrors');

const getUserById = async (userId) => {
    return await User.findById(userId).select('-password');
};

const updateBookmark = async (userId, itemId, post) => {

    const user = await getUserById(userId);
    if(!user) {
        throw new Error('User not found');
    }

    const movie = await Movie.findById(itemId);
    const tvSeries = await TvSeries.findById(itemId);

    if(!movie && !tvSeries) {
        throw new Error('Item not found');
    }

    const bookmark = movie ? 'movieBookmarks' : 'tvSeriesBookmarks';
    const isBookmarked = user[bookmark].includes(itemId);

    if(post) {
        if(isBookmarked) {
            throw new Error('Item already bookmarked');
        } else {
            user[bookmark].push(itemId);
        }
    } else {
        if(isBookmarked) {
            user[bookmark] = user[bookmark].filter(bookmark => bookmark.toString() !== itemId);
        } else {
            throw new Error('Item not bookmarked so cannot be removed');
        }
    }
    await user.save();
};

router.get('/profile', verifyJWT, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-_id -password');
        if (!user) {
            return res.status(401).json({message: 'User not found'});
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
});

router.post('/bookmark', verifyJWT, validateBookmark, handleValidationErrors, async (req, res) => {
    const { itemId } = req.body;

    try {
        await updateBookmark(req.userId, itemId, true);
        res.status(201).json({message: 'Bookmark added successfully'});
    } catch (error) {
        console.error('Error adding bookmark:', error);
        res.status(error.message === 'Item already bookmarked' ? 400 : 404).json({message: error.message });
    }
});

router.get('/bookmark', verifyJWT, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-_id -password').populate('movieBookmarks tvSeriesBookmarks');
        if (!user) {
            return res.status(401).json({message: 'User not found'});
        }

        const bookmarks = {
            movieBookmarks: user.movieBookmarks,
            tvSeriesBookmarks: user.tvSeriesBookmarks
        };
        
        res.status(200).json(bookmarks);
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
});

router.delete('/bookmark', verifyJWT, validateBookmark, handleValidationErrors, async (req,res) => {
    const { itemId } = req.body;
    try {
        await updateBookmark(req.userId, itemId, false);
        res.status(200).json({message: 'Bookmark removed successfully'});
    } catch (error) {
        console.error('Error removing bookmark:', error);
        res.status(error.message === 'Item not bookmarked so cannot be removed' ? 400 : 404 ).json({message: error.message });
    }
})

module.exports = router;