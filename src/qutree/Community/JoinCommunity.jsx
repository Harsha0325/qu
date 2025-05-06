import React, { useState, useEffect } from "react";
import { Card, Button, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext"; // Assuming you have an auth context that provides userId and jwtToken
import { useNavigate } from "react-router-dom";
import { IoIosPeople } from "react-icons/io";
import { FaGlobeAmericas } from "react-icons/fa";
import Api from "../api";
const JoinCommunity = () => {
  const { userId, jwtToken } = useAuth() || {}; // Get userId and jwtToken from useAuth
  const [loading, setLoading] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [community, setCommunity] = useState(null); // State to hold community data
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch community data based on the communityId in the query params
    const fetchCommunity = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const communityId = queryParams.get("communityId");

      try {
        const response = await Api.get(`/get-community-by-id/${communityId}`, {
          headers: { Authorization: `Bearer ${jwtToken}` }, // Add the JWT token here
        });
        setCommunity(response.data);
      } catch (error) {
        console.error("Error fetching community data", error);
        setErrorMessage("Error fetching community data.");
      }
    };

    fetchCommunity();
  }, [jwtToken]); // Add jwtToken as dependency to ensure it is available

  const joinCommunity = async (communityId, userId) => {
    try {
      setLoading(true);
      const response = await Api.post(`/${communityId}/join`, null, {
        params: { quickyNetId: userId }, // Pass userId as query parameter
      });

      if (response.status === 200) {
        setJoinSuccess(true);
        setLoading(false);
        setTimeout(() => {
          navigate(`/community`); // Redirect to the community page after a short delay
        }, 2000); // 2-second delay before redirect
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage("Error joining community. Please try again.");
      console.error("Error joining community", error);
    }
  };

  const handleJoinClick = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const communityId = queryParams.get("communityId");

    if (jwtToken) {
      // User is logged in, proceed to join the community
      joinCommunity(communityId, userId);
    } else {
      // User is not logged in, redirect to login page with communityId in query params
      window.location.href = `/login?communityId=${communityId}`;
    }
  };

  if (!community) {
    return (
      <Card
        style={{
          maxWidth: 400,
          margin: "50px auto",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" color="textSecondary">
          {errorMessage || "Loading community data..."}
        </Typography>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col justify-center items-center w-[350px] mt-[50px] p-[20px] mx-auto rounded-[50%]">
      {community.groupIcon && (
        <img
          src={community.groupIcon}
          alt="Group Icon"
          className="rounded-[50%] w-[160px] h-[160px] cursor-pointer m-2"
        />
      )}
      <div style={{ fontFamily: "Archivo", fontSize: "1.25rem" }}>
        {community.communityName}
      </div>
      <p
        style={{
          fontFamily: "Archivo",
          fontSize: "0.875rem",
          color: "#677379",
        }}
      >
        <FaGlobeAmericas className="mr-1 inline" />
        {community.accountType.charAt(0).toUpperCase() +
          community.accountType.slice(1).toLowerCase()}{" "}
        Group <IoIosPeople className="text-gray-600 text-xl inline ml-2" /> {community.memberCount} members
      </p>
      {community.description && (
        <p
          style={{
            fontFamily: "Archivo",
            fontSize: "0.875rem",
            color: "#3B4950",
          }}
        >
          {community.description}
        </p>
      )}
      {loading ? (
        <CircularProgress />
      ) : joinSuccess ? (
        <Typography variant="h6" color="success.main">
          Successfully joined the community! Redirecting...
        </Typography>
      ) : (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={handleJoinClick}
            style={{ marginTop: "16px", backgroundColor: "#035E7B" }}
          >
            Join Community
          </Button>
          {errorMessage && (
            <Typography variant="body2" color="error" gutterBottom>
              {errorMessage}
            </Typography>
          )}
        </>
      )}
    </Card>
  );
};

export default JoinCommunity;
