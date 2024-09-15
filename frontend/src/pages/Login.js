import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/features/authSlice";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdMovie } from "react-icons/md";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Function to handle submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Preventing the default form submission behavior
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        dispatch(login());
        toast.success(`${response.data.message}. Redirecting to home page...`);
        setEmail("");
        setPassword("");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        toast.error(response.data.message || "An error occurred");
      }
    } catch (err) {
      if (err.response && err.response.data.errors) {
        const errors = err.response.data.errors.map((error) => error.msg);
        console.log(errors);
        errors.forEach((error) => toast.error(error));
      } else if (err.response && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-dark p-4 font-outfit">
      <div className="relative flex flex-col items-center">
        <MdMovie className="text-4xl lg:text-5xl text-red-custom absolute -top-28" />
      </div>
      <div className="w-full max-w-md p-8 bg-gray-mid text-white rounded-lg shadow-lg">
        <h2 className="text-3xl mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email input */}
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="block w-full px-4 py-3 border-b border-gray-400  focus:outline-none focus:ring-gray-light focus:border-gray-light sm:text-sm bg-gray-mid rounded-none"
          />
          {/* Password input */}
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="mt-1 block w-full px-4 py-3 border-b border-gray-400  focus:outline-none focus:ring-gray-light focus:border-gray-light sm:text-sm bg-gray-mid rounded-none"
          />
          {/* Submit button */}
          <button
            type="submit"
            className="w-full mt-6 py-3 px-4 bg-red-custom text-white rounded-lg shadow-md hover:bg-white hover:text-gray-mid focus:outline-none focus:ring-2 focus:ring-gray-light focus:ring-opacity-50"
          >
            Login to your account
          </button>
        </form>
        {/* Link to signup page */}
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-red-custom hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;