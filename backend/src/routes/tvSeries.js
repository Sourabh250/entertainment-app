const express = require("express");
const router = express.Router();
const axios = require("axios");
const TvSeries = require("../models/tvSeries");
const User = require("../models/user");
const Search = require("../models/search");
const { validateSearch, validateId } = require("../middleware/validation");
const handleValidationErrors = require("../middleware/validationErrors");
const { verifyJWTforSearch } = require("../middleware/verifyJWT");
const setCacheControl = require("../middleware/cacheControl");

const apiKey = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Retrieving all TV series from the database
router.get("/", setCacheControl, async (req, res) => {
  try {
    const tvSeries = await TvSeries.find({});
    res.status(200).json(tvSeries);
  } catch (error) {
    console.error("Error fetching tv series:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// Retrieving popular TV series, sorted by popularity and limited to 14 results
router.get("/popular", setCacheControl, async (req, res) => {
  try {
    const tvSeries = await TvSeries.find({}).sort({ popularity: -1 }).limit(14);
    res.status(200).json(tvSeries);
  } catch (error) {
    console.error("Error fetching popular tv series:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// Searching for TV series using a query parameter
router.get(
  "/search/:query",
  validateSearch,
  handleValidationErrors,
  verifyJWTforSearch,
  async (req, res) => {
    try {
      const query = req.params.query.trim().toLowerCase();

      const response = await axios.get(`${TMDB_BASE_URL}/search/tv`, {
        params: {
          api_key: apiKey,
          query: query,
        },
      });

      const tvSeries = response.data.results;

      if (tvSeries.length === 0) {
        return res
          .status(404)
          .json({ message: "No tv series found", error: "Page Not Found" });
      }

      if (req.userId) {
        try {
          const user = await User.findById(req.userId).select('-_id -password');
          if (user) {
            let search = await Search.findOne({ userId: req.userId });
            if (!search) {
              search = new Search({ userId: req.userId, searches: [{ query, createdAt: new Date() }] });
            }

            const ifExits = search.searches.find(
              (s) => s.query.toLowerCase() === query
            );

            if (!ifExits) {
              search.searches.push({ query: query, createdAt: new Date() });
              await search.save();
            }
          }
        } catch (error) {
          console.error("Error updating user search history:", error);
        }
      }
      res.status(200).json(tvSeries);
    } catch (error) {
      console.error("Error fetching tv series:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
);

// Retrieving detailed information about a specific TV series by ID
router.get(
  "/details/:id",
  validateId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const tvSeriesId = req.params.id.trim();

      const response = await axios.get(`${TMDB_BASE_URL}/tv/${tvSeriesId}`, {
        params: {
          api_key: apiKey,
          append_to_response: "credits",
        },
      });

      if (!response.data) {
        return res.status(404).json({ message: "Tv Series not found" });
      }

      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error fetching tv series details:", error);
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ message: "Tv Series not found" });
      }
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
);

// Retrieving the homepage URL of a specific TV series by ID
router.get("/url/:id", validateId, handleValidationErrors, async (req, res) => {
  try {
    const tvSeriesId = req.params.id.trim();

    const response = await axios.get(`${TMDB_BASE_URL}/tv/${tvSeriesId}`, {
      params: {
        api_key: apiKey,
        append_to_response: "credits",
      },
    });

    const tvSeries = response.data;

    if (!tvSeries) {
      return res.status(404).json({ message: "Tv Series not found" });
    }

    res.status(200).json({ url: tvSeries.homepage });
  } catch (error) {
    console.error("Error fetching tv series url:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// Retrieving cast information for a specific TV series by ID
router.get(
  "/casts/:id",
  validateId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const tvSeriesId = req.params.id.trim();

      const response = await axios.get(`${TMDB_BASE_URL}/tv/${tvSeriesId}`, {
        params: {
          api_key: apiKey,
          append_to_response: "credits",
        },
      });

      const tvSeries = response.data;

      if (!tvSeries) {
        return res.status(404).json({ message: "Tv Series not found" });
      }

      res.status(200).json({ casts: tvSeries.credits.cast });
    } catch (error) {
      console.error("Error fetching tv series casts:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
);

module.exports = router;
