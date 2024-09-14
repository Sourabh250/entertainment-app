import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { FaLink, FaImdb } from "react-icons/fa6";
import { fetchDetail } from "../utility/fetchApi";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Detail = ({ type }) => {
  const { id } = useParams(); // Getting the ID from the URL parameters
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchDetail(type, id); // Fetch data from API
        setError("");
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, type]);

  // Memoizing language names to avoid recalculating on every render
  const languageNames = useMemo(
    () => new Intl.DisplayNames(["en"], { type: "language" }),
    []
  );
  
  // Determining if the type is movie
  const isMovie = useMemo(() => type === "movies", [type]);

  // Variants for Framer Motion animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: {
        duration: 0.2,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

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

  if (error) {
    return (
      <div className="text-red-custom text-center mt-4">
        Unable to fetch info from server
      </div>
    );
  }

  if (!data) {
    return <div className="text-center mt-4">No details found.</div>;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="container mx-auto flex flex-col lg:flex-row justify-center lg:gap-10 gap-8 lg:h-full py-4 lg:py-8"
    >
      <motion.div 
        variants={imageVariants}
        className="w-full lg:w-2/6 flex justify-center mb-6 lg:mb-0">
        <LazyLoadImage
          src={`https://image.tmdb.org/t/p/w780${data.poster_path}`}
          placeholderSrc={`https://image.tmdb.org/t/p/w600${data.poster_path}`}
          alt={isMovie ? data.title : data.name}
          className="object-fit rounded-lg mb-4 lg:w-[500px] lg:h-[600px] md:w-[400px] md:h-[500px] h-[300px] w-[400px]"
         />
      </motion.div>
      <motion.div
        variants={contentVariants}
         className="flex flex-col items-start gap-4 lg:gap-8 justify-between  lg:w-4/6 text-white">
        <h1 className="text-2xl md:text-3xl font-bold">
          {isMovie ? data.title : data.name}
        </h1>
        {isMovie && data.tagline && (
          <h2 className="text-lg md:text-xl text-gray-light">{data.tagline}</h2>
        )}
        <div className="flex items-center justify-center">
          <span className="text-2xl md:text-3xl mr-3">
            {(data.vote_average / 2).toFixed(1)}
          </span>
          <StarRatings
            rating={data.vote_average / 2}
            starRatedColor="white"
            starDimension="18px"
            starSpacing="1px"
            numberOfStars={5}
            name="rating"
            starEmptyColor="gray"
          />
        </div>
        <div className="flex w-full gap-4 flex-wrap sm:flex-nowrap">
          {isMovie ? ( // Conditional rendering based on type is movie or not
            <>
              <div className="sm:w-1/4">
                <strong>Length</strong>
                <p className="mt-2">{data.runtime || "N/A"} min.</p>
              </div>
              <div className="sm:w-1/4">
                <strong>Language</strong>
                <p className="mt-2">
                  {languageNames.of(data.original_language) ||
                    data.original_language}
                </p>
              </div>
              <div className="sm:w-1/4">
                <strong>Year</strong>
                <p className="mt-2">{data.release_date ? data.release_date.split("-")[0] : "N/A"}</p>
              </div>
              <div className="sm:w-1/4">
                <strong>Status</strong>
                <p className="mt-2">{data.status || "N/A"}</p>
              </div>
            </>
          ) : (
            <>
              <div className="sm:w-1/4">
                <strong>Language</strong>
                <p className="mt-2">
                  {languageNames.of(data.original_language) ||
                    data.original_language}
                </p>
              </div>
              <div className="sm:w-1/4">
                <strong>First Air</strong>
                <p className="mt-2">{data.first_air_date || "N/A"}</p>
              </div>
              <div className="sm:w-1/4">
                <strong>Last Air</strong>
                <p className="mt-2">{data.last_air_date || "N/A"}</p>
              </div>
              <div className="sm:w-1/4">
                <strong>Status</strong>
                <p className="mt-2">{data.status  || "N/A"}</p>
              </div>
            </>
          )}
        </div>
        <div>
          <strong>Genres</strong>
          <div className="flex flex-wrap gap-2 items-center mt-2">
            {data.genres.map((genre) => (
              <div key={genre.id} className="bg-white text-gray-dark rounded-md">
                <p className="px-2">{genre.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <strong>Synopsis</strong>
          <p className="mt-2">{data.overview ? data.overview : "N/A"}</p>
        </div>
        <div>
          <strong>Casts</strong>
          <div className="flex flex-wrap gap-2 items-center mt-2">
            {data.credits.cast.length > 0 ? ( 
              data.credits.cast.map((cast) => (
                <div key={cast.id} className="rounded-md border">
                  <p className="px-2">{cast.name}</p>
                </div>
              ))
            ) : (
              <p>N/A</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {data.homepage && data.homepage !== "N/A" && (
            // Conditional rendering based on the presence of homepage
            <a
              href={data.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <button
                type="button"
                className="px-8 py-3 bg-gray-light text-white rounded-md hover:text-gray-dark hover:bg-white flex gap-4 items-center justify-center"
              >
                Website
                <FaLink className="inline-block text-xl" />
              </button>
            </a>
          )}
          {isMovie && data.imdb_id && data.imdb_id !== "N/A" && (
            // Conditional rendering based on the presence of IMDB ID
            <a
              href={`https://www.imdb.com/title/${data.imdb_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <button
                type="button"
                className="px-8 py-3 bg-gray-light text-white rounded-md hover:text-gray-dark hover:bg-white flex gap-4 items-center justify-center"
              >
                IMDB
                <FaImdb className="inline-block text-xl bg-white text-gray-dark" />
              </button>
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Detail;