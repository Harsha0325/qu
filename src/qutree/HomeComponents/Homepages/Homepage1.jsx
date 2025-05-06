import React from 'react';
import { motion } from 'framer-motion';
import logo from '../../../image/QuikynetLogo.svg';
import mobile from '../../../image/HomeImages/frame1.svg';
import designIcon from '../../../image/HomeImages/design.png'; // Keep this one
import shareIcon from '../../../image/HomeImages/share.png'; // Keep this one
import manageIcon from '../../../image/HomeImages/manage.png'; // Keep this one
import client3 from '../../../image/footer/client3.png';
import client1 from '../../../image/footer/client1.png';
import client2 from '../../../image/footer/client2.png';
import { Link } from 'react-router-dom';
// import bgImg from '../../../image/footer/FBG.png';

// Remove the duplicate imports below:
// import designIcon from "@/image/HomeImages/design.png";
// import shareIcon from "@/image/HomeImages/share.png";
// import manageIcon from "@/image/HomeImages/manage.png";

function Homepage1() {
  return (
    <div className="bg-gradient-to-br from-[#2b0a3d] to-[#013148] text-white h-screen flex flex-col overflow-hidden">
      
      {/* Navbar */}
      <header className="px-6 py-4 flex justify-between items-center bg-black rounded-b-[30px]">
        <motion.img 
          src={logo} 
          alt="Logo" 
          className="w-[180px] h-auto max-h-[60px]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        />
        <motion.div 
          className="flex space-x-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button className="text-white border border-white px-6 py-1 rounded-full hover:bg-white hover:text-black transition">Login</button>
          <button className="bg-white text-black px-6 py-1 rounded-full hover:bg-purple-700 hover:text-white transition">Sign Up</button>
        </motion.div>
      </header>
  
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-between px-6 py-4">
        
        {/* Left */}
 {/* Left Content - Adjusted to match image layout */}
<motion.div 
  className="flex-1 flex flex-col items-center md:items-start px-4"
  initial={{ opacity: 0, x: -50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
>
  {/* Main Heading - Centered in image */}
  <div className="text-center md:text-left w-full">
    <h1 className="text-2xl md:text-4xl font-semibold leading-tight">
      Digital Business Cards<br />for the Modern Professional
    </h1>
    <p className="text-sm mt-2 mb-6 md:mb-8">
      Design, share, and manage your digital business card with QuikyNet.
    </p>
  </div>

  <div
  style={{ backgroundImage: `url(${bgImg})` }}
  className="bg-cover bg-center h-screen"
>
  {/* Content */}
</div>


  {/* <div className="flex justify-center gap-8 md:gap-12 w-full my-4 md:my-6">
    <motion.div
      className="flex flex-col items-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <img src={designIcon} alt="Design" className="w-14 h-14 mb-2" />
      <span className="text-sm font-medium">Design</span>
    </motion.div>
    <motion.div
      className="flex flex-col items-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <img src={manageIcon} alt="Manage" className="w-14 h-14 mb-2" />
      <span className="text-sm font-medium">Manage</span>
    </motion.div>
  </div> */}

  {/* CTA Button - Matches image position */}
  <div className="w-full flex flex-col items-center md:items-start mt-6">
    <motion.button 
      className="bg-white text-black px-8 py-3 rounded-full hover:bg-gray-200 transition-colors font-medium"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      Get your Digital Business Card
    </motion.button>
    
    {/* App Store Buttons - Positioned as in image */}
    <div className="flex gap-3 mt-5">
      <motion.button 
        className="bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium"
        whileHover={{ scale: 1.03 }}
      >
        Google Play
      </motion.button>
      <motion.button 
        className="bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium"
        whileHover={{ scale: 1.03 }}
      >
        Apple Store
      </motion.button>
    </div>
  </div>
</motion.div> 
  
       {/* Right Section - Mobile with floating icons */}
<motion.div 
  className="flex-1 flex justify-center items-center relative px-6 py-4"
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6, delay: 0.3 }}
>
  {/* Mobile Image */}
  <img src={mobile} alt="Mobile" className="w-[350px] h-auto rounded-[30px]" />

  {/* Share Icon - Top Right */}
  <motion.div
    className="absolute top-1/4 pl-4 right-[-40px] flex flex-col items-center"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
  >
    <img src={shareIcon} alt="Share" className="w-12 h-12 mb-2 pl-2  " />
    <span className="text-sm font-medium">Share</span>
  </motion.div>

  {/* Left Icons - Design and Manage */}
  <div className="absolute left-[-60px] top-1/4 flex flex-col space-y-8 items-center">
    <motion.div
      className="flex flex-col items-center"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <img src={designIcon} alt="Design" className="w-14 h-14 mb-1" />
      <span className="text-sm font-medium">Design</span>
    </motion.div>
    <motion.div
      className="flex flex-col items-center"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <img src={manageIcon} alt="Manage" className="w-14 h-14 mb-1" />
      <span className="text-sm font-medium">Manage</span>
    </motion.div>
  </div>
</motion.div>

      </div>
  
      {/* Footer/Partners + Link */}
      <motion.div 
        className="flex items-center justify-between px-8 py-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex gap-6 items-center opacity-90">
          <img src={client3} alt="Zoho" className="h-10" />
          <img src={client2} alt="CRM" className="h-10" />
          <img src={client1} alt="Google" className="h-10" />
        </div>
        <Link to="/Homepage2" className="bg-white text-black px-4 py-1 rounded-full hover:bg-purple-700 hover:text-white transition text-sm">
          Next Page
        </Link>
      </motion.div>

    </div>
  );
}

export default Homepage1;
