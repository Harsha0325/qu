import * as React from "react";
import community from "../../../../image/WebPageImages/communitylogo.svg";
import profileimg from "../../../../image/WebPageImages/profile.svg";
import { useNavigate } from "react-router-dom";

export default function CommunitySection({ socialIcons }) {
  const navigate = useNavigate();

  return (
    <section className="flex gap-5 mt-44 w-full max-w-[1298px] max-md:flex-col max-md:mt-10 max-md:max-w-full  ">
      <div className="flex flex-col w-[62%] md:w-[60%] max-md:ml-0 max-md:w-full">
        <div
          className="relative flex flex-col pt-7 pr-2 pl-9 w-full text-white min-h-[448px] max-md:pl-5 max-md:mt-10 rounded-[50px]"
          style={{
            background:
              "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(7,19,70,0.8323704481792717) 100%), rgb(2,0,36)",
          }}
        >
          <div className="flex relative flex-wrap gap-5 justify-between self-center max-w-full text-3xl whitespace-nowrap text-white text-opacity-50 w-[629px]">
            <h2 className="self-start">Student Catalog</h2>
            <img
              loading="lazy"
              src={community}
              alt=""
              className="object-contain shrink-0 max-w-full md:w-[80px] aspect-[0.99] w-[100px]"
            />
          </div>
          <p className="self-start text-6xl md:text-5xl font-semibold leading-[75px] tracking-[2.03px] mt-5 max-md:text-4xl max-md:leading-[60px]">
            A Gateway to <br />
            <span className="italic font-bold text-cyan-400">Student</span>{" "}
            Profiles & Achievements
          </p>
          <button
            className="relative z-10 self-end px-16 py-6 mt-12 max-w-full text-3xl font-bold whitespace-nowrap hover:text-purple-600 hover:bg-opacity-20 rounded-[48px] w-[254px] transition-colors  max-md:px-5 max-md:mt-10"
            aria-label="Explore community features"
            onClick={() => {
              navigate("/oauth/signup");
            }}
          >
            <span className="mr-2">➔</span> Explore
          </button>
        </div>
      </div>
      <div className="flex flex-col ml-5 w-[38%] max-md:ml-0 max-md:w-full">
        <div className="relative flex flex-col items-center px-11 pt-12 pb-4 w-full min-h-[427px] rounded-[50px] max-md:px-5 max-md:mt-10 max-md:max-w-full">
          <div className="absolute inset-0 size-full bg-[#0B162B] rounded-3xl mt-2">
          </div>
          <div className="flex relative flex-col w-full">
            <img
              loading="lazy"
              src={profileimg}
              alt="Profile picture of Samantha Richard"
              className="object-contain self-center max-w-full aspect-[1.03] rounded-[85px] w-[175px]"
            />
            <div className="mt-6 text-2xl text-center text-white tracking-[2px]">
              Samantha Richard
            </div>
            <div className="flex gap-5 md:gap-3 justify-center items-center mt-6 w-full">
              {socialIcons.map((icon, index) => (
                <button
                  key={index}
                  className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                  aria-label={`Social media link ${index + 1}`}
                >
                  <div
                    key={index}
                    className="flex justify-center items-center md:text-base sm:text-2xl 2xl:text-xl text-white rounded-[50%]  bg-gradient-to-b from-blue-400 via-blue-600 to-purple-900 w-10 h-9 md:w-9 md:h-8  lg:h-9 lg:w-9 xl:w-14 xl:h-14 "
                  >
                    {icon}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
