import React from "react";
import frame1 from "../../../../image/HomeImages/frame1.svg";
import homeframe4 from "../../../../image/HomeImages/homeframe4.svg";
import homeframe5 from "../../../../image/HomeImages/homeframe5.svg";
import homeframe6 from "../../../../image/HomeImages/homeframe5.svg";
import homeframe7 from "../../../../image/HomeImages/homeframe4.svg";

import metal_card1 from "../../../../image/MetalCard/metal_card1.png";
import metal_card2 from "../../../../image/MetalCard/metal_card2.png";
import metal_card3 from "../../../../image/MetalCard/metal_card3.png";
import metal_card_back1 from "../../../../image/MetalCard/metal_card_back1.png";
import metal_card_back2 from "../../../../image/MetalCard/metal_card_back2.png";
import metal_card_back3 from "../../../../image/MetalCard/metal_card_back3.png";
import keychain from "../../../../image/MetalCard/keychain.png";

const HomeDesktop2 = () => {
  return (
    <>
      <div className="relative bg-cover bg-center flex items-center justify-center scrollbar-hide mt-20 mb-20">
        <div className=" scrollbar-hide w-2/3 lg:h-[65%] 2xl:h-[75%]">
          <div
            className={`section relative flex flex-col items-center justify-center`}
          >
            <div className="text-white text-4xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-7xl font-semibold md:mb-2 pb-1 ">
              Viola!
            </div>

            <div>
              <img
                src={frame1}
                alt="Card Frame"
                className="w-full md:h-[300px] lg:h-[320px] xl:h-[300px] 2xl:h-[480px] max-w-[330px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] lg:mt-1"
              />
            </div>

            <div className="text-white text-center text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-[42px]  mt-5 px-4 sm:px-8 font-semibold">
              <p>
                {" "}
                That’s it.. Your personalized{" "}
                <span className="text-[#05CDFF]">Digital business card</span> is
                now
              </p>
              <p> live and ready to impress.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative  bg-cover bg-center flex items-center justify-center  scrollbar-hide mt-6 mb-20">
        <div className=" scrollbar-hide lg:w-[79%] xl:w-[78%] 2xl:w-[68%] lg:h-[64%] xl:h-[75%] 2xl:h-[80%] ">
          <div
            className={`section relative flex flex-col items-center justify-center`}
          >
            <div className="text-white text-4xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-7xl font-semibold md:mb-2 lg:mb-8 xl:mb-8 2xl:m-10  text-center lg:mt-5  xl:mt-6 2xl:mt-8">
              Choose the theme That Suits YOU!
            </div>

            <div className="flex justify-center items-center gap-4 flex-wrap md:flex-nowrap lg:mt-12 2xl:mt-5">
              <div className="w-1/5 sm:w-1/4 md:w-1/4 lg:w-1/5 xl:w-1/6">
                <img
                  src={homeframe4}
                  alt="Card Example 1"
                  className="h-auto max-h-[200px] md:max-h-[250px] lg:max-h-[215px] xl:max-h-[350px] xl:max-w-[160px] 2xl:h-[500px]"
                />
              </div>

              {/* Image 2 */}
              <div className="w-1/6 sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/5">
                <img
                  src={homeframe5}
                  alt="Card Example 2"
                  className="h-auto max-h-[250px] md:max-h-[300px] lg:max-h-[220px] xl:max-h-[330px]  2xl:max-h-[500px] max-w-[250px] md:max-w-[300px] lg:max-w-[170px] xl:max-w-[200px]"
                />
              </div>

              {/* Image 3 */}
              <div className="w-3/6 sm:w-1/2 md:w-1/2 lg:w-2/6 xl:w-1/4 2xl:w-1/2">
                <img
                  src={frame1}
                  alt="Card Example 3"
                  className="h-auto max-h-[300px] md:max-h-[400px] lg:max-h-[300px] xl:max-h-[400px] 2xl:max-h-[480px] max-w-[250px] md:max-w-[300px] lg:max-w-[220px] xl:max-w-[330px]"
                />
              </div>

              {/* Image 4 */}
              <div className="w-1/6 sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/5">
                <img
                  src={homeframe6}
                  alt="Card Example 4"
                  className="h-auto max-h-[250px] md:max-h-[300px] lg:max-h-[220px] xl:max-h-[330px]  2xl:max-h-[500px]  max-w-[250px] md:max-w-[300px] lg:max-w-[170px] xl:max-w-[200px]"
                />
              </div>

              {/* Image 5 */}
              <div className="w-1/5 sm:w-1/4 md:w-1/4 lg:w-1/5 xl:w-1/6">
                <img
                  src={homeframe7}
                  alt="Card Example 5"
                  className="h-auto max-h-[200px] md:max-h-[250px] lg:max-h-[200px] xl:max-h-[350px] xl:max-w-[160px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="text-white text-4xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-5xl font-semibold md:mb-2 lg:mb-8 xl:mb-8 2xl:m-10  text-center lg:mt-5  xl:mt-6 2xl:mt-8">
          Explore the New Era of Digital Networking with Quikynet
        </div>
        <p className="mt-3 text-md text-gray-400 italic text-center">
          "Step Into the Future of Networking"
        </p>

        <div className="flex justify-center items-center gap-6 p-6">
          {/* Main container */}
          <div className="flex gap-4  h-[500px]">
            {/* First sub-div */}
            <div className="w-[300px] hover:h-[370px] h-[350px] bg-[#ffff] rounded-[12px] shadow-lg flex flex-col justify-between overflow-hidden p-2 group">
              <div className="w-[280px] h-[180px] bg-[#0f0f17] rounded-[12px] shadow-lg flex flex-col justify-between overflow-hidden relative">
                <img
                  src={metal_card1}
                  alt="Card Frame"
                  className="w-full h-full transition-transform duration-300 group-hover:scale-0"
                />
                <img
                  src={metal_card_back1}
                  alt="Card Back"
                  className="absolute top-0 left-0 w-full h-full transition-transform duration-300 group-hover:scale-100 opacity-0 group-hover:opacity-100"
                />
              </div>
              <div className="text-[#000000] text-2xl font-bold text-center font-inter pt-4">
                Black Gold
              </div>
              <div className="text-[#727272] text-xl text-center">
                Metal Card
              </div>
              <div className="text-[#727272] text-sm text-center hover:pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Made from stainless steel and laser-engraved, this card demands
                attention. Gold and Silver cards are engraved in black. Black
                cards will be engraved showing the stainless steel.
              </div>
            </div>

            {/* Second sub-div */}
            <div className="w-[300px] hover:h-[370px] h-[350px] bg-[#ffff] rounded-[12px] shadow-lg flex flex-col justify-between overflow-hidden p-2 group">
              <div className="w-[280px] h-[180px] bg-[#ffff] rounded-[12px] shadow-lg flex flex-col justify-between overflow-hidden relative">
                <img
                  src={metal_card2}
                  alt="Card Frame"
                  className="w-full h-full transition-transform duration-300 group-hover:scale-0"
                />
                <img
                  src={metal_card_back2}
                  alt="Card Back"
                  className="absolute top-0 left-0 w-full h-full transition-transform duration-300 group-hover:scale-100 opacity-0 group-hover:opacity-100"
                />
              </div>
              <div className="text-[#000000] text-2xl font-bold text-center font-inter pt-4">
              Glacier 
              </div>
              <div className="text-[#727272] text-xl text-center">
                Metal Card
              </div>
              <div className="text-[#727272] text-sm text-center hover:pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Made from stainless steel and laser-engraved, this card demands
                attention. Gold and Silver cards are engraved in black. Black
                cards will be engraved showing the stainless steel.
              </div>
            </div>

            {/* Third sub-div */}
            <div className="w-[300px] hover:h-[370px] h-[350px] bg-[#ffff] rounded-[12px] shadow-lg flex flex-col justify-between overflow-hidden p-2 group">
              <div className="w-[280px] h-[180px] bg-[#ffff] rounded-[12px] shadow-lg flex flex-col justify-between overflow-hidden relative">
                <img
                  src={metal_card3}
                  alt="Card Frame"
                  className="w-full h-full transition-transform duration-300 group-hover:scale-0"
                />
                <img
                  src={metal_card_back3}
                  alt="Card Back"
                  className="absolute top-0 left-0 w-full h-full transition-transform duration-300 group-hover:scale-100 opacity-0 group-hover:opacity-100"
                />
              </div>
              <div className="text-[#000000] text-2xl font-bold text-center font-inter pt-4">
              Quik Silver
              </div>
              <div className="text-[#727272] text-xl text-center">
                Metal Card
              </div>
              <div className="text-[#727272] text-sm text-center hover:pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Made from stainless steel and laser-engraved, this card demands
                attention. Gold and Silver cards are engraved in black. Black
                cards will be engraved showing the stainless steel.
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center mt-2">
          <div className="flex justify-between items-center text-center w-[600px] h-[200px] bg-[#ffff] rounded-[12px] shadow-lg p-2">
            <div className="w-[150px] h-[150px] flex justify-center items-center">
              <img
                src={keychain}
                alt="keychain"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 text-[#000000] text-4xl font-bold text-center font-inter">
              <div>Q-TAG</div>
              <div className="text-[#727272] text-xl text-center pb-4">
                NFC Enabled
              </div>
              <p className="text-center mb-5 text-sm font-normal">
                Your digital business card on a sleek NFC keychain. Instantly
                share your contact details with just a tap, making networking
                easy and modern.
              </p>
            </div>
            <div className="w-[150px] h-[150px] flex justify-center items-center">
              <img
                src={keychain}
                alt="keychain"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeDesktop2;
