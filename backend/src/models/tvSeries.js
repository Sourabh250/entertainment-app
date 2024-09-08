const mongoose = require('mongoose');

const tvSeriesSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    original_name: { type: String, required: true },
    name: { type: String, required: true },
    overview: { type: String, required: false },
    first_air_date: { type: String, required: true },
    last_air_date: { type: String, required: true }, // last_air_date
    popularity: { type: Number, required: true },
    vote_average: { type: Number, required: true },
    vote_count: { type: Number, required: true },
    adult: { type: Boolean, required: false },
    backdrop_path: { type: String, required: true },
    poster_path: { type: String, required: true },
    status: { type: String, required: true }, // status
    tagline: { type: String, required: true }, // tagline
    homepage: { type: String, required: true }, // homepage
    genre_ids: { type: Array, required: true },
    genre: { type: Array, required: true }, // genre name
    cast: { type: [String], required: true }, // cast name
    original_language: { type: String, required: true }
}, {
    timestamps: true,
    id: false
});

const TvSeries = mongoose.model('TvSeries', tvSeriesSchema);

module.exports = TvSeries;