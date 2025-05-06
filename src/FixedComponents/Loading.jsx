import React from "react";

const Loading = ({ message = "Loading" }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-50">
      <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[#1F4551]"></div>
      <div className="text-lg font-semibold text-[#1F4551] mt-4">{message}</div>
    </div>
  );
};

export default Loading;
