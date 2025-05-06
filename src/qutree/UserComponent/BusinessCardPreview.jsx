import { SiGooglemaps } from "react-icons/si"; 
import React, { useEffect, useState } from "react";
import { BsWhatsapp } from "react-icons/bs";
import {
  FaPhoneAlt,
  FaLinkedinIn,
  FaFacebookF,
  FaBuilding,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaXTwitter, FaInstagram } from "react-icons/fa6";
import { FiYoutube } from "react-icons/fi";
import CardBg1 from "../../image/cardBack/CardBackground1.svg";
import CardBg2 from "../../image/cardBack/CardBackground2.svg";
import CardBg3 from "../../image/cardBack/CardBackground3.svg";
import CardBg4 from "../../image/cardBack/CardBackground4.svg";
import CardBg5 from "../../image/cardBack/CardBackground5.svg";
import CardBg6 from "../../image/cardBack/CardBackground6.svg";
// Card background images
const cardBackgrounds = [CardBg1, CardBg2, CardBg3, CardBg4, CardBg5, CardBg6];

const BusinessCardPreview = ({ cardData }) => {
  const [card, setCard] = useState(cardData);
  const [loading, setLoading] = useState(true); // Initial loading state is true

  useEffect(() => {
    if (cardData) {
      setCard(cardData);
      setLoading(false); // Set loading to false once cardData is available
    } else {
      setLoading(true); // Keep loading true if no cardData
    }
  }, [cardData]);
  const cardBackgroundImage =
    card?.backgroundIndex != null
      ? cardBackgrounds[card.backgroundIndex]
      : cardBackgrounds[0];

  if (loading) {
    return <div></div>;
  }
  return (
    <>
    <div>
      <div>
        <div
          className="flex flex-col justify-between items-center w-full h-full max-w-[420px] rounded-2xl bg-cover bg-center pt-14 pb-14 pl-5 pr-5 text-white"
          style={{ backgroundImage: `url(${cardBackgroundImage})` }}
        >
          {card?.companyLogo && (
            <div className="flex justify-start items-start w-full">
              <img
                src={card?.companyLogo}
                alt="Company Logo"
                className="ml-5 w-auto h-11"
              />
            </div>
          )}
          <div className="flex justify-between items-center mt-4 gap-1 font-inter">
          <div>
            {card?.fullName && (
              <p className="text-base sm:text-xl font-normal m-0 ml-5">
                {card?.fullName || "fullName"}
              </p>
            )}
            {card?.jobTitle && (
              <p className="text-xs sm:text-sm font-normal mt-1 ml-5">
                {card?.jobTitle || "jobTitle"}
              </p>
            )}
          </div>

            {card?.image && (
              <img
                src={card?.image}
                alt="User"
                className="w-20 h-20 rounded-lg mr-5"
              />
            )}
          </div>

          <div className="flex justify-between items-center mt-4 mb-4">
            <div className="m-2 grid gap-4 p-4 bg-white/10 backdrop-blur-md shadow-lg  rounded-lg w-[70vw] md:w-[320px]">
              {card?.phone && (
                <div
                  className="flex items-center px-4 rounded-lg  bg-white"
                  style={{
                    boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <div
                    className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-2xl"
                    style={{
                      boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <FaPhoneAlt className="text-[#063463] text-lg" />
                  </div>
                  <div className="ml-4 flex-grow text-center w-12 h-12 px-4 py-2  ">
                    <span className="text-gray-800 font-bold text-xl">
                      Phone
                    </span>
                  </div>
                </div>
              )}

              {card?.email[0] && (
                <div
                  className="flex items-center px-4 py-0 rounded-lg bg-white"
                  style={{
                    boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <div
                    className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow"
                    style={{
                      boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <MdEmail className="text-[#063463] text-lg" />
                  </div>
                  <div className="ml-4 flex-grow text-center  w-12 h-12 px-4 py-2 ">
                    <span className="text-gray-800 font-bold text-xl">
                      Email
                    </span>
                  </div>
                </div>
              )}

              {card?.whatsapp && (
                <div
                  className="flex items-center px-4 py-0 rounded-lg bg-white"
                  style={{
                    boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <div
                    className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow"
                    style={{
                      boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <BsWhatsapp className="text-[#063463] text-lg" />
                  </div>
                  <div className="ml-4 flex-grow text-center  w-12 h-12 px-4 py-2 ">
                    <span className="text-gray-800 font-bold text-xl">
                      WhatsApp
                    </span>
                  </div>
                </div>
              )}

              {card?.linkedin && (
                <div
                  className="flex items-center px-4 py-0 rounded-lg bg-white"
                  style={{
                    boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <div
                    className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow"
                    style={{
                      boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <FaLinkedinIn className="text-[#063463] text-lg" />
                  </div>
                  <div className="ml-4 flex-grow text-center  w-12 h-12 px-4 py-2">
                    <span className="text-gray-800 font-bold text-xl">
                      LinkedIn
                    </span>
                  </div>
                </div>
              )}

              {card?.twitter && (
                <div
                  className="flex items-center px-4 py-0 rounded-lg bg-white"
                  style={{
                    boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <div
                    className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow"
                    style={{
                      boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <FaXTwitter className="text-[#063463] text-lg" />
                  </div>
                  <div className="ml-4 flex-grow text-center  w-12 h-12 px-4 py-2">
                    <span className="text-gray-800 font-bold text-xl">
                      Twitter
                    </span>
                  </div>
                </div>
              )}

              {card?.facebook && (
                <div
                  className="flex items-center px-4 py-0 rounded-lg bg-white"
                  style={{
                    boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <div
                    className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow "
                    style={{
                      boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <FaFacebookF className="text-[#063463] text-lg " />
                  </div>
                  <div className="ml-4 flex-grow text-center  w-12 h-12 px-4 py-2">
                    <span className="text-gray-800 font-bold text-lg md:text-xl">
                      facebook
                    </span>
                  </div>
                </div>
              )}

              {card?.instagram && (
                <div
                  className="flex items-center px-4 py-0 rounded-lg bg-white"
                  style={{
                    boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <div
                    className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow"
                    style={{
                      boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <FaInstagram className="text-[#063463] text-lg" />
                  </div>
                  <div className="ml-4 flex-grow text-center  w-12 h-12 px-4 py-2">
                    <span className="text-gray-800 font-bold text-lg md:text-xl">
                      Instagram
                    </span>
                  </div>
                </div>
              )}

              {card?.youtube && (
                <div
                  className="flex items-center px-4 py-0 rounded-lg bg-white"
                  style={{
                    boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <div
                    className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow"
                    style={{
                      boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <FiYoutube className="text-[#063463] text-lg" />
                  </div>
                  <div className="ml-4 flex-grow text-center  w-12 h-12 px-4 py-2">
                    <span className="text-gray-800 font-bold text-lg md:text-xl">
                      YouTube
                    </span>
                  </div>
                </div>
              )}

              {card?.company && (
                <div
                  className="flex items-center px-4 py-0 rounded-lg bg-white"
                  style={{
                    boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <div
                    className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow"
                    style={{
                      boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <FaBuilding className="text-[#063463] text-lg" />
                  </div>
                  <div className="ml-4 flex-grow text-center  w-12 h-12 px-4 py-2">
                    <span className="text-gray-800 font-bold text-xl">
                      Company
                    </span>
                  </div>
                </div>
              )}
               {card?.googleMap && (
                <div
                  className="flex items-center px-4 py-0 rounded-lg bg-white"
                  style={{
                    boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <div
                    className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow"
                    style={{
                      boxShadow: "1px 1px 4px 2px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <SiGooglemaps className="text-[#063463] text-lg" />
                  </div>
                  <div className="ml-4 flex-grow text-center  w-12 h-12 px-4 py-2">
                    <span className="text-gray-800 font-bold text-xl">
                    Google Map
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div></>
  );
};

export default BusinessCardPreview;
