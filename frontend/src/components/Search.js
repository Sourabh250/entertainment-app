import React, { useState, useEffect, useRef, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { debounce } from "lodash";
import { searchMovies, searchTVSeries, searchAll } from "../utility/searchApi";
import { useSelector } from "react-redux";
import Media from "./Media";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Search = ({ setSearch }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const location = useLocation();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { movieBookmarks, tvSeriesBookmarks } = useSelector(
    (state) => state.bookmarks
  );

  const prevQueryRef = useRef(""); // Ref to keep track of the previous query

  // Function to get the placeholder text based on the current path
  const getPlaceholder = () => {
    switch (location.pathname) {
      case "/movies":
        return "Search for movies";
      case "/tvseries":
        return "Search for TV series";
      case "/bookmarks":
        return "Search for bookmarked shows";
      default:
        return "Search for movies or TV series";
    }
  };

  // Debounced search function
  const performSearch = useMemo(
    () =>
      debounce(async (searchTerm) => {
        if (searchTerm.length > 2) {
          // Searching only if the search term is more than 2 characters
          setLoading(true);
          setSearched(true);
          setSearch(true);
          try {
            let searchResults;
            // Fetching search results based on the current path
            switch (location.pathname) {
              case "/movies":
                searchResults = await searchMovies(searchTerm);
                if (searchResults.length === 0) {
                  toast.error("No movies found");
                }
                break;
              case "/tvseries":
                searchResults = await searchTVSeries(searchTerm);
                if (searchResults.length === 0) {
                  toast.error("No tv series found");
                }
                break;
              case "/bookmarks":
                const token = localStorage.getItem("token");
                if (isAuthenticated && token) {
                  const filteredMovies = movieBookmarks.filter((movie) =>
                    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
                  );
                  const filteredTVSeries = tvSeriesBookmarks.filter(
                    (tvSeries) =>
                      tvSeries.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  );
                  searchResults = [...filteredMovies, ...filteredTVSeries];
                  if (searchResults.length === 0) {
                    toast.error("No bookmarks found");
                  }
                } else {
                  toast.error("You need to be logged in to search bookmarks.");
                  searchResults = [];
                }
                break;
              default:
                searchResults = await searchAll(searchTerm);
                if (searchResults.length === 0) {
                  toast.error("No movies or tv series found");
                }
                break;
            }
            setResults(searchResults || []);
          } catch (error) {
            toast.error("No Results found");
            setResults([]);
          } finally {
            setLoading(false);
          }
        } else {
          setResults([]);
          setSearched(false);
          setSearch(false);
        }
      }, 500), // Debounce time of 500ms
    [
      location.pathname,
      setSearch,
      isAuthenticated,
      movieBookmarks,
      tvSeriesBookmarks,
    ]
  );

  useEffect(() => {
    if (location.pathname !== "/bookmarks" && query === prevQueryRef.current) {
      return; // not re-fetching if the input is the same
    }
    performSearch(query);
    prevQueryRef.current = query;
    return () => {
      performSearch.cancel(); // Cancelling the debounced function on unmount
    };
  }, [query, location.pathname, performSearch]);

  // Clearing the search input and results on route change
  useEffect(() => {
    setQuery("");
    setResults([]);
    setSearch(false);
    setSearched(false);
  }, [location.pathname, setSearch]);

  return (
    <>
      <div className="relative w-full hover:cursor-pointer">
        <input
          type="text"
          placeholder={getPlaceholder()}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full py-4 pl-14 bg-gray-dark focus:outline-none text-lg sm:text-xl text-white caret-red-custom"
        />
        <FaSearch className="text-xl sm:text-2xl text-white absolute  top-1/2 -translate-y-1/2" />
      </div>

      <div className="w-full mt-8">
        {loading ? (
          <motion.div
            className="w-8 h-8 border-4 border-white border-t-gray-dark border-t-4 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        ) : (
          searched &&
          results.length > 0 && (
            <>
              <motion.h1
                className="text-white text-2xl sm:text-3xl font-bold mb-4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                Showing Results for "{query}"
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
              >
                <Media data={results} />
              </motion.div>
            </>
          )
        )}
      </div>
    </>
  );
};

export default Search;
