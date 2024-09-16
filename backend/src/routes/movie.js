const express = require("express");
const router = express.Router();
const axios = require("axios");
const Movie = require("../models/movie");
const User = require("../models/user");
const { validateSearch, validateId } = require("../middleware/validation");
const handleValidationErrors = require("../middleware/validationErrors");
const { verifyJWTforSearch } = require("../middleware/verifyJWT");
const setCacheControl = require("../middleware/cacheControl");

const apiKey = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Retrieving all movies from the database
router.get("/", setCacheControl, async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// Retrieving popular movies, sorted by popularity and limited to 14 results
router.get("/popular", setCacheControl, async (req, res) => {
  try {
    const movies = await Movie.find({}).sort({ popularity: -1 }).limit(14);
    res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// Searching for movies using a query parameter
router.get(
  "/search/:query",
  validateSearch,
  handleValidationErrors,
  verifyJWTforSearch,
  async (req, res) => {
    try {
      const query = req.params.query.trim().toLowerCase();
      const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: {
          api_key: apiKey,
          query: query,
        },
      });

      const movies = response.data.results;

      if (movies.length === 0) {
        return res
          .status(404)
          .json({ message: "No movies found", error: "Page Not Found" });
      }

      if (req.userId) {
        try {
          const user = await User.findById(req.userId);
          const ifExits = user.searches.find(
            (search) => search.query.toLowerCase() === query
          );
          if (!ifExits) {
            await User.updateOne(
              { 
                "searches.query": { $ne: query } 
              },
              {
              $push: { searches: { query: query, createdAt: new Date() } }
              },
            );
          }
        } catch (error) {
          console.error("Error updating user search history:", error);
        }
      }
      res.status(200).json(movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
);

// Retrieving detailed information about a specific movie by ID
router.get(
  "/details/:id",
  validateId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const movieId = req.params.id.trim();

      const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: apiKey,
          append_to_response: "credits",
        },
      });

      if (!response.data) {
        return res.status(404).json({ message: "Movie not found" });
      }

      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
);

// Retrieving the homepage URL of a specific movie by ID
router.get("/url/:id", validateId, handleValidationErrors, async (req, res) => {
  try {
    const movieId = req.params.id.trim();

    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: apiKey,
        append_to_response: "credits",
      },
    });

    const movie = response.data;

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({ url: movie.homepage });
  } catch (error) {
    console.error("Error fetching movie url:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// Retrieving cast information for a specific movie by ID
router.get(
  "/casts/:id",
  validateId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const movieId = req.params.id.trim();

      const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: apiKey,
          append_to_response: "credits",
        },
      });

      const movie = response.data;

      if (!movie) {
        return res.status(404).json({ message: "Movie information not found" });
      }

      res.status(200).json({ cast: movie.credits.cast });
    } catch (error) {
      console.error("Error fetching movie cast:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
);

module.exports = router;
