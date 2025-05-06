import React, { useEffect, useState } from "react";
import qugates from "../../../../image/WebPageImages/Quky_logo.svg";
import { CiMail } from "react-icons/ci";
import { FaLinkedin } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import { FaInstagramSquare } from "react-icons/fa";
// import { FaSquareXTwitter } from "react-icons/fa6";

const HomeMobileScreen8 = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Detect if it's mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Update isMobile state based on window size
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const navigate = useNavigate();

  return (
    <div className="bg-black bg-[radial-gradient(90.16%_143.01%_at_15.32%_21.04%,_rgba(17,_112,_137,_0.2)_0%,_rgba(167,_22,_255,_0.07)_77.08%,_rgba(7,_164,_205,_0)_100%)] pt-30 background-overlay">
      <div
        style={{
          borderTop: "2px solid white",
          borderBottom: "2px solid white",
        }}
      >
        <div
          className="logo-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "30px",
            left: "55px",
            gap: "10px",
          }}
        >
          <img src={qugates} alt="Logo" />
        </div>
        <div
          className="footer"
          style={{
            marginTop: "42px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: isMobile ? "25px" : "105px", // Adjust gap based on screen size
            color: "white",
          }}
        >
          <button><p onClick={() => navigate("/")}>Home</p></button>
          <button>  <p onClick={() => navigate("/plans")}>Plans</p></button>
          <button>  <p onClick={() => navigate("/oauth/login")}>Login</p></button>
          <button><p onClick={() => navigate("/support")}>Support</p></button>
        </div>
        <div
          style={{
            marginTop: "42px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "40px",
            marginBottom: "30px",
          }}
        >
          <a
            href="mailto:support@quikynet.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <CiMail
              style={{
                width: "36.44px",
                height: "36.44px",
                color: "white",
              }}
            />
          </a>

          <a
            href="https://www.linkedin.com/company/qugates"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin
              style={{
                width: "36.44px",
                height: "36.44px",
                color: "white",
              }}
            />
          </a>

          <a
            href="https://www.facebook.com/QuantumGates"  // Replace with your Twitter profile
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookSquare
              style={{
                width: "36.44px",
                height: "36.44px",
                color: "white",
              }}
            />
          </a>

          <a
            href="https://www.facebook.com/QuantumGates"  // Replace with your Instagram profile
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* <FaInstagramSquare
          style={{
            width: "36.44px",
            height: "36.44px",
            color: "white",
          }}
        /> */}
          </a>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: isMobile ? "center" : "space-between",
          alignItems: "center",
          margin: isMobile ? "30px 20px 10px 20px" : "",
          color: "rgba(7, 126, 160, 1)",
          fontSize: "12px",
          flexDirection: isMobile ? "column" : "row",
          padding: "20px 20px 20px 20px",

        }}
      >
        {/* Powered by */}
        <p
          style={{
            fontFamily: "Archivo",
            fontSize: "16px",
            fontWeight: "400",
            textAlign: "center",
            margin: isMobile ? "5px 0" : "0",
          }}
        >
          Powered by Qugates Technologies
        </p>

        {/* Copyright */}
        <p
          style={{
            fontFamily: "Archivo",
            fontSize: "16px",
            fontWeight: "400",
            textAlign: "center",
            margin: isMobile ? "5px 0" : "0",
          }}
        >
          Copyright © 2024 QuikyNet - All Rights Reserved.
        </p>

        {/* Terms and Conditions */}
        <button
          onClick={() => navigate("/terms-and-conditions-of-service")}
          style={{
            fontFamily: "Archivo",
            fontSize: "16px",
            fontWeight: "400",
            textAlign: "center",
            margin: isMobile ? "5px 0" : "0",
            color: "rgba(7, 126, 160, 1)",
            textDecoration: "none",
          }}
          onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
          onMouseOut={(e) => (e.target.style.textDecoration = "none")}
        >
          Terms and Conditions of Service
        </button>
      </div>

    </div>
  );
};

export default HomeMobileScreen8;
