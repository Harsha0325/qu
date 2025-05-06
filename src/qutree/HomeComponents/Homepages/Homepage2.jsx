import React from "react";
import logo from "../../../image/QuikynetLogo.svg";
import frame1 from "../../../image/footer/Frame1.png";
import frame2 from "../../../image/footer/Frame2.png";
import frame3 from "../../../image/footer/Frame3.png"; 
import frame4 from "../../../image/footer/Frame4.png"; 
import mobile from '../../../image/HomeImages/frame1.svg';
import { Link } from 'react-router-dom';

function Homepage2() {
  return (
    <div className="h-screen bg-gradient-to-br from-[#0d0d1f] to-[#052c3c] text-white font-sans relative overflow-hidden flex flex-col">

      {/* Header */}
      <header className="py-4 px-6 flex justify-between items-center bg-black rounded-b-[30px] relative">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="QuikyNet Logo" className="w-[180px] max-h-[60px]" />
        </div>

        {/* Center Login/Signup */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-4">
          <button className="text-white border border-white px-6 py-1 rounded-full hover:bg-white hover:text-black transition">Login</button>
          <button className="bg-white text-black px-6 py-1 rounded-full hover:bg-purple-700 hover:text-white transition">Sign Up</button>
        </div>

        {/* Right - Search/Support */}
        <div className="flex space-x-4 items-center">
          <button className="p-2 rounded-full hover:bg-white hover:text-black transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
            </svg>
          </button>
          <button className="text-white px-4 py-1 rounded-full hover:bg-white hover:text-black transition">Support</button>
        </div>
      </header>

      {/* Content Section */}
      <div className="flex-1 flex items-center justify-between px-6 py-4 md:flex-row flex-col gap-4">

        {/* Left - Image */}
        <div className="flex justify-center md:w-1/2">
          <img
            src={mobile}
            alt="Mobile"
            className="rounded-[30px] w-[350px] h-auto"
          />
        </div>

        {/* Right - Text Area */}
        <div className="md:w-1/2 w-full px-4">
          <div className="bg-gradient-to-br from-[#1a3a4a] to-[#132732] rounded-2xl p-4 shadow-xl">
            <h2 className="text-xl font-bold mb-2">What is QuikyNet?</h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              A digital business card is an electronic version of a traditional business card. It’s eco-friendly, customizable, and ideal for networking in the digital age.
            </p>
          </div>
          <button className="mt-4 bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-gray-200 transition">
            Get your Digital Business Card
          </button>
        </div>
      </div>

      {/* Footer/Stats Section */}
      <div className="flex items-center justify-between px-8 pb-6">
        <div className="flex gap-6 items-center opacity-80">
          <img src={frame1} alt="20k+" className="h-8" />
          <img src={frame2} alt="10k+" className="h-8" />
          <img src={frame3} alt="18M+" className="h-8" />
          <img src={frame4} alt="100k+" className="h-8"/>
        </div>
        <Link to="/" className="bg-white text-black px-2 py-1 rounded-full hover:bg-purple-700 hover:text-white transition text-sm">
          Back to Home
        </Link>
      </div>

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0a3d59] to-transparent opacity-30 pointer-events-none z-0"></div>
    </div>
  );
}

export default Homepage2;

