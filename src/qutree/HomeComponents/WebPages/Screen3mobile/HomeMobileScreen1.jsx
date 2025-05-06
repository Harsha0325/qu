import React, { useState } from "react";
import { FaShareNodes } from "react-icons/fa6";
import { LuFileCog } from "react-icons/lu";
import { FaPenFancy } from "react-icons/fa";
import frame1 from "../../../../image/HomeImages/frame1.svg";


import { useNavigate } from "react-router-dom";

export default function HomeMobileScreen1() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState({
    login: false,
    signup: false,
    getCard: false,
    googlePlay: false,
    appleStore: false,
  });

  return (
    <div className="flex flex-col items-center m-0">
      <div>
    
            <main className="mx-auto mt-10 w-full max-w-full">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col w-full">
                  <div className="font-bold text-stone-50 text-xl tracking-[2px] font-inter ps-3">
                    <h1>
                      Digital Business Cards
                      <br />
                      for the Modern <br />
                      Professional
                    </h1>
                  </div>

                  {/* Card Preview Section */}
                  <div className="flex flex-col justify-center items-center mt-10">
                    <div className="flex flex-row">
                      <span className="mt-[100px]">
                        {" "}
                        <div
                          className={`sm:text-xs bg-purple-700 p-2 rounded-lg animate-zoom-in-out2 text-white mr-1`}
                        >
                          <LuFileCog />
                        </div>
                      </span>{" "}
                      <img
                        loading="lazy"
                        src={frame1}
                        alt="Digital Business Card Preview"
                        className="w-[220px] h-auto object-contain"
                      />
                      <span className="mt-[70px]">
                        {" "}
                       
                        <div
                          className={`sm:text-xs bg-purple-700 p-2 rounded-lg animate-zoom-in-out1 text-white ml-1`}
                        >
                          <FaPenFancy />
                        </div>
                      </span>{" "}
                    </div>
                    <div className="mt-7">
                  
                      <div
                        className={`sm:text-xs bg-purple-700 p-2 rounded-lg animate-zoom-in-out3 text-white mr-2`}
                      >
                        <FaShareNodes />
                      </div>
                    </div>
                    <button
                      onMouseEnter={() =>
                        setIsHovered((prev) => ({ ...prev, getCard: true }))
                      }
                      onMouseLeave={() =>
                        setIsHovered((prev) => ({ ...prev, getCard: false }))
                      }
                      className={`flex items-center p-10px  mt-10 text-base font-semibold text-black bg-white rounded-xl border border-stone-50 min-h-[48px] transition-transform duration-300 ${
                        isHovered.getCard ? "transform scale-105" : ""
                      }`}
                    >
                      <span
                        className="my-auto p-3 min-w-[240px]"
                        onClick={() => {
                          navigate("/oauth/signup");
                        }}
                      >
                        Get your Digital Business Card
                      </span>
                    </button>
                  </div>              
                </div>
              </div>
            </main>
          </div>
        </div>
  );
}
