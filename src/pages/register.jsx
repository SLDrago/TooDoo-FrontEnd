import React, { useState, useEffect } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import ValidateError from "../components/validateError";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { encrypt } from "../utils/cryptoUtils";

const validateName = (value) => {
  return value ? null : "Name is required";
};

const validateEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? null
    : "Invalid email format";
};

const validatePassword = (value) => {
  if (!value) {
    return "Password is required";
  }
  if (value.length < 8) {
    return "Password must be at least 8 characters";
  }
  return null;
};

const validateConfirmPassword = (password, confirmPassword) => {
  return password === confirmPassword ? null : "Passwords do not match";
};

const apiUrl = import.meta.env.VITE_API_URL;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [passwordConfirmError, setPasswordConfirmError] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);
    const nameValidationError = validateName(name);
    const passwordConfirmValidationError = validateConfirmPassword(
      password,
      confirmPassword
    );

    if (
      emailValidationError ||
      passwordValidationError ||
      nameValidationError ||
      passwordConfirmValidationError
    ) {
      setEmailError(emailValidationError);
      setPasswordError(passwordValidationError);
      setNameError(nameValidationError);
      setPasswordConfirmError(passwordConfirmValidationError);
      setLoading(false);
      return;
    }

    try {
      const response = await toast.promise(
        axios.post(`${apiUrl}/api/register`, {
          name,
          email,
          password,
        }),
        {
          pending: "Registering ...",
          success: "Registration successful!",
          error: {
            render({ data }) {
              return data.response?.data?.message || "Registration failed!";
            },
          },
        }
      );

      const encryptedToken = encrypt(response.data.token);
      const name2 = response.data.name;

      Cookies.set("token", encryptedToken, {
        secure: true,
        expires: 7,
      });
      Cookies.set("name", name2, {
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
          <div className="text-4xl font-bold mb-1">Join our App</div>
          <div className="text-sm font-extralight mb-4">Create new account</div>

          <div className="w-full">
            <form className="w-full" onSubmit={handleRegister}>
              <div className="mb-4">
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  className="w-full border-2 border-gray-300 rounded-md px-2 py-2"
                  value={name}
                  onChange={(e) => {
                    const value = e.target.value;
                    setName(value);
                  }}
                />
                {nameError && <ValidateError error={nameError} />}
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full border-2 border-gray-300 rounded-md px-2 py-2"
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
                    className="w-full border-2 border-gray-300 rounded-md px-2 py-2"
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
              <div className="mb-4">
                <div className="relative">
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    id="confpassword"
                    name="confpassword"
                    placeholder="Confirm your password"
                    className="w-full border-2 border-gray-300 rounded-md px-2 py-2"
                    value={confirmPassword}
                    onChange={(e) => {
                      const value = e.target.value;
                      setConfirmPassword(value);
                    }}
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
                {passwordConfirmError && (
                  <ValidateError error={passwordConfirmError} />
                )}
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
