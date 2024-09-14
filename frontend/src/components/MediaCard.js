import React, { useState, useEffect } from "react";
import { FaBookmark, FaRegBookmark, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addBookmarkThunk,
  removeBookmarkThunk,
} from "../redux/features/bookmarksSlice";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdLocalMovies } from "react-icons/md";
import { TbDeviceTvOld } from "react-icons/tb";

const MediaCard = ({ item, isTrending }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const mediaType = item.title ? "movies" : "tv-series";

  const bookmarks = useSelector((state) => state.bookmarks);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated && token) {
      // Checking if the item is bookmarked based on the media type
      const isBookmarked =
        mediaType === "movies"
          ? bookmarks.movieBookmarks.some((bookmark) => bookmark.id === item.id)
          : bookmarks.tvSeriesBookmarks.some(
              (bookmark) => bookmark.id === item.id
            );
      setIsBookmarked(isBookmarked);
    } else {
      setIsBookmarked(false);
    }
  }, [isAuthenticated, token, bookmarks, item.id, mediaType]);

  const handleClick = () => {
    // Navigating to the details page based on the media type by checking the title property
    navigate(item.title ? `/movies/${item.id}` : `/tvseries/${item.id}`);
  };

  const handleBookmarkToggle = async () => {
    if (isAuthenticated && token) {
      // Toggling the bookmark based on the current state
      if (isBookmarked) {
        try {
          const result = await dispatch(
            removeBookmarkThunk({ itemId: item.id, token, mediaType })
          ).unwrap();
          if (result) {
            toast.success("Bookmark removed");
          }
        } catch (error) {
          toast.error("Failed to remove bookmark. Please try again.");
        }
      } else {
        try {
          const result = await dispatch(
            addBookmarkThunk({ itemId: item.id, token, mediaType })
          ).unwrap();
          if (result) {
            toast.success("Bookmark added");
          }
        } catch (error) {
          toast.error("Failed to add bookmark. Please try again.");
        }
      }
    } else {
      toast.error("Please login to bookmark");
    }
  };

  return (
    <div key={item.id} className="relative">
      <div className="relative group">
        
        {/* Image */}
        <LazyLoadImage
          src={`https://image.tmdb.org/t/p/w780${item.backdrop_path}`}
          alt={item.title || item.name}
          placeholderSrc={`https://image.tmdb.org/t/p/w200${item.backdrop_path}`}
          className="w-full h-full object-cover rounded-lg group-hover:opacity-80 transition-opacity duration-300"
        />

        {/* Play Button Overlay */}
        <div className="absolute z-10 inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div
            className="bg-gray-400 bg-opacity-50 text-white px-3 py-2 sm:px-3 sm:py-2 rounded-full flex items-center space-x-4 cursor-pointer shadow-md"
            onClick={handleClick}
          >
            <div className="p-2 bg-white rounded-full text-gray-400 flex justify-center items-center">
              <FaPlay className="text-sm sm:text-md" />
            </div>
            <span className="text-sm sm:text-lg font-semibold">Play</span>
          </div>
        </div>
      </div>

      {/* Bookmark Icon */}
      <div
        onClick={handleBookmarkToggle}
        className="absolute z-20 top-2 sm:top-4 right-2 sm:right-4 bg-gray-mid p-1 sm:p-2 rounded-full cursor-pointer bg-opacity-70 hover:bg-white text-white hover:text-gray-mid"
      >
        {isBookmarked ? (
          <FaBookmark className="text:md sm:text-lg" />
        ) : (
          <FaRegBookmark className="text:md sm:text-lg" />
        )}
      </div>

      {/* Movie Info */}
      <div
        className={`mt-2 text-white ${
          isTrending
            ? "absolute inset-0 p-2 sm:p-4 rounded-lg flex flex-col justify-end bg-gradient-to-t from-black via-transparent to-transparent"
            : ""
        }`}
      >
        <p className="text-gray-400 text-sm sm:text-md mb-1 whitespace-nowrap flex items-center">
          {item.release_date
            ? item.release_date.split("-")[0]
            : item.first_air_date
            ? item.first_air_date.split("-")[0]
            : "N/A"}
          {" • "}
          {item.title ? (
            <>
              <MdLocalMovies className="inline-block text-gray-400 mx-1" />
              Movie
            </>
          ) : (
            <>
              <TbDeviceTvOld className="inline-block text-gray-400 mx-1" />
              TV Series
            </>
          )}
          <span className="hidden sm:inline-block">
            {" • "}
            {item.adult ? "R" : "PG"}
          </span>
        </p>
        <h2 className="text-white text-md sm:text-lg font-bold truncate">
          {item.title || item.name}
        </h2>
      </div>
    </div>
  );
};

export default MediaCard;