import React, { useState, useEffect } from "react";
import axios from "axios";
import TrendingSlider from "../components/TrendingSlider";
import Media from "../components/Media";
import { motion } from "framer-motion";

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTVSeries, setTrendingTVSeries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetching trending movies and TV series data on component mount
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const [movieRes, tvRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/movies/`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/tv-series/`),
        ]);
        setError("");
        setTrendingMovies(movieRes.data);
        setTrendingTVSeries(tvRes.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching trending data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
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

  // Combining data into a single array and sorting for trending and recommended lists
  const combined = [...trendingMovies, ...trendingTVSeries];
  const trending = combined
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 20);
  const recommended = combined
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 14);

  return (
    <>
      <div className="w-full">
        {/* Trending Section */}
        <div className="mt-8">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <h1 className="text-white text-2xl sm:text-3xl mb-4">
              Trending
            </h1>
          </motion.div>

          {error ? (
            <h1 className="text-red-custom">
              Error fetching trending data from server
            </h1>
          ) : trending.length === 0 ? (
            <h1 className="text-white">
              No Trending data Found, check again later
            </h1>
          ) : (
            <motion.div
              style={{ willChange: "transform, opacity" }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <TrendingSlider trending={trending} />
            </motion.div>
          )}
        </div>
        
        {/* Recommended Section */}
        <div className="mt-8">
          <motion.div
            initial={{ opacity: 0, x: 50 }} // Start from below
            animate={{ opacity: 1, x: 0 }} // Move to the final position
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <h1 className="text-white text-2xl sm:text-3xl mb-4">
              Recommended for you
            </h1>
          </motion.div>

          {error ? (
            <h1 className="text-red-custom">
              Error fetching recommended data from server
            </h1>
          ) : recommended.length === 0 ? (
            <h1 className="text-white">
              No Recommended data Found, check again later
            </h1>
          ) : (
            <motion.div
              style={{ willChange: "transform, opacity" }}
              initial={{ opacity: 0, y: 50 }} // Start from below
              animate={{ opacity: 1, y: 0 }} // Move to the final position
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <Media data={recommended} />
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;