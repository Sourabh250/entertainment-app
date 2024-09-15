import axios from "axios";

export const logout = async () => {
  try {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/api/auth/logout`,
      {},
      { withCredentials: true }
    ); // Making a POST request to the logout endpoint
  } catch (error) {
    console.error("Error during logout:", error);
  }
};