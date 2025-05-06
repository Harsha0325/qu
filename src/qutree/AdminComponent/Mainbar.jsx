import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PendingReturnsTable from "./PendingReturnsTable";
import CardManagement from "./CardManagement";
import Calendar from "./Calendar";
import { FaArrowLeftLong } from "react-icons/fa6";


function Mainbar() {
  const [selectedTab, setSelectedTab] = useState(() => {
      const savedTab = localStorage.getItem('selectedCardTab');
      return savedTab || 'generate';
    });
  const navigate = useNavigate();



  return (
    <div className="flex items-start bg-white min-h-screen p-10 pt-0 ml-[250px] w-[calc(100%-250px)]">
      <div className="flex flex-col w-full">
        <div className="flex flex-col justify-center py-2 w-full">
          <div className="flex flex-wrap gap-10 items-center w-full">
            <div className="flex flex-wrap grow shrink gap-3 items-center self-stretch my-auto text-2xl font-semibold leading-loose text-gray-900">
              <FaArrowLeftLong onClick={()=>navigate(-1)} />
              <div className="self-stretch my-auto">CardManagement</div>
            </div>
          </div>
        </div>

        <div className="flex overflow-hidden flex-col pb-2.5 mt-0 w-full">
        <div className="flex flex-wrap gap-4 items-start w-full">
            <div className="flex relative flex-1 shrink gap-10 text-sm font-medium leading-none text-center text-sky-800 basis-0 min-h-[40px] min-w-[240px] max-md:max-w-full">
              <div className="flex z-0 gap-1 h-full ">
                <button
                  className={`gap-2 self-stretch px-2 py-2.5 h-full ${
                    selectedTab === "calendar" ? "border-b-[3px] border-b-[#035E7B] text-[#035E7B]" : ""
                  }`}
                  onClick={() => setSelectedTab("calendar")}
                >
                  Calendar
                </button>
                <button
                  className={`gap-2 self-stretch px-2 py-2.5 h-full whitespace-nowrap ${
                    selectedTab === "generate" ? "border-b-[3px] border-b-[#035E7B] text-[#035E7B]" : ""
                  }`}
                  onClick={() => setSelectedTab("generate")}
                >
                  Generate Cards
                </button>
                <button
                  className={`gap-2 self-stretch px-2 py-2.5 h-full ${
                    selectedTab === "approveReturns" ? "border-b-[3px] border-b-[#035E7B] text-[#035E7B]" : ""
                  }`}
                  onClick={() => setSelectedTab("approveReturns")}
                >
                  Approve Returns
                </button>
               
              </div>
            </div>
          </div>
          <div className="mt-4 ">
          {selectedTab === "calendar" && (
            <div className="mt-4">
              <Calendar/>
            </div>
          )}
          {selectedTab === "generate" && (
            <CardManagement/>
          )}
          {selectedTab === "approveReturns" && (
            <div className="mt-4">
              <PendingReturnsTable/>
            </div>
          )}
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Mainbar;