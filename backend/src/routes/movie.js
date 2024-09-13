const express = require("express");
const router = express.Router();
const axios = require("axios");
const Movie = require('../models/movie');
const { validateSearch, validateId } = require('../middleware/validation');
const handleValidationErrors = require('../middleware/validationErrors');
const setCacheControl = require('../middleware/cacheControl');

const apiKey = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';


router.get('/', setCacheControl, async (req, res) => {
    try {
        const movies = await Movie.find({});
        res.status(200).json(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ message: 'Internal Server Error',error: error.message });
    }
});

router.get('/popular', setCacheControl, async (req, res) => {
    try {
        const movies = await Movie.find({}).sort({ popularity: -1}).limit(14);
        res.status(200).json(movies);
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        res.status(500).json({ message: 'Internal Server Error',error: error.message });
    }
});

router.get('/search/:query', validateSearch, handleValidationErrors, async (req, res) => {
    try {
        const query = req.params.query.trim();
        const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
            params: {
                api_key: apiKey,
                query: query
            }
        });

        const movies = response.data.results;

        if (movies.length === 0) {
            return res.status(404).json({ message: 'No movies found', error: 'Page Not Found'});
        }
        res.status(200).json(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ message: 'Internal Server Error',error: error.message });
    }
});

router.get('/details/:id', validateId, handleValidationErrors, async (req, res) => {
    try {
        const movieId = req.params.id.trim();

        const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
            params: {
                api_key: apiKey,
                append_to_response: 'credits'
            }
        });

        if (!response.data) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching movie details:', error);
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.get('/url/:id', validateId, handleValidationErrors, async (req, res) => {
    try {
        const movieId = req.params.id.trim();

        const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
            params: {
                api_key: apiKey,
                append_to_response: 'credits'
            }
        });

        const movie = response.data;

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.status(200).json({ url: movie.homepage });
    } catch (error) {
        console.error('Error fetching movie url:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.get('/casts/:id', validateId, handleValidationErrors, async (req, res) => {
    try {
        const movieId = req.params.id.trim();

        const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
            params: {
                api_key: apiKey,
                append_to_response: 'credits'
            }
        });
        
        const movie = response.data;

        if (!movie) {
            return res.status(404).json({ message: 'Movie information not found' });
        }

        res.status(200).json({ cast: movie.credits.cast });
    } catch (error) {
        console.error('Error fetching movie cast:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = router;