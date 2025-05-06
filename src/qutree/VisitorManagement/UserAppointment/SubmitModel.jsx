import React, { useState, useEffect } from "react";
import { VscPassFilled } from "react-icons/vsc";

const SubmitModel = ({ onClose }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Detect if it's mobile view

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Update isMobile state based on window size
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 p-4"
      style={{
        marginLeft: isMobile ? "0px" : "240px",
      }}
    >
      <div className="bg-white p-6 pb-4 rounded-lg shadow-lg w-96 md:max-w-lg  overflow-hidden">
        <div className="p-3 flex justify-center">
          <p className="text-7xl font-semibold mb-4 text-center">
            <VscPassFilled className="text-[#066882] " />
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap justify-center mx-2">
            <p className="font-semibold text-lg text-center">
              Request submitted
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="underline text-[#066882] text-sm px-6 py-2"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitModel;
