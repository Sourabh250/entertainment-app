import React from "react";
import { FaBorderAll, FaBookmark } from "react-icons/fa";
import { MdLocalMovies, MdMovie } from "react-icons/md";
import { TbDeviceTvOld } from "react-icons/tb";
import { IoIosLogIn, IoIosLogOut } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../redux/features/authSlice";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();


  const handleLogout = () => {
    localStorage.removeItem("token"); // Clearing token from local storage
    dispatch(logoutThunk()); // Dispatching the logout thunk
  };

  return (
    <div className="bg-gray-mid lg:h-full lg:w-28 w-full rounded-lg flex  lg:flex-col items-center justify-between lg:justify-center p-4 gap-4 lg:gap-8 flex-shrink-0">
      <MdMovie className="text-3xl lg:text-4xl text-red-custom" />

      {/* Navigation links */}
      <div className="flex lg:flex-col gap-4 lg:gap-8 lg:mt-16">

        {/* Home link */}
        <NavLink to="/" className={({ isActive }) => `text-xl lg:text-2xl ${isActive ? 'text-white' : 'text-gray-light' } hover:text-red-custom` }>
          <FaBorderAll />
        </NavLink>

        {/* Movies link */}
        <NavLink to="/movies" className={({ isActive }) => `text-xl lg:text-2xl ${isActive ? 'text-white' : 'text-gray-light' } hover:text-red-custom` }>
          <MdLocalMovies />
        </NavLink>

        {/* TV Series link */}
        <NavLink to="/tvseries" className={({ isActive }) => `text-xl lg:text-2xl ${isActive ? 'text-white' : 'text-gray-light' } hover:text-red-custom` }>
          <TbDeviceTvOld />
        </NavLink>

        {/* Bookmarks link */}
        <NavLink to="/bookmarks" className={({ isActive }) => `text-xl lg:text-2xl ${isActive ? 'text-white' : 'text-gray-light' } hover:text-red-custom` }>
          <FaBookmark />
        </NavLink>
      </div>

      {/* Conditional rendering for login/logout */}
      {isAuthenticated ? (
        <button onClick={handleLogout} className="flex items-center text-3xl lg:text-4xl text-red-custom hover:text-white lg:mt-auto">
          <IoIosLogOut className="lg:mr-1" />
          <span className="hidden lg:block text-sm font-semibold">Logout</span>
        </button>
      ) : (
        <NavLink to="/login" className="text-3xl lg:text-4xl text-red-custom lg:mt-auto">
          <IoIosLogIn />
        </NavLink>
      )}
    </div>
  );
};

export default Sidebar;