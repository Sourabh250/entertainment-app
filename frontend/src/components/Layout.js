import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../redux/features/authSlice";
import { fetchBookmarks } from "../redux/features/bookmarksSlice";
import { isTokenValid } from "../utility/bookmarkApi";
import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import Search from "./Search";

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

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        try {
          const valid = await isTokenValid(token); // Waiting for the token validity check
          if (!valid) {
            dispatch(logoutThunk()); // Logging out if the token is expired or invalid
          }
        } catch (error) {
          console.error("Error while checking token validity:", error);
          dispatch(logoutThunk()); // Handling the case where an error occurred while validating token
        }
      } else {
        dispatch(logoutThunk()); // Logging out if no token exists
      }
    };
  
    checkToken();
  }, [dispatch, token]);

  useEffect(() => {
    if ( isAuthenticated && token && status === 'idle') {
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