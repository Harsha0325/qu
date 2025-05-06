

import React from "react";

const HomeMobileScreen2 = () => {

  return (
    <div className="flex  items-center flex-col  box-border">
      {/* Content only visible on mobile (screens smaller than lg) */}
      <div className="w-full">
        <div>
          <div
            // style={{ backgroundImage: `url(${backgroundImage})` }}
            className="flex overflow-hidden flex-col items-start bg-cover bg-center bg-no-repeat w-full max-w-[1920px]"
          >
            <main className="mt-10 w-full max-w-full">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col w-full justify-center items-center ">
                  <div className="w-[300px] h-[235px] mt-[16px] p-[1px] bg-gradient-to-br from-[#640D99] via-[#640D99] to-[#776099] blur-53 rounded-[10%]">
                    <div className="w-[full] h-[235px] bg-[#051426] flex flex-col justify-center px-[3px] text-white items-center opacity-90 transform rotate-0 rounded-[10%] ">
                      <h1 className="text-2xl font-Inter text-center pt[3px] sm:text-[28px] font-semibold md:text-[30px]  lg:text-[32px] ">
                        What is QuikyNet ?
                      </h1>{" "}
                      <br />
                      <h1 className="font-poppins text-[14px]  font-normal text-start justify-center px-1">
                        A digital business card is an electronic version of a
                        traditional business card. It contains your contact
                        details, links, and multimedia elements, shared via QR
                        codes, email, or apps. It’s eco-friendly, customizable,
                        easy to update, and ideal for networking in the digital
                        age.
                      </h1>
                    </div>
                  </div>
                  <div className="  text-white s tracking-[1px] text-center justify-center mt-[41px]">
                    <h1 className=" font-inter text-lg font-semibold pb-2">
                      {" "}
                      Most trusted and reviewed digital business card platform.
                    </h1>
                  </div>

                  {/* Card Preview Section */}
                  {/* <div className="mt-10 flex flex-col gap-6 justify-center items-center w-full h-full">
                    <div className="w-[262px]  h-[239px] p-[1px] bg-gradient-to-br from-[#640D99] via-[#640D99] to-[#776099] rounded-[50.2px]">
                      <div className="w-full h-[239px] bg-[#051426] rounded-[50px]  flex flex-col justify-center items-center opacity-90 transform rotate-0">
                        <div className="w-[205px] h-[71px] text-center font-bold text-white font-[Lilita One] text-[62px] leading-[71px] tracking-[2px]">
                          100K+
                        </div>
                        <div className="w-[153px] h-[1px] bg-white my-3"></div>
                        <div className="w-[205px] h-[100px] text-center text-[rgba(255,255,255,0.5)] font-[Poppins] text-[33px] leading-[50px]">
                          Successful Users
                        </div>
                      </div>
                    </div>

                    <div className="w-[262px] p-[1px]  h-[239px] bg-gradient-to-br from-[#640D99] via-[#640D99] to-[#776099] rounded-[50.2px]">
                      <div className="w-full  h-[239px] bg-[#051426] rounded-[50px] p flex flex-col justify-center items-center opacity-90 transform rotate-0">
                        <div className="w-[205px] h-[71px]  font-bold text-center text-white font-[Lilita One] text-[62px] leading-[71px] tracking-[2px]">
                          18M+
                        </div>
                        <div className="w-[153px] h-[1px] bg-white my-3"></div>
                        <div className="w-[205px] h-[100px] text-center text-[rgba(255,255,255,0.5)] font-[Poppins] text-[33px] leading-[50px]">
                          Views On Cards
                        </div>
                      </div>
                    </div>

                    <div className="w-[262px]   h-[239px] p-[1px] bg-gradient-to-br from-[#640D99] via-[#640D99] to-[#776099] rounded-[50.2px]">
                      <div className="w-full  h-[239px] bg-[#051426] rounded-[50px]  flex flex-col justify-center items-center opacity-90 transform rotate-0">
                        <div className="w-[205px] h-[71px] font-bold text-center text-white font-[Lilita One] text-[62px] leading-[71px] tracking-[2px]">
                          10K+
                        </div>
                        <div className="w-[153px] h-[1px] bg-white my-3"></div>
                        <div className="w-[205px] h-[100px] text-center text-[rgba(255,255,255,0.5)] font-[Poppins] text-[33px] leading-[50px]">
                          Contracts Exchanged
                        </div>
                      </div>
                    </div>

                    <div className="w-[262px]   h-[239px] p-[1px] bg-gradient-to-br from-[#640D99] via-[#640D99] to-[#776099] rounded-[50.2px]">
                      <div className="w-full  h-[239px] bg-[#051426] rounded-[50px]  flex flex-col justify-center items-center opacity-90 transform rotate-0">
                        <div className="w-[205px] h-[71px] font-bold text-center text-white font-[Lilita One] text-[62px] leading-[71px] tracking-[2px]">
                          20K+
                        </div>
                        <div className="w-[153px] h-[1px] bg-white my-3"></div>
                        <div className="w-[205px] h-[100px] text-center text-[rgba(255,255,255,0.5)] font-[Poppins] text-[33px] leading-[50px]">
                          Leads Generated
                        </div>
                      </div>
                    </div>

                    <button
                      onMouseEnter={() =>
                        setIsHovered((prev) => ({ ...prev, getCard: true }))
                      }
                      onMouseLeave={() =>
                        setIsHovered((prev) => ({ ...prev, getCard: false }))
                      }
                      className={`flex items-center w-[259] p-1 m-5 text-base font-semibold text-black bg-white rounded-xl border border-stone-50 h-[48px] transition-transform duration-300 ${
                        isHovered.getCard ? "transform scale-105" : ""
                      }`}
                    >
                      <span className=" my-auto min-w-[240px]">
                        Get your Digital Business Card
                      </span>
                    </button>
                  </div> */}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeMobileScreen2;
