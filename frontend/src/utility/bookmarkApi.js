import axios from "axios";

// Function to check if the token is valid by sending a request to the user profile endpoint
export const isTokenValid = async (token) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
      headers: {
        "x-access-token": token, // Setting the token in the request headers
      },
    });
    return response.status === 200; // Token is valid if status is 200
  } catch (error) {
    console.error("Token is invalid or expired:", error);
    localStorage.removeItem("token"); // Removing the token from local storage if the token is invalid or expired
    return false; // Token is invalid or expired
  }
};

// Function to fetch bookmarks for the user
export const getBookmarks = async (token) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/user/bookmark`,
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    localStorage.removeItem("token");
    throw error;
  }
};

// Function to add a bookmark
export const addBookmark = async (itemId, token, mediaType ) => {
  try {
    const isMovie = mediaType === 'movies';
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/user/bookmark`,
      { itemId, isMovie },
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding bookmark:", error);
    localStorage.removeItem("token");
    throw error;
  }
};

// Function to remove a bookmark
export const removeBookmark = async (itemId, token, mediaType) => {
  try {
    const isMovie = mediaType === 'movies';
    const response = await axios.delete(
      `${process.env.REACT_APP_API_URL}/api/user/bookmark`,
      {
        data: { itemId, isMovie },
        headers: {
          "x-access-token": token, 
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error removing bookmark:", error);
    localStorage.removeItem("token");
    throw error;
  }
};