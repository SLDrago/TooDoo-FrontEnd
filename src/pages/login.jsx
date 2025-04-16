import React, { useState, useEffect } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import ValidateError from "../components/validateError";
import { encrypt } from "../utils/cryptoUtils";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = Cookies.get("token");

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const validateEmail = (value) => {
    if (!value) {
      return "Email is required.";
    }
    if (!/\S+@\S+\.\S+/.test(value)) {
      return "Please enter a valid email address.";
    }
    return null;
  };

  const validatePassword = (value) => {
    if (!value) {
      return "Password is required.";
    }
    if (value.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    if (emailValidationError || passwordValidationError) {
      setEmailError(emailValidationError);
      setPasswordError(passwordValidationError);
      setLoading(false);
      return;
    }

    try {
      const response = await toast.promise(
        axios.post(`${apiUrl}/api/login`, { email, password }),
        {
          pending: "Logging in...",
          success: "Logged in successfully!",
          error: {
            render({ data }) {
              return data.response?.data?.message || "Registration failed!";
            },
          },
        }
      );

      const encryptedToken = encrypt(response.data.token);
      const name = response.data.name;

      Cookies.set("token", encryptedToken, {
        secure: true,
        expires: 7,
      });
      Cookies.set("name", name, {
        secure: true,
        expires: 7,
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-blue-50">
        <div className="container flex flex-col items-center justify-center w-full max-w-md m-9 border-2 border-gray-300 rounded-md shadow-lg bg-white py-20 px-10">
          <div className="text-4xl font-bold mb-1">Welcome Back!</div>
          <div className="text-sm font-extralight mb-4">
            Login to your account
          </div>

          <div className="w-full">
            <form className="w-full" onSubmit={handleLogin}>
              <div className="mb-4">
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  className={`w-full border-2 ${
                    emailError ? "border-red-400" : "border-gray-300"
                  } rounded-md px-2 py-2`}
                  value={email}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEmail(value);
                  }}
                />
                {emailError && <ValidateError error={emailError} />}
              </div>
              <div className="mb-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    required
                    className={`w-full border-2 ${
                      passwordError ? "border-red-400" : "border-gray-300"
                    } rounded-md px-2 py-2`}
                    value={password}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPassword(value);
                    }}
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
                {passwordError && <ValidateError error={passwordError} />}
              </div>
              <button
                type="submit"
                className="w-full bg-gray-800 py-2 px-5 rounded hover:bg-gray-900 text-white font-bold cursor-pointer"
                disabled={loading}
              >
                Login
              </button>
            </form>
          </div>

          <div className="text-sm font-extralight mt-4">
            Don't have an account?{" "}
            <NavLink to="/register" className="text-blue-500">
              Register
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
