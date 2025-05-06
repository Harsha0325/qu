import * as React from "react";
import resume from "../../../../image/WebPageImages/resumeicon.svg";
import { useNavigate } from "react-router-dom";

export default function ProfileCard({
  name,
  imageUrl,
  socialIcons,
  onCreateResume,
}) {
  const navigate = useNavigate();

  return (
    <div className="flex relative flex-col items-center px-11 pt-10 pb-4 md:w-[90%] w-full min-h-[420px] rounded-[50px] max-md:px-5 max-md:max-w-full ">
      <div className="absolute inset-0 size-full bg-[#0B162B] rounded-3xl mt-2">
      </div>
      <div className="flex relative flex-col w-full">
        <img
          loading="lazy"
          src={imageUrl}
          alt={`Profile picture of ${name}`}
          className="object-contain self-center max-w-full aspect-[1.03] rounded-[85px] lg:w-[170px] md:w-[120px]"
        />
        <div className="mt-6 text-2xl text-center text-white tracking-[2px]">
          {name}
        </div>
        <div className="flex gap-5 md:gap-3 justify-center items-center mt-6 w-full  ">
          {socialIcons.map((icon, index) => (
            <button
              key={index}
              className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 "
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
        <button
          onClick={() => {
            navigate("/oauth/signup");
          }}
          className="flex gap-3.5 justify-center items-center self-center p-2.5 mt-6 md:text-base text-2xl font-bold text-white rounded-3xl bg-purple-400 bg-opacity-40 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-colors"
        >
          <img
            loading="lazy"
            src={resume}
            alt=""
            className="object-contain shrink-0 self-stretch my-auto aspect-square w-[27px]"
          />
          <span>Create Profile</span>
        </button>
      </div>
    </div>
  );
}
