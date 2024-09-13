const express = require("express");
const router = express.Router();
const axios = require("axios");
const TvSeries = require('../models/tvSeries');
const { validateSearch, validateId } = require('../middleware/validation');
const handleValidationErrors = require('../middleware/validationErrors');
const setCacheControl = require('../middleware/cacheControl');

const apiKey = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';


router.get('/', setCacheControl, async (req, res) => {
    try {
        const tvSeries = await TvSeries.find({});
        res.status(200).json(tvSeries);
    } catch (error) {
        console.error('Error fetching tv series:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.get('/popular', setCacheControl, async (req, res) => {
    try {
        const tvSeries = await TvSeries.find({}).sort({ popularity: -1}).limit(14);
        res.status(200).json(tvSeries);
    } catch (error) {
        console.error('Error fetching popular tv series:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.get('/search/:query', validateSearch, handleValidationErrors, async (req, res) => {
    try {
        const query = req.params.query.trim();
        
        const response = await axios.get(`${TMDB_BASE_URL}/search/tv`, {
            params: {
                api_key: apiKey,
                query: query
            }
        });

        const tvSeries = response.data.results;

        if (tvSeries.length === 0) {
            return res.status(404).json({ message: 'No tv series found', error: 'Page Not Found'});
        }
        res.status(200).json(tvSeries);
    } catch (error) {
        console.error('Error fetching tv series:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.get('/details/:id', validateId, handleValidationErrors, async (req, res) => {
    try {
        const tvSeriesId = req.params.id.trim();

        const response = await axios.get(`${TMDB_BASE_URL}/tv/${tvSeriesId}`, {
            params: {
                api_key: apiKey,
                append_to_response: 'credits'
            }
        });

        if (!response.data) {
            return res.status(404).json({ message: 'Tv Series not found' });
        }

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching tv series details:', error);
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: 'Tv Series not found' });
        }
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.get('/url/:id', validateId, handleValidationErrors, async (req, res) => {
    try {
        const tvSeriesId = req.params.id.trim();

        const response = await axios.get(`${TMDB_BASE_URL}/tv/${tvSeriesId}`, {
            params: {
                api_key: apiKey,
                append_to_response: 'credits'
            }
        });

        const tvSeries = response.data;

        if (!tvSeries) {
            return res.status(404).json({ message: 'Tv Series not found' });
        }

        res.status(200).json({ url: tvSeries.homepage });
    } catch (error) {
        console.error('Error fetching tv series url:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.get('/casts/:id', validateId, handleValidationErrors, async (req, res) => {
    try {
        const tvSeriesId = req.params.id.trim();

        const response = await axios.get(`${TMDB_BASE_URL}/tv/${tvSeriesId}`, {
            params: {
                api_key: apiKey,
                append_to_response: 'credits'
            }
        });

        const tvSeries = response.data;

        if (!tvSeries) {
            return res.status(404).json({ message: 'Tv Series not found' });
        }

        res.status(200).json({ casts: tvSeries.credits.cast });
    } catch (error) {
        console.error('Error fetching tv series casts:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }    
});

module.exports = router;