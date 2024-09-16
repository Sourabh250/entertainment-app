const mongoose = require('mongoose');

// Defining the schema for a movie
const movieSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    original_title: { type: String, required: true },
    title: { type: String, required: true },
    overview: { type: String, required: true },
    release_date: { type: String, required: true },
    popularity: { type: Number, required: true },
    vote_average: { type: Number, required: true },
    vote_count: { type: Number, required: true },
    adult: { type: Boolean, required: false },
    backdrop_path: { type: String, required: true },
    poster_path: { type: String, required: true },
    homepage: { type: String, required: true },
    imdb_id: { type: String, required: true },
    genre_ids: { type: Array, required: true },
    genre: { type: Array, required: true },
    tagline: { type: String, required: true },
    status: { type: String, required: true },
    runtime: { type: Number, required: true },
    cast: { type: Array, required: true },
    original_language: { type: String, required: true }
}, {
    timestamps: true,
    id: false
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;