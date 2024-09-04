const express = require("express");
const router = express.Router();
const TvSeries = require('../models/tvSeries');
const { validateSearch, validateId } = require('../middleware/validation');
const handleValidationErrors = require('../middleware/validationErrors');
const setCacheControl = require('../middleware/cacheControl');


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
        const tvSeries = await TvSeries.find({ name: { $regex: query, $options: 'i' } });
        if (tvSeries.length === 0) {
            return res.status(404).json({ message: 'No tv series found', error: 'Page Not Found'});
        }
        res.status(200).json(tvSeries);
    } catch (error) {
        console.error('Error fetching tv series:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.get('/url/:id', validateId, handleValidationErrors, async (req, res) => {
    try {
        const tvSeriesId = req.params.id.trim();

        const tvSeries = await TvSeries.findById(tvSeriesId);
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

        const tvSeries = await TvSeries.findById(tvSeriesId); 

        if (!tvSeries) {
            return res.status(404).json({ message: 'Tv Series not found' });
        }

        res.status(200).json({ casts: tvSeries.cast });
    } catch (error) {
        console.error('Error fetching tv series casts:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }    
});

module.exports = router;