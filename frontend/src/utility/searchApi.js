import axios from "axios";

// Function to search for movies based on a search term
export const searchMovies = async (searchTerm) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/movies/search/${searchTerm}`,
      {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    // Filtering out movies with null backdrop_path
    const movies = response.data.filter(movie => movie.backdrop_path !== null);
    return movies;
  } catch (error) {
    if (error.response && error.response.status === 404) {
        return []; // Return empty array when no movies found
      }
    console.error("Error fetching movies:", error);
    throw error;
  }
}

// Function to search for TV series based on a search term
export const searchTVSeries = async (searchTerm) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/tv-series/search/${searchTerm}`,
      {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    // Filtering out TV series with null backdrop_path
    const tvSeries = response.data.filter(tv => tv.backdrop_path !== null);
    return tvSeries;
  } catch (error) {
    if (error.response && error.response.status === 404) {
        return []; // Return empty array when no tv series found
      }
    console.error("Error fetching tv series:", error);
    throw error;
  }
}

// Function to search for both movies and TV series based on a search term
export const searchAll = async (searchTerm) => {
    try {
        const [moviesResponse, tvSeriesResponse] = await Promise.all([
          searchMovies(searchTerm),
          searchTVSeries(searchTerm),
        ]);
        
        // Combining the results from both searches
        const combinedResults = [...moviesResponse, ...tvSeriesResponse];
        
        // Throwing an error if no results are found in either category
        if (combinedResults.length === 0) {
          throw new Error("No results found in either category");
        }
    
        return combinedResults; 
      } catch (error) {
        console.error("Error fetching movies and TV series:", error);
        throw error;
      }
};