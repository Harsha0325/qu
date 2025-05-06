import DropDown from '../../image/DropDown.svg';
import { SlOptionsVertical } from "react-icons/sl";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaCircleUser } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { User } from 'lucide-react';
import React, { useEffect, useState } from "react";

import Api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  Input,
  notification,
  Dropdown,
} from "antd";

// TODO :: smaller screen support

function CommunityChat() {
  const { communityId } = useParams(); // Retrieve communityId from URL
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768); // Define isSmallScreen state
  const navigate = useNavigate(); // Hook for navigating back
  const { jwtToken, refreshToken } = useAuth() || {}; // Assuming refreshToken is available in the Auth context
  // const [adminName, setAdminName] = useState(""); // State for admin name
  // const [isAdmin, setIsAdmin] = useState(false); // State for admin name


  const profileItems = [
    {
      key: "1",
      label: "Search"
      // onClick can be specified
    },
    {
      key: "2",
      label: "Community Info"
    },
    {
      key: "3",
      label: "Exit Community"
    },
    {
      key: "4",
      label: "Report"
    }]

  const openNotification = (message) => {
    notification.error({
      message: "API Error",
      description: message,
    });
  };

  const handleUnauthorizedError = async () => {
    try {
      // Try to refresh the token
      const newToken = await refreshToken(); // Assuming `refreshToken` is a function that fetches a new JWT
      if (newToken) {
        localStorage.setItem("jwtToken", newToken); // Save the new token
        setLoading(true); // Set loading to true to retry the API calls
      }
    } catch (error) {
      openNotification("Session expired. Please login again.");
    }
  };

  useEffect(() => {
    if (!communityId) {
      setError("Community ID is not provided.");
      setLoading(false);
      return;
    }

    const fetchCommunityMembers = async () => {
      setLoading(true);

      try {
        // Fetch community members
        const membersResponse = await Api.get(`/communityUsers/${communityId}`);
        setMembers(membersResponse.data);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Unauthorized error, attempt token refresh
          await handleUnauthorizedError();
          return;
        }
        console.error("Error fetching community members:", error);
        setError(`Failed to load community members. Error: ${error.message}`);
        setLoading(false);
      }
    };

    fetchCommunityMembers();
  }, [communityId, jwtToken, refreshToken]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
  }

  const handleMessage = (value) => {
    setMessageText(value);
  }

  const handlePersonClick = (person) => {
    setSelectedPerson(person);
  };

    return (
        <div
            className={`${
                isSmallScreen ? "pl-[0px] pr-[0px] m-0" : "pl-[260px]"
            } flex  items-start justify-center  min-w-[400px] p-10 pt-[30px] w-full h-full`}
        >
            <div className="h-full w-1/5 p-1 min-w-[360px]">
                <div className="p-2">
                    <FaArrowLeftLong className="text-3xl text-gray-700" onClick={()=>navigate(-1)} />
                </div>
                <div className="h-[100px]">
                    <div className="flex justify-between p-4 flex-shrink-0">
                        <div>
                            <h2 className="text-xl font-bold">Messages</h2>
                        </div>
                        <div>
                            <img
                                loading="lazy"
                                src={DropDown}
                                className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square cursor-pointer"
                                alt="Back"
                                
                            />
                        </div>
                    </div>
                    <div>
                        <Input
                            className="w-full h-10"
                            placeholder="Search"
                            value={searchText}
                            onChange={(e) => handleSearch(e.target.value)}
                            prefix={<IoSearch className="text-[#6e7172]" />}
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        {members.map((person, index) => (
                            <div
                            key={person.id}
                            className={`p-4 hover:bg-gray-50 cursor-pointer border-b ${
                                selectedPerson?.id === person.id ? 'bg-gray-100' : ''
                            }`}
                            onClick={() => handlePersonClick(person)}
                            >
                            <div className="flex items-center gap-3">
                                <div className="h-16 w-16 rounded-full flex-shrink-0 flex items-center justify-center">
                                  {person.image ?
                                    <img
                                        src={person.image}
                                        alt="Profile"
                                        className="rounded-[50%] w-full h-full cursor-pointer"
                                    />
                                    :
                                    <FaCircleUser className="rounded-[50%] w-full h-full cursor-pointer text-gray-300" />
                                  }
                                </div>
                                <div className="w-full ml-2">
                                    <h3 className="font-medium truncate">{person.fullName}</h3>
                                    <div className="flex justify-between text-sm text-gray-500 truncate">
                                        <p className="text-sm text-gray-500 truncate">Sam: Hi fellas, I'm gonna do..</p>
                                        <p>4:32</p>
                                    </div>
                                </div>
                            </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="h-full w-4/5 border-l-2 mr-16 min-w-[600px]">
                 {/* header  */}
                <div className="flex items-center justify-between border-b">
                    <div className="flex flex-1">
                      {selectedPerson ? 
                      ( selectedPerson.image ?
                          <img
                          src={selectedPerson.image}
                          alt="Profile"
                          className="rounded-[50%] w-[70px] h-[70px] cursor-pointer m-4 bg-gray-200"
                          />
                          :
                          <FaCircleUser className="rounded-[50%] w-[70px] h-[70px] cursor-pointer m-4 text-gray-300" />
                      )
                      :
                      <FaCircleUser className="rounded-[50%] w-[70px] h-[70px] cursor-pointer m-4 text-gray-300" />
                      }
                        <div className="flex flex-col justify-center m-2">
                            <p className="text-xl font-bold">{selectedPerson ? selectedPerson.fullName : "Select a chat"}</p>
                            <p>2,45,678 Members</p>
                        </div>
                    </div>
                    <div className="p-2">
                    <Dropdown menu={{ items: profileItems}} placement="bottomRight" trigger={['click']}>
                        <SlOptionsVertical className="text-2xl cursor-pointer"/>
                    </Dropdown>
                    </div>
                </div>

                <div className="flex flex-col justify-between">
                    <div className="content h-[650px]">
                        {/* message history area */}
                    </div>
                    <div className="p-2">
                        <Input
                            className="w-full h-10"
                            placeholder="Type a message"
                            value={messageText}
                            onChange={(e) => handleMessage(e.target.value)}
                            style={{ borderRadius: '18px', border: '1px solid gray' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommunityChat;

