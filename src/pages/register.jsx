import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false);

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-blue-50">
        <div className="container flex flex-col items-center justify-center w-full max-w-md m-9 border-2 border-gray-300 rounded-md shadow-lg bg-white py-20 px-10">
          <div className="text-4xl font-bold mb-1">Join our App</div>
          <div className="text-sm font-extralight mb-4">Create new account</div>

          <div className="w-full">
            <form className="w-full">
              <div className="mb-4">
                <input
                  type="name"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  required
                  className="w-full border-2 border-gray-300 rounded-md px-2 py-2"
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  className="w-full border-2 border-gray-300 rounded-md px-2 py-2"
                />
              </div>
              <div className="mb-4 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  className="w-full border-2 border-gray-300 rounded-md px-2 py-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOffIcon size={20} />
                  ) : (
                    <EyeIcon size={20} />
                  )}
                </button>
              </div>
              <div className="mb-4 relative">
                <input
                  type={showPasswordConfirm ? "text" : "password"}
                  id="confpassword"
                  name="confpassword"
                  placeholder="Confirm your password"
                  required
                  className="w-full border-2 border-gray-300 rounded-md px-2 py-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  {showPasswordConfirm ? (
                    <EyeOffIcon size={20} />
                  ) : (
                    <EyeIcon size={20} />
                  )}
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-gray-800 py-2 px-5 rounded hover:bg-gray-900 text-white font-bold cursor-pointer"
              >
                Sign Up
              </button>
            </form>
          </div>

          <div className="text-sm font-extralight mt-4">
            Do you have an account?{" "}
            <NavLink to="/login" className="text-blue-500">
              Login
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
