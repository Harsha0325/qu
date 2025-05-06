import React, { useState } from "react";
import logo from "../../../image/WebPageImages/Quky_logo.svg";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between w-full px-4 py-4 bg-black bg-[radial-gradient(90.16%_143.01%_at_15.32%_21.04%,_rgba(17,_112,_137,_0.2)_0%,_rgba(167,_22,_255,_0.07)_77.08%,_rgba(7,_164,_205,_0)_100%)]">
      {/* Left Side: Logo */}
      <div className="flex items-center gap-4 ">
        <img
          loading="lazy"
          src={logo}
          className="w-[250px] h-[44px] sm:w-[150px] object-contain hover:cursor-pointer"
          alt="QuikyNet logo"
          onClick={() => navigate("/")}
        />
      </div>

      {/* Right Side: Hamburger Menu */}
      <div className="sm:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white focus:outline-none"
        >
          <FaBars size={24} />
        </button>
      </div>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center space-x-4">
        <button
          className="px-4 py-2 text-white text-base font-normal font-['Inter'] 
          rounded-md hover:bg-gradient-to-b hover:from-purple-600 hover:to-blue-800 
          transition-all hover:scale-105 cursor-pointer"
          onClick={() => navigate("/oauth/login")}
        >
          Login
        </button>
        <button
          className="px-4 py-2 text-white text-base font-normal font-['Inter'] 
          rounded-md  
                    hover:bg-gradient-to-b hover:from-purple-600 hover:to-blue-800 

          transition-all hover:scale-105 cursor-pointer"
          onClick={() => navigate("/oauth/signup")}
        >
          Sign Up
        </button>
        <button
          className="px-4 py-2 text-white text-base font-normal font-['Inter'] 
          rounded-md  
                    hover:bg-gradient-to-b hover:from-purple-600 hover:to-blue-800 

          transition-all hover:scale-105 cursor-pointer"
          onClick={() => navigate("/plans")}
        >
          Plans
        </button>
        <div className="flex items-center space-x-2">
          <button
            className="px-4 py-2 text-white text-base font-normal font-['Inter'] 
          rounded-md hover:bg-gradient-to-b hover:from-purple-600 hover:to-blue-800 
          transition-all hover:scale-105 cursor-pointer"
            onClick={() => navigate("/support")}
          >
            Support
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-black bg-[radial-gradient(90.16%_143.01%_at_15.32%_21.04%,_rgba(17,_112,_137,_0.2)_0%,_rgba(167,_22,_255,_0.07)_77.08%,_rgba(7,_164,_205,_0)_100%)] bg-blend-overlay text-white transform transition-transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } sm:hidden z-50`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button
            onClick={() => setMenuOpen(false)}
            className="text-white focus:outline-none"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div className="flex flex-col mt-4 space-y-4 p-4">
          <button
            className="text-left px-4 py-2 hover:bg-gray-700 rounded-md "
            onClick={() => navigate("/oauth/login")}
          >
            Login
          </button>
          <button
            className="text-left px-4 py-2 hover:bg-gray-700 rounded-md "
            onClick={() => navigate("/oauth/signup")}
          >
            Sign Up
          </button>
          <button
            className="text-left px-4 py-2 hover:bg-gray-700 rounded-md "
            onClick={() => navigate("/plans")}
          >
            Plans
          </button>
          <div
            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-700 rounded-md"
            onClick={() => navigate("/support")}
          >
            <span>Support</span>
          </div>
        </div>
      </div>

      {/* Overlay for Closing Menu */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 sm:hidden z-40"
        />
      )}
    </header>
  );
};

export default NavBar;
