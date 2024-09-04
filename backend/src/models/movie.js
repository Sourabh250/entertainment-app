const mongoose = require('mongoose');


const movieSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    original_title: { type: String, required: true },
    title: { type: String, required: true },
    overview: { type: String, required: true },
    release_date: { type: String, required: true },
    popularity: { type: Number, required: true },
    vote_average: { type: Number, required: true },
    vote_count: { type: Number, required: true },
    adult: { type: Boolean, required: true },
    backdrop_path: { type: String, required: true },
    poster_path: { type: String, required: true },
    video: { type: Boolean, required: true },
    homepage: { type: String, required: true }, // homepage
    imdb_id: { type: String, required: true }, // imdb_id
    genre_ids: { type: Array, required: true },
    genre: { type: Array, required: true }, // genre name
    tagline: { type: String, required: true }, // tagline
    status: { type: String, required: true }, // status
    runtime: { type: Number, required: true }, // runtime
    cast: { type: [String], required: true } // cast name
}, {
    timestamps: true,
    id: false
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;