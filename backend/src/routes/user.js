const express = require("express");
const router = express.Router();
const User = require('../models/user');
const { verifyJWT } = require('../middleware/verifyJWT');
const { validateBookmark } = require('../middleware/validation');
const handleValidationErrors = require('../middleware/validationErrors');
const axios = require("axios");

const apiKey = process.env.TMDB_API_KEY;
const TMDB_MOVIE_API_URL = 'https://api.themoviedb.org/3/movie';
const TMDB_TV_API_URL = 'https://api.themoviedb.org/3/tv';

// Helper function to get user by ID without password
const getUserById = async (userId) => {
    return await User.findById(userId).select('-password');
};

// Helper function to update bookmarks for movies or TV series
const updateBookmark = async (userId, itemId, post, isMovie) => {

    const user = await getUserById(userId);
    if(!user) {
        throw new Error('User not found');
    }

    const bookmark = isMovie ? 'movieBookmarks' : 'tvSeriesBookmarks';
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

// Route to get user profile information
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

// Route to add a bookmark (movie or TV series) to the user's profile
router.post('/bookmark', verifyJWT, validateBookmark, handleValidationErrors, async (req, res) => {
    const { itemId, isMovie } = req.body;

    try {
        await updateBookmark(req.userId, itemId, true, isMovie);
        res.status(201).json({message: 'Bookmark added successfully'});
    } catch (error) {
        console.error('Error adding bookmark:', error);
        res.status(error.message === 'Item already bookmarked' ? 400 : 404).json({message: error.message });
    }
});

// Route to remove a bookmark (movie or TV series) from the user's profile
router.delete('/bookmark', verifyJWT, validateBookmark, handleValidationErrors, async (req,res) => {
    const { itemId, isMovie } = req.body;
    try {
        await updateBookmark(req.userId, itemId, false, isMovie);
        res.status(200).json({message: 'Bookmark removed successfully'});
    } catch (error) {
        console.error('Error removing bookmark:', error);
        res.status(error.message === 'Item not bookmarked so cannot be removed' ? 400 : 404 ).json({message: error.message });
    }
});

// Helper function to fetch movie details from TMDB API
const fetchMovieDetails = async (movieId) => {
    try {
        const response = await axios.get(`${TMDB_MOVIE_API_URL}/${movieId}`, {
            params: { api_key: apiKey, append_to_response: 'credits' }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching movie with id ${movieId}:`, error.message);
        return null;
    }
};

// Helper function to fetch TV series details from TMDB API
const fetchTvSeriesDetails = async (tvSeriesId) => {
    try {
        const response = await axios.get(`${TMDB_TV_API_URL}/${tvSeriesId}`, {
            params: { api_key: apiKey, append_to_response: 'credits' }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching TV series with id ${tvSeriesId}:`, error.message);
        return null;
    }
};

// Route to get all bookmarks for the user
router.get('/bookmark', verifyJWT, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-_id -password');
        if (!user) {
            return res.status(401).json({message: 'User not found'});
        }

        const movieBookmarks = await Promise.all(
            user.movieBookmarks.map(async (id) => await fetchMovieDetails(id))
        ).then(results => results.filter(movie => movie !== null)); 

        const tvSeriesBookmarks = await Promise.all(
            user.tvSeriesBookmarks.map(async (id) => await fetchTvSeriesDetails(id))
        ).then(results => results.filter(series => series !== null)); 

        const bookmarks = {
            movieBookmarks,
            tvSeriesBookmarks
        };
        
        res.status(200).json(bookmarks);
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
});

module.exports = router;