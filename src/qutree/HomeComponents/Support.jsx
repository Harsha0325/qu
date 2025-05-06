import React, { useState } from "react";
import { message } from "antd";
import {
  FaWifi,
  FaBatteryThreeQuarters,
  FaBell,
  FaPhoneAlt,
  FaLinkedinIn,
} from "react-icons/fa";
import { RiFacebookFill } from "react-icons/ri";
import { IoBluetooth } from "react-icons/io5";
import { MdEmail, MdOutlineJoinInner } from "react-icons/md";

import SupportRealme from "../../image/WebPageImages/SupportRealme.svg";
import QUIKYNET_LOGO from "../../image/WebPageImages/QUIKYNET_LOGO.svg";
import QUIKYNET_LOGO1 from "../../image/WebPageImages/QUIKYNET_LOGO1.svg";
import NavBar from "./WebPages/Navbar";
import { useNavigate } from "react-router-dom";

import Api from "../BaseUrlAPI";
const Support = () => {
  const [activeTab, setActiveTab] = useState("details");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent form default submission
    try {
      const response = await Api.post("/contact-us", formData);
      if (response.status === 200) {
        message.destroy();
        message.success("Feedback has been recorded. Thank you!");
        setFormData({
          fullName: "",
          email: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send the Message. Please try again.";
      message.destroy();
      message.warning(errorMessage);
    }
  };
  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50">
        <NavBar />
      </header>
      <div className="relative min-h-screen bg-cover bg-center flex items-center justify-center bg-black bg-[radial-gradient(90.16%_143.01%_at_15.32%_21.04%,_rgba(17,_112,_137,_0.2)_0%,_rgba(167,_22,_255,_0.07)_77.08%,_rgba(7,_164,_205,_0)_100%)]">
        {/* Overlay for dim effect */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Card */}
        <div className=" w-full sm:w-[90%] max-w-3xl rounded-t-3xl h-[80%]">
          <div className="relative mt-24 shadow-lg rounded-lg w-full sm:w-[90%] max-w-3xl rounded-t-3xl h-full overflow-auto scrollbar-hide">
            {/* Top Notch Bar */}
            <div className="relative bg-gradient-to-r from-[#016681] to-[#0CBFFF] h-8 flex items-center justify-between p-2 sm:p-4 lg:p-6 text-sm sm:text-base text-[#000000] border-b-[1px] border-[#00CBFF] rounded-t-3xl">
              {/* Time */}
              <span className="text-base sm:text-lg font-medium">4:15</span>

              {/* Icons */}
              <div className="flex items-center gap-2 text-sm sm:text-lg">
                <FaBell className="w-4 h-4 sm:w-5 sm:h-5" />
                <IoBluetooth className="w-4 h-4 sm:w-5 sm:h-5" />
                <FaWifi className="w-4 h-4 sm:w-5 sm:h-5" />
                <FaBatteryThreeQuarters className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              {/* Camera Notch */}
              <div className="absolute top-1 sm:top-2 lg:top-4 left-1/2 transform -translate-x-1/2 w-16 h-3 sm:w-20 sm:h-4 bg-black rounded-full"></div>
            </div>

            <div className="relative bg-gradient-to-r from-[#016681] to-[#0CBFFF] sm:h-[150px] lg:h-[260px] flex flex-col sm:flex-row items-center px-4 sm:px-8 text-sm text-white w-full bg-[red] max-h-[200px] p-2">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full">
                <img
                  src={SupportRealme}
                  alt="Quikynet Logo"
                  className="w-[100px] sm:w-[100px] md:w-[140px] lg:w-[180px] xl:w-[190px] 2xl:w-[190px]"
                />
                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                  }}
                  className="font-bold text-center sm:text-left text-3xl sm:text-6xl lg:text-6xl xl:text-6xl text-white"
                >
                  QUIKYNET
                </div>
              </div>
            </div>

            <div className="relative bg-white h-[100px] flex justify-between items-center px-8">
              <div className="flex items-center space-x-4">
                <div
                  className="flex items-center justify-center bg-gradient-to-r from-[#103656] to-[#2174BF] rounded-full"
                  style={{
                    transform: "translateY(-50px)",
                  }}
                >
                  <div className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] md:w-[180px] md:h-[180px] lg:w-[197px] lg:h-[197px] flex items-center justify-center">
                    <img
                      src={QUIKYNET_LOGO}
                      alt="Quikynet Logo"
                      className="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[150px] lg:w-[151px] lg:h-[160px] object-contain"
                    />
                  </div>
                </div>
              </div>
              <div>
                <button
                  style={{
                    fontFamily: "Inter, sans-serif",
                  }}
                  className="bg-[#016681] text-white font-semibold px-6 py-2 rounded-full hover:bg-[#0CBFFF] transition duration-300"
                  onClick={() => navigate("/")}
                >
                  Home
                </button>
              </div>
            </div>

            {/* Card Header */}
            <div className="p-6 text-start border-b border-gray-200 bg-white ">
              <h1 className="text-3xl font-bold text-gray-800">QuikyNet</h1>
              <p className="text-gray-600 mt-2">
                A unit of Quqates Technology Pvt. Ltd
                <br />
                Bengaluru, KA, India
              </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-around border-b border-gray-200 bg-white">
              <button
                className={`flex-1 py-4 text-center font-semibold ${
                  activeTab === "details"
                    ? "text-[#000000] border-b-8 border-gray-800"
                    : "text-gray-500 hover:text-blue-500 border-b-8 border-[#D9D9D9]"
                }`}
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
              <button
                className={`flex-1 py-4 text-center font-semibold ${
                  activeTab === "contact"
                    ? "text-[#000000] border-b-8 border-gray-800"
                    : "text-gray-500 hover:text-blue-500 border-b-8 border-[#D9D9D9]"
                }`}
                onClick={() => setActiveTab("contact")}
              >
                Contact Us
              </button>
            </div>

            <div className="p-6 bg-white">
              {activeTab === "details" && (
                <>
                  <h2 className="text-lg font-bold text-gray-800">About</h2>
                  <p className="text-[#000000] mt-4">
                    <strong>QuikyNet</strong> is the initiative of{" "}
                    <strong>Quqates Technologies Pvt. Ltd</strong>. Our{" "}
                    <strong>mission</strong> is to empower{" "}
                    <strong>individuals</strong>, whether{" "}
                    <strong>
                      {" "}
                      corporate leaders, freelancers, entrepreneurs, or
                      creators,
                    </strong>{" "}
                    to make lasting impressions and stay ahead in a rapidly
                    advancing digital world. With <strong>QuikyNet</strong>,
                    you’re not just sharing a card; you’re building meaningful
                    connections powered by cutting-edge technology.
                  </p>
                  <div className="mt-6 border-t-2 border-[#D9D9D9]">
                    <h3 className="text-lg font-bold text-gray-800">
                      Connections
                    </h3>

                    <div className="mt-4 grid gap-4">
                      {/* Phone Number */}
                      <a
                        href="tel:+91 9019033005"
                        className="flex items-center px-4 py-2 rounded-lg"
                      >
                        <div
                          className="flex items-center justify-center w-12 h-12 bg-white rounded-md shadow-2xl"
                          style={{
                            boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                          }}
                        >
                          <FaPhoneAlt className="text-[#063463] text-lg" />
                        </div>
                        <div
                          className="ml-4 flex-grow text-center w-12 h-12 px-4 py-2 rounded-md shadow-2xl"
                          style={{
                            boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                          }}
                        >
                          <span className="text-gray-800 font-bold text-xl">
                            Phone Number
                          </span>
                        </div>
                      </a>

                      {/* Email */}
                      <a
                        href="mailto:support@quikynet.com"
                        className="flex items-center px-4 py-2 rounded-lg"
                      >
                        <div
                          className="flex items-center justify-center w-12 h-12 bg-white rounded-md shadow"
                          style={{
                            boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                          }}
                        >
                          <MdEmail className="text-[#063463] text-lg" />
                        </div>
                        <div
                          className="ml-4 flex-grow text-center shadow w-12 h-12 px-4 py-2 rounded-md"
                          style={{
                            boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                          }}
                        >
                          <span className="text-gray-800 font-bold text-xl">
                            Email
                          </span>
                        </div>
                      </a>

                      {/* LinkedIn */}
                      <a
                        href="https://www.linkedin.com/company/qugates"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 rounded-lg"
                      >
                        <div
                          className="flex items-center justify-center w-12 h-12 bg-white rounded-md shadow"
                          style={{
                            boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                          }}
                        >
                          <FaLinkedinIn className="text-[#063463] text-lg" />
                        </div>
                        <div
                          className="ml-4 flex-grow text-center shadow w-12 h-12 px-4 py-2 rounded-md"
                          style={{
                            boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                          }}
                        >
                          <span className="text-gray-800 font-bold text-xl">
                            LinkedIn
                          </span>
                        </div>
                      </a>

                      {/* Twitter */}
                      <a
                        href="https://www.facebook.com/QuantumGates"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 rounded-lg"
                      >
                        <div
                          className="flex items-center justify-center w-12 h-12 bg-white rounded-md shadow"
                          style={{
                            boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                          }}
                        >
                          <RiFacebookFill className="text-[#063463] text-lg" />
                        </div>
                        <div
                          className="ml-4 flex-grow text-center shadow w-12 h-12 px-4 py-2 rounded-md"
                          style={{
                            boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                          }}
                        >
                          <span className="text-gray-800 font-bold text-xl">
                            Facebook
                          </span>
                        </div>
                      </a>

                      {/* Community */}
                      <a
                        href="https://qugates.com"
                        className="flex items-center px-4 py-2 rounded-lg"
                      >
                        <div
                          className="flex items-center justify-center w-12 h-12 bg-white rounded-md shadow"
                          style={{
                            boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                          }}
                        >
                          <MdOutlineJoinInner className="text-[#063463] text-lg" />
                        </div>
                        <div
                          className="ml-4 flex-grow text-center shadow w-12 h-12 px-4 py-2 rounded-md"
                          style={{
                            boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                          }}
                        >
                          <span className="text-gray-800 font-bold text-xl">
                            Company
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "contact" && (
                <form className="space-y-4" onSubmit={onSubmit}>
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-[#000000]"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                      placeholder="Enter your full name"
                      style={{
                        boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[#000000]"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                      placeholder="Enter your email"
                      style={{
                        boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-[#000000]"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                      placeholder="Enter your message"
                      style={{
                        boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                      }}
                    ></textarea>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-[100px] bg-[#016681] text-white py-2 rounded hover:bg-[#0CBFFF] transition duration-300"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              )}
            </div>
            <div className="relative bg-[#FFFFFF] h-[80px] flex items-center justify-between px-8 text-sm text-white border-t-2 border-[#D9D9D9]">
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.938rem", // Adjust font size for better responsiveness
                  color: "#063463",
                }}
                className="font-bold"
              >
                Copyright © 2024 QuikyNet - All Rights Reserved.
              </div>
              <div>
                <img
                  src={QUIKYNET_LOGO1}
                  alt="Quikynet Logo"
                  className="w-[192px] h-[44px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Support;
