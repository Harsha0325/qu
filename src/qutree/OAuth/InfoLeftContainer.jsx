import React from "react";
import login1 from "./asset/login1.svg";
import login2 from "./asset/login2.svg";
import star from "./asset/star.svg";
import { useNavigate } from "react-router-dom";
import QuikynetLogo from "../../image/QuikynetLogo.svg";

const InfoLeftContainer = () => {
  const navigate = useNavigate();
  return (
    <div
      className="bg bg-[#121831] h-full min-w-[60%] flex flex-col justify-center p-[40px]"
      style={{ position: "relative" }}
    >
      <img
        src={QuikynetLogo}
        alt="Logo"
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          width: "240px",
          height: "50px",
          zIndex: 2,
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      />

      <img
        src={login1}
        alt="Logo"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: "140.879x",
          zIndex: 2,
        }}
      />
      <img
        src={login2}
        alt="Logo"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "140.879x",
          zIndex: 2,
        }}
      />
      <img
        src={star}
        alt="Star"
        style={{
          width: "80px",
          height: "80x",
          zIndex: 2,
        }}
        className="mb-[36px]"
      />
      <div className="text-white font-inter  text-6xl font-semibold leading-[90px] tracking-[-1.44px] max-w-[700px]">
        Digital Business Cards for the Modern Professionals
      </div>
    </div>
  );
};

export default InfoLeftContainer;
