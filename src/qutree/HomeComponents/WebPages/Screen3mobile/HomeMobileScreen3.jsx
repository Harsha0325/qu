import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import homedetail1 from "../../../../image/Homev1/howItWorks1.png"
import homepaydetail from "../../../../image/Homev1/howItWorks2.png"
import homedetail2 from "../../../../image/Homev1/howItWorks3.png"
import homedetail3 from "../../../../image/Homev1/howItWorks4.png"

const HomeMobileScreen3 = () => {
  const [isHovered, setIsHovered] = useState({
    login: false,
    signup: false,
    getCard: false,
    googlePlay: false,
    appleStore: false,
  });
  const navigate = useNavigate();
  return (
    <div className="h-full flex items-center flex-col font-inter">
      <div>
        <div
          className="flex flex-col items-center px-5 bg-cover bg-center w-full"
        >
          <main className="mt-10 w-full max-w-full">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col w-full">
                <div className="text-2xl text-center font-bold text-stone-50 ">
                  How it Works?  
                </div>
               
                <div className="mt-4 flex flex-col justify-center items-center space-y-10">
                <div className="relative font-bold text-white text-lg mr-3">1. Create your personal account</div>
                  <div className="flex flex-col sm:flex-row gap-5 justify-center  bg-cover bg-no-repeat bg-center"
                  
                    >
                    {" "}
                    <img
                      loading="lazy"
                      src={homedetail1}
                      alt="Digital Business Card Preview 1"
                      className="w-[360px] h-[560px]  object-contain "
                    />
                  </div>
             
                  <div className="relative font-bold text-white text-lg mr-3">2. Pick your plan and pay securely</div>
                  <div className="flex flex-col sm:flex-row gap-5 justify-center">
                    {" "}     
                    <img
                      loading="lazy"
                      src={homepaydetail}
                      alt="Digital Business Card Preview 2"
                      className="w-[360px] h-[560px] object-contain"
                    />
                  </div>
                  <div className="relative font-bold text-white text-lg mr-3">3. Enter your details & <br/> Upload your profile picture</div>
                  <div className="flex flex-col sm:flex-row gap-5 justify-center">
                    {" "}      
                    <img
                      loading="lazy"
                      src={homedetail2}
                      alt="Digital Business Card Preview 2"
                      className="w-[360px] h-[560px] object-contain"
                    />
                  </div>

                  <div className="relative font-bold text-white text-lg mr-3">4. Select your Theme</div>
                  <div className="flex flex-col sm:flex-row gap-5 justify-center">
                    {" "}
                    <img
                      loading="lazy"
                      src={homedetail3}
                      alt="Digital Business Card Preview 2"
                      className="w-[400px] h-[560px] object-contain"
                    />
                  </div>

                  <div className="third relative w-[350px] h-auto flex flex-col justify-center items-center mx-10">

                    <button
                      onMouseEnter={() =>
                        setIsHovered((prev) => ({ ...prev, getCard: true }))
                      }
                      onMouseLeave={() =>
                        setIsHovered((prev) => ({ ...prev, getCard: false }))
                      }
                      className={`flex items-center w-[259px] p-1 m-5 text-base font-semibold text-black bg-white rounded-xl border border-stone-50 h-[48px] transition-transform duration-300 ${
                        isHovered.getCard ? "transform scale-105" : ""
                      }`}
                    >
                      <span
                        className="my-auto min-w-[240px]"
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
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default HomeMobileScreen3;
