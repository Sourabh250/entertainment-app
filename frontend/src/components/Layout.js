import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../redux/features/authSlice";
import { fetchBookmarks } from "../redux/features/bookmarksSlice";
import { isTokenValid } from "../utility/bookmarkApi";
import { logout } from "../utility/authUtils";
import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import Search from "./Search";
import axios from "axios";

const Layout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [search, setSearch] = useState(false);
  const showSearch = ["/", "/movies", "/tvseries", "/bookmarks"].includes(
    location.pathname
  ); // Determining if the search component should be shown based on the current path
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // getting authentication status from the Redux store
  const status = useSelector((state) => state.bookmarks.status); // getting bookmarks status from the Redux store

  const refreshToken = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/refresh-token`,
        {},
        { withCredentials: true }
      ); // Making a POST request to the refresh token endpoint
      const newToken = response.data.token;
      return newToken;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw new Error("Failed to refresh token");
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        try {
          const valid = await isTokenValid(token); // Waiting for the token validity check
          if (!valid) {
            const newToken = await refreshToken(); // Refreshing the token if it is invalid
            if (newToken) {
              localStorage.setItem("token", newToken); // Storing the new token in local storage
            } else {
              await logout(); // Logging out if token refresh fails
              dispatch(logoutThunk());
            }
          }
        } catch (error) {
          console.error("Error while checking token validity or refreshing token:", error);
          await logout(); // Logging out if an error occurred
          dispatch(logoutThunk()); // Handling the case where an error occurred
        }
      } else {
        await logout(); // Logging out if no access token exists
        dispatch(logoutThunk()); // Logging out if no access token exists
      }
    };
  
    checkToken();
  }, [dispatch, token]);

  useEffect(() => {
    if ( isAuthenticated && token && status === 'idle') {
      console.log('Fetching bookmarks');
      dispatch(fetchBookmarks(token)); // Fetching bookmarks if authenticated, token exists, and status is idle
    }
  }, [dispatch, token, status, isAuthenticated]);

  useEffect(() => {
    if (!showSearch) {
      setSearch(false); // Hiding search component if current path does not require it
    }
  }, [location.pathname, showSearch]);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full font-outfit p-8 bg-gray-dark gap-8">
      <Sidebar />
      <div className="flex-1 overflow-auto no-scrollbar">
        {showSearch && <Search setSearch={setSearch} />} {/* Conditionally rendering Search component based on the current path */}
        {!search && <Outlet />} {/* Rendering child components if search is not active */}
      </div>
    </div>
  );
};

export default Layout;