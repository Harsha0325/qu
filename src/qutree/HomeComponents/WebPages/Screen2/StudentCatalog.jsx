import * as React from "react";
import community from "../../../../image/WebPageImages/communitylogo.svg";
import { useNavigate } from "react-router-dom";

export default function StudentCatalog({ socialIcons }) {
  const navigate = useNavigate();
  return (
    <section className="flex flex-col gap-5 mt-0 w-full max-w-[1298px] max-md:flex-col max-md:mt-10 max-md:max-w-full">
      {/* <div className="relative flex flex-col pt-7 pr-2 pl-9 w-full text-white min-h-[448px] max-md:pl-5 max-md:mt-10 bg-[red]"> */}
      <div
        className="relative flex flex-col pt-7 pr-2 pl-9 md:w-[90%] w-full text-white min-h-[448px] max-md:pl-5 max-md:mt-10 rounded-[50px]"
        style={{
          background:
            "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(7,19,70,0.8323704481792717) 100%), rgb(2,0,36)",
        }}
      >
        <div className="flex relative flex-wrap gap-5 justify-between self-center max-w-full text-3xl whitespace-nowrap text-white text-opacity-50 w-[629px]">
          <h2 className="self-start">Community</h2>
          <img
            loading="lazy"
            src={community}
            alt="Community Logo"
            className="object-contain shrink-0 md:w-[72px] w-[90px] aspect-[0.99]"
          />
        </div>
        {/* <p className="self-start text-6xl font-semibold leading-[75px] tracking-[2.03px] mt-5 max-md:text-4xl max-md:leading-[60px]">
          A Gateway to <br />
          <span className="italic font-bold text-cyan-400">Student</span>{" "}
          Profiles & Achievements
        </p> */}
        <p className="relative self-start md:text-4xl lg:text-6xl font-semibold leading-[75px] tracking-[2.03px] max-md:max-w-full max-md:text-4xl max-md:leading-[60px]">
          Grow Stronger Together: Build Your{" "}
          <span className="italic font-bold text-cyan-400">Community</span>{" "}
          Today
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
    </section>
  );
}
