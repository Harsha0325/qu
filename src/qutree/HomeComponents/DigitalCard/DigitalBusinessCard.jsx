import { RiWhatsappLine } from "react-icons/ri";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../../BaseUrlAPI";

import { IoMdLogIn } from "react-icons/io";
import { MuiTelInput } from "mui-tel-input";

import backgroundLeft from "../../../image/backgroundLeft.svg";
import backgroundCenter from "../../../image/backgroundCenter.svg";
import backgroundRight from "../../../image/backgroundRight.svg";

import MainBackground2 from "../../../image/cardBack/BackgroundImage2.svg";
import MainBackground3 from "../../../image/cardBack/BackgroundImage3.svg";
import MainBackground4 from "../../../image/cardBack/BackgroundImage4.svg";
import MainBackground5 from "../../../image/cardBack/BackgroundImage5.svg";
import MainBackground6 from "../../../image/cardBack/BackgroundImage6.svg";

import CardBackground1 from "../../../image/cardBack/CardBackground1.svg";
import CardBackground2 from "../../../image/cardBack/CardBackground2.svg";
import CardBackground3 from "../../../image/cardBack/CardBackground3.svg";
import CardBackground4 from "../../../image/cardBack/CardBackground4.svg";
import CardBackground5 from "../../../image/cardBack/CardBackground5.svg";
import CardBackground6 from "../../../image/cardBack/CardBackground6.svg";
import Loading from "../../../FixedComponents/Loading";
import DigitalCard from "./DigitalCard";

const mainBackgrounds = [
  null,
  MainBackground2,
  MainBackground3,
  MainBackground4,
  MainBackground5,
  MainBackground6,
];

const cardBackgrounds = [
  CardBackground1,
  CardBackground2,
  CardBackground3,
  CardBackground4,
  CardBackground5,
  CardBackground6,
];

