import React,{ useState, useEffect } from 'react';
import axios from 'axios';
import Media from '../components/Media';
import { motion } from 'framer-motion';

const TvSeries = () => {
  const [tvSeries, setTvSeries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // fetching tv series data when the component mounts
  useEffect(() => {
      const fetchTvSeries = async () => {
          try {
              const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/tv-series/popular`);
              setError("");
              setTvSeries(res.data);
          } catch (err) {
              setError("Error fetching TV series");
              console.error("Error fetching movies:", err);
          } finally {
              setLoading(false);
          }
      };
      fetchTvSeries();
  },[]);

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
          TV Series
        </h1>
        </motion.div>

        {error ? (
          <h1 className="text-red-custom">{error}</h1>
        ) : tvSeries.length === 0 ? (
          <h1 className="text-white">No TV series Found, check again later</h1>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }} // Start from below
            animate={{ opacity: 1, y: 0 }}   // Move to the final position
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <Media data={tvSeries} />
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default TvSeries;