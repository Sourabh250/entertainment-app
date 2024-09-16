const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");
const userRoutes = require("./user");
const movieRoutes = require("./movie");
const tvSeriesRoutes = require("./tvSeries");

// Defining route prefixes for different parts of the API
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/movies', movieRoutes);
router.use('/tv-series', tvSeriesRoutes);

module.exports = router;