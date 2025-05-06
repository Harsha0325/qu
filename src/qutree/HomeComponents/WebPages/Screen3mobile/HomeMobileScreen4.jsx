import React, { useEffect, useState } from "react";
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
const HomeMobileScreen4 = () => {
  const cardFrames = [homeframe4, homeframe5, frame1, homeframe6, homeframe7];
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cardFrames.length);
    }, 2000);

    return () => clearInterval(interval); 
  }, [cardFrames.length]);

  return (
    <div>
      <div className="relative flex flex-col justify-center items-center p-4 h-full">
        <div className="md:mb-2 lg:mb-2 p-4 font-semibold text-6xl text-white sm:text-6xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-9xl">
          Voila!
        </div>
        <div>
          <img
            src={frame1}
            alt="Card Frame"
            className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] h-96"
          />
        </div>
        <div className="mt-6 px-4 sm:px-8 font-semibold text-center text-lg text-white sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-6xl">
          <p>
            That’s it.. Your personalized{" "}
            <span className="text-[#05CDFF]">Digital business card</span> is now
          </p>
          <p>live and ready to impress.</p>
        </div>
      </div>

      <div className="relative flex flex-col justify-center items-center p-4 h-full">
        <div className="md:mb-2 lg:mb-2 p-4 font-semibold text-6xl text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-9xl">
          Voila!
        </div>
        <div>
          <img
            src={cardFrames[currentIndex]}
            alt={`Card Frame ${currentIndex + 1}`}
            className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] h-96"
          />
        </div>
        <div className="flex justify-center space-x-2 mt-6">
          {cardFrames.map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full ${
                index === currentIndex ? "bg-[#00CBFF]" : "bg-white"
              }`}
            />
          ))}
        </div>
        <div className="mt-6 px-4 sm:px-8 font-semibold text-center text-lg text-white sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-6xl">
          <p>Choose the theme That Suits YOU!</p>
        </div>
      </div>

      <div>
        <div className="text-white text-2xl sm:text-2xl md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-5xl font-semibold md:mb-2 lg:mb-8 xl:mb-8 2xl:m-10  text-center lg:mt-5  xl:mt-6 2xl:mt-8">
          Explore the New Era of Digital Networking with Quikynet
        </div>
        <p className="mt-3 text-md text-gray-400 italic text-center">
          "Step Into the Future of Networking"
        </p>

        <div className="flex justify-center items-center gap-6 p-6 flex-wrap">
          {/* Main container */}
          <div className="flex flex-col sm:flex-row gap-4">
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
          <div className="flex flex-col items-center text-center w-[300px] h-[360px] bg-[#ffff] rounded-[12px] shadow-lg p-2">
            <div className="flex-1 text-[#000000] text-4xl font-bold text-center font-inter pt-4">
              <div>Q-TAG</div>
              <div className="text-[#727272] text-xl text-center pb-4">
                NFC Enabled
              </div>
            </div>
            <div className="w-[150px] h-[150px] flex justify-center items-center">
              <img
                src={keychain}
                alt="keychain"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 text-[#000000] text-4xl font-bold text-center font-inter pt-4">
              <p className="text-center mb-5 text-sm font-normal">
                Your digital business card on a sleek NFC keychain. Instantly
                share your contact details with just a tap, making networking
                easy and modern.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeMobileScreen4;
