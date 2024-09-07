const express = require("express");
const router = express.Router();
const Movie = require('../models/movie');
const { validateSearch, validateId } = require('../middleware/validation');
const handleValidationErrors = require('../middleware/validationErrors');
const setCacheControl = require('../middleware/cacheControl');


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
        const movies = await Movie.find({ title: { $regex: query, $options: 'i' } });
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

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.status(200).json(movie);
    } catch (error) {
        console.error('Error fetching movie details:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.get('/url/:id', validateId, handleValidationErrors, async (req, res) => {
    try {
        const movieId = req.params.id.trim();

        const movie = await Movie.findById(movieId);
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

        const movie = await Movie.findById(movieId); 

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.status(200).json({ cast: movie.cast });
    } catch (error) {
        console.error('Error fetching movie cast:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = router;