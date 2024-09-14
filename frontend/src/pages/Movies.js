import React, { useState, useEffect } from "react";
import axios from "axios";
import Media from "../components/Media";
import { motion } from "framer-motion";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // fetching movies data when the component mounts
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/movies/popular`
        );
        setError("");
        setMovies(res.data);
      } catch (err) {
        setError("Error fetching movies");
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <motion.div
          className="w-8 h-8 border-4 border-white border-t-gray-dark border-t-4 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="w-full">

      <div className="mt-8">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <h1 className="text-white text-2xl sm:text-3xl mb-4">
          Movies
        </h1>
        </motion.div>

        {error ? (
          <h1 className="text-red-custom">{error}</h1>
        ) : movies.length === 0 ? (
          <h1 className="text-white">No Movies Found, check again later</h1>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }} // Start from below
            animate={{ opacity: 1, y: 0 }}   // Move to the final position
            transition={{ duration: 0.8, ease: "easeInOut" }} // Entry transition duration
          >
            <Media data={movies} />
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default Movies;