const DigitalBusinessCard = () => {
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [cardData, setCardData] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const apiCallLogged = useRef(false);
  const [contactNumber, setContactNumber] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const handleShareClick = () => {
    const link = window.location.href; // Get the current URL
    const message = `Hey, check out my digital card: ${link}`;
    const cleanedPhoneNumber = contactNumber.replace(/\D/g, "");

    if (!cleanedPhoneNumber || cleanedPhoneNumber.length < 10) {
      setError("Invalid phone number.");
      return;
    }
    const whatsappUrl = `https://wa.me/${cleanedPhoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
    setShowModal(false);
  };

  const handleContactNumberChange = (value) => {
    if (!value) {
      setError("Please enter a valid phone number.");
      return;
    }
    setContactNumber(value);
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length < 12) {
      setError("Phone number must have at least 10 digits.");
    } else {
      setError("");
    }
  };

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      try {
        // Step 1: Check if the user exists
        const checkUserResponse = await Api.get(`/check-user`, {
          params: { userQCardId: id },
        });

        if (checkUserResponse.data.status) {
          // User exists, fetch card data
          const fetchCardResponse = await Api.get(
            `/get-card-by-quikynetId/${id}`
          );
          setCardData(fetchCardResponse.data);
          setUserId(fetchCardResponse.data.id);
        } else {
          // User does not exist, redirect to register page
          navigate(`/oauth/signup?userQCardId=${id}`);
        }
      } catch (error) {
        console.error("Error in checking user or fetching card data:", error);
      }
    };

    if (id && !apiCallLogged.current) {
      checkUserAndFetchData();
    }
  }, [id, navigate]);

  const saveVCard = (phones, fullName) => {
    if (!Array.isArray(phones) || phones.length === 0) {
      console.error("Expected an array of phone numbers");
      return;
    }

    // Extract first and last name
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    let vCardData = `BEGIN:VCARD\r\nVERSION:3.0\r\n`;
    vCardData += `FN:${fullName}\r\n`;
    vCardData += `N:${lastName};${firstName};;;\r\n`;

    phones.forEach((phone) => {
      vCardData += `TEL:${phone}\r\n`;
    });

    vCardData += "END:VCARD\r\n";

    // Create a Blob for the vCard file
    const blob = new Blob([vCardData], { type: "text/vcard" });
    const file = new File([blob], `${fullName}.vcf`, { type: "text/vcard" });
    const url = URL.createObjectURL(blob);

    const isAndroid = /android/i.test(navigator.userAgent); // Check for Android
    const isIOS = /iphone|ipod/i.test(navigator.userAgent); // Check for iOS

    // Android-specific behavior
    if (isAndroid) {
      console.log("Running Android-specific code");
      // Android download code (same as the code you shared for Android)
      let vCardDataAndroid = `BEGIN:VCARD\nVERSION:3.0\nFN:${fullName}\n`;
      phones.forEach((phone) => {
        vCardDataAndroid += `TEL:${phone}\n`;
      });
      vCardDataAndroid += "END:VCARD";

      const blobAndroid = new Blob([vCardDataAndroid], { type: "text/vcard" });
      const urlAndroid = URL.createObjectURL(blobAndroid);
      const linkAndroid = document.createElement("a");
      linkAndroid.href = urlAndroid;
      linkAndroid.download = `${fullName}.vcf`;

      // Append the link to the document, click it, and then remove it
      document.body.appendChild(linkAndroid);
      linkAndroid.click();
      document.body.removeChild(linkAndroid);

      // Revoke the object URL to release memory
      URL.revokeObjectURL(urlAndroid);
    }

    // iPhone-specific behavior
    else if (isIOS) {
      downloadVCard(url, fullName);
    } else {
      // For other platforms (e.g., desktop)
      console.log("Running default download code");
      downloadVCard(url, fullName); // Fallback to download if not Android or iPhone
    }
  };

  const downloadVCard = (url, fullName) => {
    const link = document.createElement("a");
    document.body.appendChild(link);
    link.href = url;
    link.download = `${fullName}.vcf`;

    // Force click to initiate download, especially for Samsung browsers
    link.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true, view: window })
    );

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Cleanup memory
    }, 100);
  };

  const fetchAdditionalDetails = async () => {
    try {
      const response = await Api.get(`/get-additional-details/${userId}`);
      setUserDetails(response.data);
      setShowDetails(true); // Show the additional details
    } catch (error) {
      console.error("Error fetching user additional details:", error);
    }
  };

  const handleFlip = () => {
    setShowDetails(!showDetails); // Flip the card
    if (!showDetails) {
      fetchAdditionalDetails(); // Only fetch additional details when flipping
    }
  };

  const handleClick = () => {
    navigate("/oauth/signup");
  };

  if (!cardData) {
    return <Loading message="Loading" />;
  }

  const { backgroundIndex } = cardData;
  const mainBackground = mainBackgrounds[backgroundIndex] || mainBackgrounds[0];
  const cardBackground = cardBackgrounds[backgroundIndex] || cardBackgrounds[0];

  const defaultBackgroundStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    minHeight: "100vh",
    backgroundColor: "#00080b",
    backgroundImage: `
          url(${backgroundLeft}),
          url(${backgroundCenter}),
          url(${backgroundRight})
        `,
    backgroundPosition: "left bottom, 65% 30%, right top",
    backgroundRepeat: "no-repeat",
    backgroundSize: "auto",
    padding: "20px",
  };

  const backgroundStyleWithImage = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    minHeight: "100vh",
    backgroundColor: "transparent",
    backgroundImage: `url(${mainBackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    padding: "20px",
  };

  const appliedStyle = mainBackground
    ? backgroundStyleWithImage
    : defaultBackgroundStyle;

  return (
    <>
      <div style={appliedStyle}>
        <div
          className="w-full h-full max-w-[450px] rounded-2xl p-5 bg-cover bg-center pt-14 pb-14"
          style={{ backgroundImage: `url(${cardBackground})` }}
        >
          <div className="flex justify-end mr-4 mb-2">
            <button
              className="text-sm font-bold flex items-center bg-white/10 backdrop-blur-md shadow-lg rounded-lg p-2 text-white mr-2"
              onClick={() => {
                setShowModal(true);
              }}
            >
              {/* Share */}
              <RiWhatsappLine className="ml-1 mr-1 text-[#25d366] text-xl" />
            </button>
            <button
              className="text-sm font-bold flex items-center bg-white/10 backdrop-blur-md shadow-lg  rounded-lg p-2 text-white"
              onClick={() => {
                navigate("/oauth/login");
              }}
            >
              Login <IoMdLogIn className="ml-1" />
            </button>
          </div>

          {cardData.companyLogo && !showDetails && (
            <div className="flex justify-between items-center flex-col w-full">
              <img
                src={cardData.companyLogo}
                alt="company Logo"
                className="w-28 h-20"
                loading="lazy"
              />
            </div>
          )}
          <div className="flex flex-col items-center mt-4">
            {cardData.image && !showDetails && (
              <img
                src={cardData.image}
                alt="user profile"
                className="w-24 h-24 rounded-lg mb-2"
                loading="lazy"  
              />
            )}
            {cardData.fullName && !showDetails && (
              <p
                className="text-xl m-0 text-white text-center"
                style={{ fontFamily: "Inter" }}
              >
                {cardData.fullName}
              </p>
            )}
            {cardData.jobTitle && !showDetails && (
              <p className="text-sm mt-1 text-white text-center">
                {cardData.jobTitle}
              </p>
            )}
            {cardData.companyName && !showDetails && (
              <p className="text-sm mt-1 text-white text-center">
                {cardData.companyName}
              </p>
            )}
          </div>
          <DigitalCard
            {...{
              showDetails,
              cardData,
              saveVCard,
              handleFlip,
              userDetails,
            }}
          />
        </div>
        <button
          onClick={handleClick}
          className="bg-[#1F4551] text-white p-2.5 text-sm mb-0 text-center rounded-[5px] transition-all duration-300 ease-in-out flex items-end sm:justify-start justify-center"
          style={{ boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)' }}
        >
          Create your Digital Business Card
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50">
          <div className="bg-white p-6 rounded-lg w-80 font-inter ring-2 ring-from-[#00CBFF] ring-to-[#640D99]">
            <h2 className="text-lg font-bold mb-4">Enter Contact Number</h2>

            <MuiTelInput
              name="contactNumber"
              value={contactNumber}
              onChange={handleContactNumberChange} // Directly pass function
              required
              defaultCountry="IN"
              variant="outlined"
              disableFormatting={false} // Keep proper formatting
              focusOnSelectCountry
              style={{
                width: "100%",
                borderRadius: "5px",
                backgroundColor: "white",
              }}
              InputProps={{
                style: { color: "black" },
              }}
            />
            {error && <p className="text-red-500 text-sm pb-2">{error}</p>}
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="px-4 py-1 bg-white text-black rounded-lg border border-gray-300"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-1 bg-gradient-to-r from-[#00CBFF] to-[#640D99] text-white rounded-lg"
                onClick={handleShareClick}
                disabled={error || !contactNumber}
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DigitalBusinessCard;
