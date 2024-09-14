import React from "react";
import { useSelector } from "react-redux";
import Media from "../components/Media";
import { motion } from "framer-motion";

const Bookmarks = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const { movieBookmarks, tvSeriesBookmarks, status, error } = useSelector(
    (state) => state.bookmarks
  );

  if (status === "loading") {
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

  if (error && status === "failed") {
    return <h1 className="text-red-custom mt-8">{error}</h1>;
  }

  // Authentication check
  if (!isAuthenticated) {
    return (
      <h1 className="text-white mt-8 text-2xl sm:text-3xl">
        Login to view Bookmarks
      </h1>
    );
  }

  return (
    <div className="w-full text-white">
      <div className="mt-8">
        {status === "succeeded" ? (
          <>
            {/* Bookmarked Movies Section */}
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <h1 className="text-white text-2xl sm:text-3xl font-bold mb-4">
                  Bookmarked Movies
                </h1>
              </motion.div>
              {movieBookmarks.length > 0 ? (
                <Media data={movieBookmarks} />
              ) : (
                <h1>No Movie Bookmarks found</h1>
              )}
            </div>
                
              {/* Bookmarked TV Series Section */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <h1 className="text-white text-2xl sm:text-3xl font-bold mb-4">
                Bookmarked TV Series
              </h1>
              </motion.div>
              {tvSeriesBookmarks.length > 0 ? (
                <Media data={tvSeriesBookmarks} />
              ) : (
                <h1>No TV Series Bookmarks found</h1>
              )}
            </div>
          </>
        ) : (
          <h1>No Bookmarks found</h1>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;