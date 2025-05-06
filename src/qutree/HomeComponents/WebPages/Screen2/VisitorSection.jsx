import * as React from "react";
import visitormanagement from "../../../../image/WebPageImages/visitormanagement.svg";
// import { TiBusinessCard } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
export default function VisitorSection() {
  const navigate = useNavigate();
  return (
    <section className="flex gap-5 mt-24 max-w-full w-[1129px] max-md:flex-col max-md:mt-10">
      <div className="flex flex-col w-[38%] max-md:ml-0 max-md:w-full ">
        <img
          loading="lazy"
          src={visitormanagement}
          alt="Visitor management interface demonstration"
          className="object-contain w-full aspect-square max-md:mt-10"
        />
        {/* <div className="bg-[#482f50] bg-opacity-50 h-[280px] rounded-3xl">
        <div className="flex justify-between mt-3 px-7 pt-2">
          <span className="text-white text-4xl font-bold">Card View</span><span className="text-white font-bold text-[42px]">{<TiBusinessCard />}</span>
        </div>
        <div className="flex justify-center text-white text-9xl mb-3">0</div>
        <div className="text-white font-bold text-2xl px-12">People Viewed your card</div>
        </div> */}
      </div>
      <div className="flex flex-col ml-5 w-[62%] max-md:ml-0 max-md:w-full">
        {/* <div className="flex relative flex-col pt-9 pl-5 w-full min-h-[389px] max-md:mt-10 max-md:max-w-full" > */}
        <div
          className="flex relative flex-col pt-9 pl-5 w-full min-h-[389px] max-md:mt-10 max-md:max-w-full rounded-[50px]"
          style={{
            background:
              "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(7,19,70,0.8323704481792717) 100%), rgb(2,0,36)",
          }}
        >
          <div className="relative max-w-full w-[570px]">
            <h2 className="relative mt-16 md:mt-8 text-5xl md:text-4xl font-semibold tracking-widest text-white leading-[65px] max-md:mt-10 max-md:max-w-full max-md:text-4xl max-md:leading-[62px]">
              Streamline{" "}
              <span className="italic font-bold text-cyan-400">Visitor</span>{" "}
              Interactions with Ease.
            </h2>
          </div>
          <div className="flex relative z-10 flex-wrap gap-10 self-end mt-16 max-w-full w-[584px] max-md:mt-10 max-md:mr-0">
            <div className="flex-auto self-start text-3xl text-white text-opacity-50 w-[235px]">
              Visitors Management
            </div>
            <button
              className="px-11 py-6 text-2xl font-bold text-white whitespace-nowrap hover:text-purple-600 hover:bg-opacity-20 rounded-[42px] transition-colors  max-md:px-5"
              aria-label="Explore visitor management features"
              onClick={() => {
                navigate("/oauth/signup");
              }}
            >
              <span className="mr-2">➔</span> Explore
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
