import { useState } from "react";
import todologo from "../assets/logo-big.png";
import dummyprofile from "../assets/145857007_307ce493-b254-4b2d-8ba4-d12c080d6651.svg";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="bg-white text-black py-2 px-4 shadow-md flex items-center justify-between">
      <div className="flex items-center justify-center gap-x-1 text-2xl sm:text-3xl font-semibold font-sans py-2 px-4">
        <img src={todologo} alt="app logo" className="w-8 sm:w-10" />
        TooDoo
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 font-bold text-xl sm:text-2xl">
          Welcome, Guest
        </div>
        <div className="relative">
          <img
            src={dummyprofile}
            alt="profile picture"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full cursor-pointer border-2 border-transparent hover:border-blue-500"
            onClick={() => setIsOpen(!isOpen)}
          />
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
              <ul className="py-2 text-gray-700 text-sm">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500">
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
