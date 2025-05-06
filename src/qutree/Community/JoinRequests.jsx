import React, { useEffect, useState } from "react";
import Api from "../BaseUrlAPI";
import { useAuth } from "../../context/AuthContext";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

const JoinRequests = () => {
  const [joinRequests, setJoinRequests] = useState([]);
  const { jwtToken } = useAuth() || {};
  const navigate = useNavigate();
  const location = useLocation();
  const { communityId } = location.state || {}; // Set your communityId here

  useEffect(() => {
    const fetchJoinRequests = async () => {
      try {
        const response = await Api.get(`/${communityId}/join-requests`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        setJoinRequests(response.data);
      } catch (error) {
        console.error("Error fetching join requests:", error);
      }
    };

    fetchJoinRequests();
  }, [communityId, jwtToken]);

  const handleAccept = async (quickyNetId) => {
    console.log("Accepting join request for quickyNetId:", quickyNetId);
    if (!quickyNetId) {
      console.error("quickyNetId is undefined");
      return;
    }

    try {
      await Api.post(
        `/${communityId}/accept/${quickyNetId}`,
        {},
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      setJoinRequests((prevRequests) =>
        prevRequests.filter((req) => req.quickyNet.id !== quickyNetId)
      );
    } catch (error) {
      console.error("Error accepting join request:", error);
    }
  };

  const handleReject = async (quickyNetId) => {
    try {
      await Api.delete(`/${communityId}/reject/${quickyNetId}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      setJoinRequests((prevRequests) =>
        prevRequests.filter((req) => req.quickyNet.id !== quickyNetId)
      );
    } catch (error) {
      console.error("Error rejecting join request:", error);
    }
  };

  return (
    <div className="ml-64 mt-10">
      <IoArrowBack
        className="text-2xl cursor-pointer text-gray-600"
        onClick={() => navigate(-1)}
      />
      <p className="mb-6 text-base font-inter text-gray-600">
        My Communities <MdOutlineArrowForwardIos className="text-gray-600" />{" "}
        <span className="text-base text-gray-800 font-inter">
          {joinRequests[0]?.community?.communityName || "Community Name"}{" "}
          <MdOutlineArrowForwardIos className="text-gray-600" /> Community
          Requests
        </span>
      </p>
      <div className="font-archivo text-xl mb-5">Community Requests</div>
      {joinRequests.length > 0 ? (
        <div className="flex flex-col w-full max-w-2xl">
          {joinRequests.map((request) => (
            <div
              key={request.quickyNet.id}
              className="flex items-center mb-4 border border-gray-200 p-2 rounded"
            >
              <img
                src={request.quickyNet.image}
                alt={request.quickyNet.fullName}
                className="w-20 h-20 rounded-full mr-4"
              />
              <div className="flex-grow">
                <div className="font-inter text-base">
                  {request.quickyNet.fullName}
                </div>
                <div>
                  {request.quickyNet.companyName || "N/A"} |{" "}
                  {request.quickyNet.jobTitle || "N/A"}
                </div>
              </div>
              <div className="ml-auto">
                <button
                  className="border-none bg-white p-1 font-inter"
                  onClick={() => handleReject(request.quickyNet.id)}
                >
                  {" "}
                  Ignore
                </button>
                <button
                  className="ml-2 text-[#035E7B] p-2 border border-[#035E7B] bg-white rounded"
                  onClick={() => handleAccept(request.quickyNet.id)}
                >
                  Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No join requests available.</p>
      )}
    </div>
  );
};

export default JoinRequests;
