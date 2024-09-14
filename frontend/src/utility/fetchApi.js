import axios from 'axios';

// Function to fetch details of a specific movie/tv series based on its type and ID
export const fetchDetail = async (type, id) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/${type}/details/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${type} details:`, error);
    throw error;
  }
};