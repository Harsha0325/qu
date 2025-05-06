import React, { useState, useEffect, useContext } from "react";
import { FaEdit, FaShareAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ShareModal from "../SharePopup";
import Api from "../api";
import { Button } from "antd";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import { SiGotomeeting } from "react-icons/si";
import { useAuth } from "../../context/AuthContext";
import { IoEyeOutline } from "react-icons/io5";
import BusinessCardPreview from "./BusinessCardPreview";
import Loading from "../../FixedComponents/Loading";
import MonthlyDataGraph from "./MonthlyDataGraph";
import { GiSandsOfTime } from "react-icons/gi";
import { RolesContext } from "../../context/RoleContext";
import { Skeleton } from "antd";

const UserDashboard = () => {
  const { isAuthenticated } = useAuth() || {};
  const [card, setCard] = useState(null);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 756);
  const [isLaptopView, setIsLaptopView] = useState(window.innerWidth <= 1026);
  const { userId } = useContext(RolesContext);
  const navigate = useNavigate();
  const [callCount, setCallCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [communityJoinCount, setCommunityJoinCount] = useState("");
  const [daysLeft, setDaysLeft] = useState();

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 756);
      setIsLaptopView(window.innerWidth <= 1026);
    };
    window.addEventListener("resize", handleResize);

    if (!isAuthenticated) {
      navigate("/oauth/login");
      return;
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!userId) {
      setLoading(true);
      return;
    }

    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Fetch card data
        const cardResponse = await Api.get(`/get/${userId}`);
        if (cardResponse.status !== 200) {
          const errorText = cardResponse.data || "Failed to fetch card data.";
          setError(errorText);
          if (cardResponse.status === 401) {
            navigate("/oauth/login");
          }
          return;
        }
        setCard(cardResponse.data);

        // Fetch call count
        const callCountResponse = await Api.get("/total-call-count", {
          params: { userId: userId },
        });
        if (callCountResponse.status === 200) {
          setCallCount(callCountResponse.data.callCount);
        } else {
          setError("Failed to fetch call count.");
        }

        // Fetch community join count
        const communityResponse = await Api.get(`/community-count/${userId}`);
        if (communityResponse.status === 200) {
          setCommunityJoinCount(communityResponse.data.count);
        } else {
          setError("Failed to fetch community count.");
        }

        // Fetch days left
        const daysLeftResponse = await Api.get(`/${userId}/days-left`);
        if (daysLeftResponse.status === 200) {
          setDaysLeft(daysLeftResponse.data);
        } else {
          setError("Failed to fetch days left count.");
        }

        setError(null);
      } catch (error) {
        setError("Failed to fetch data.");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [userId, navigate]);

  const handleButtonClick = () => {
    navigate("/qr-reader");
  };

  const handleEditClick = () => {
    if (card) {
      navigate(`/updates`);
    }
  };

  const handleShareClick = () => {
    if (card) {
      const url = `${window.location.origin}/business-card/${card.userQCardId}`;
      setShareUrl(url);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const showDiv =
    daysLeft &&
    daysLeft.daysLeftCount >= 1 &&
    daysLeft.paymentStatus &&
    daysLeft.paymentStatus !== "COMPLETED";

  if (isMobileView && loading) {
    return (
      <div className="w-full pt-4 space-y-4 mb-16">
        <div className="w-full text-start mb-5">
          <Skeleton.Input active className="!w-full !h-[40px] rounded-lg" />
        </div>
        <div className="bg-white text-black rounded-lg p-5 relative border border-gray-300">
          <Skeleton.Input active className="!w-full !h-[30px] rounded-lg" />
          <div className="flex justify-between mt-3">
            <Skeleton.Input active className="!w-full !h-[30px] rounded-lg" />
          </div>
        </div>
        <div className="bg-white text-black rounded-lg p-5 relative border border-gray-300">
          <Skeleton.Input active className="!w-full !h-[30px] rounded-lg" />
          <div className="flex justify-between mt-3">
            <Skeleton.Input active className="!w-full !h-[30px] rounded-lg" />
          </div>
        </div>
        <div className="border border-[#ccc] py-1 px-0.5 rounded-lg">
          <Skeleton.Image active className="!w-full !h-[200px] rounded-lg" />
          <div className="flex justify-between gap-4 mt-5 items-center m-2">
            <Skeleton.Button active className="w-1/2 h-10 rounded" />
            <Skeleton.Button active className="w-1/2 h-10 rounded" />
          </div>
        </div>
        <div className="border border-[#ccc] py-1 px-0.5 rounded-lg">
          <Skeleton.Input active className="!w-full !h-[250px] rounded-lg" />
        </div>
        <div className="rounded-lg">
          <Skeleton.Input active className="!w-full !h-[40px] rounded-lg" />
        </div>
      </div>
    );
  }

  if (!isMobileView && loading) {
    return <Loading message="Loading" />;
  }

  const renderMobileView = () => (
    <div className="w-full pt-4 space-y-4 mb-16">
      {error && <p className="text-red-600">{error}</p>}

      {card && (
        <div className="text-start mb-5">
          <h2 className="text-black text-xl font-bold font-inter">
            Welcome, {card.fullName || "User"}!
          </h2>
        </div>
      )}

      {showDiv && (
        <div className="w-full bg-gradient-to-r from-[#066882] to-[#00CBFF] p-4 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-start items-center sm:items-start gap-6">
            <div className="flex flex-col sm:flex-row sm:gap-6 w-full sm:w-auto">
              <GiSandsOfTime className="text-white text-[20px] font-bold" />
              <div className="pl-6">
                <div className="text-white font-inter text-[30px] font-bold">
                  Your Trial Ends in{" "}
                  <span className="text-[50px]">{daysLeft.daysLeftCount}</span>{" "}
                  Days!!
                </div>
                <div className="text-[#CECECE] font-inter italic">
                  Unlock full access and continue enjoying premium features
                  without interruptions.
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center gap-4 sm:gap-2">
              <button
                className="bg-white py-4 px-6 rounded-3xl text-[#000000] font-bold font-inter w-full sm:w-auto"
                onClick={() => navigate("/pricing")}
              >
                Subscribe Now
              </button>
              <button
                className="bg-transparent rounded-3xl underline text-[#002AFF] font-inter w-full sm:w-auto"
                onClick={() => navigate("/pricing")}
              >
                View Plans
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-[#066882] to-[#00CBFF] text-white rounded-lg p-5 relative border border-gray-300">
        <div className="flex items-center mb-2 text-lg font-inter">
          Total Card Views
          <IoEyeOutline className="absolute top-4 right-4 text-white text-lg" />
        </div>
        <div className="flex justify-between mt-3">
          <div className="text-start">
            <p className="text-4xl">{callCount || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white text-black rounded-lg p-5 relative border border-gray-300">
        <div className="flex items-center mb-2 text-lg font-inter">
          Communities Joined
          <SiGotomeeting className="absolute top-4 right-4 text-gray-400 text-lg" />
        </div>
        <div className="flex justify-between mt-3">
          <div className="text-start">
            <p className="text-4xl">{communityJoinCount}</p>
          </div>
        </div>
      </div>
      <div className="border border-[#ccc] py-1 px-0.5 rounded-lg">
        <BusinessCardPreview cardData={card} />

        <div className="flex justify-between gap-4 mt-5 items-center m-2">
          <button
            onClick={handleEditClick}
            className="flex items-center px-4 py-2 text-white bg-[#035E7B] rounded hover:bg-[#024d63] transition"
          >
            <FaEdit className="mr-[3px]" /> Edit Card
          </button>
          <button
            onClick={handleShareClick}
            className="flex items-center px-4 py-2 text-black border border-gray-300 rounded hover:bg-gray-100 transition"
          >
            <FaShareAlt className="mr-[3px]" /> Share Card
          </button>
        </div>

        {isModalOpen && (
          <ShareModal
            url={shareUrl}
            onClose={handleCloseModal}
            name={card.fullName}
            qCardId={card.userQCardId}
          />
        )}
      </div>

      <MonthlyDataGraph />
      <div className="mt-5">
        <Button
          className="w-full bg-[#035E7B] rounded-md text-white font-inter text-lg py-6 px-8 border-none"
          onClick={handleButtonClick}
        >
          <MdOutlineQrCodeScanner /> Scan QR Code
        </Button>
      </div>
    </div>
  );

  const renderDesktopView = () => (
    <div
      className={`${
        isLaptopView ? "w-[760px]" : "w-[1000px]"
      } ml-[240px] pt-[20px]`}
    >
      {error && <p className="text-red-600">{error}</p>}

      {card && (
        <div className="text-start mb-2">
          <h2 className="text-black text-2xl font-bold font-inter">
            Welcome, {card.fullName || "User"}!
          </h2>
        </div>
      )}

      {showDiv && (
        <div className="w-full bg-gradient-to-r from-[#066882] to-[#00CBFF] p-4 rounded-lg">
          <div className="flex flex-row justify-start items-center gap-6">
            <div>
              <GiSandsOfTime className="text-white text-[20px] font-bold" />
              <div className="pl-6">
                <div className="text-white font-inter text-[30px] font-bold">
                  Your Trial Ends in{" "}
                  <span className="text-[50px]">{daysLeft.daysLeftCount}</span>{" "}
                  Days!!
                </div>
                <div className="text-[#CECECE] font-inter italic">
                  Unlock full access and continue enjoying premium features
                  without interruptions.
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center">
              <button
                className="bg-white py-4 px-6 rounded-3xl text-[#000000] font-bold font-inter"
                onClick={() => navigate("/pricing")}
              >
                Subscribe now
              </button>
              <button
                className="bg-transparent rounded-3xl underline text-[#002AFF] font-inter"
                onClick={() => navigate("/pricing")}
              >
                View plans
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-10 space-x-4">
        <div className="main flex flex-col w-[75%] space-y-2">
          <div className="one flex space-x-4 mb-5">
            <div className="flex-1 bg-gradient-to-r from-[#066882] to-[#00CBFF] text-white rounded-lg p-5 relative max-h-[150px] border border-gray-300">
              <div className="flex items-center mb-2 text-lg font-inter">
                Total Card Views
                {isLaptopView ? (
                  ""
                ) : (
                  <IoEyeOutline className="absolute top-4 right-4 text-white text-lg" />
                )}
              </div>
              <div className="flex justify-between mt-3">
                <div className="text-start">
                  <p className="text-4xl">{callCount || 0}</p>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-white text-black rounded-lg p-5 relative max-h-[150px] border border-gray-300">
              <div className="flex items-center mb-2 text-lg font-inter">
                Communities Joined
                {isLaptopView ? (
                  ""
                ) : (
                  <SiGotomeeting className="absolute top-4 right-4 text-gray-400 text-lg" />
                )}
              </div>
              <div className="flex justify-between mt-3">
                <div className="text-start">
                  <p className="text-4xl">{communityJoinCount}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <MonthlyDataGraph />
          </div>
        </div>

        <div className="border border-[#ccc] p-2.5 mr-1.5 rounded-lg">
          <BusinessCardPreview cardData={card} />

          <div className="flex justify-between gap-4 mt-5 items-center m-2">
            <button
              onClick={handleEditClick}
              className="flex items-center px-4 py-2 text-white bg-[#035E7B] rounded hover:bg-[#024d63] transition"
            >
              <FaEdit className="mr-2" /> Edit Card
            </button>
            <button
              onClick={handleShareClick}
              className="flex items-center px-4 py-2 text-black border border-gray-300 rounded hover:bg-gray-100 transition"
            >
              <FaShareAlt className="mr-2" /> Share Card
            </button>
          </div>

          {isModalOpen && (
            <ShareModal
              url={shareUrl}
              onClose={handleCloseModal}
              name={card.fullName}
              qCardId={card.userQCardId}
            />
          )}
        </div>
      </div>
    </div>
  );

  return isMobileView ? renderMobileView() : renderDesktopView();
};

export default UserDashboard;