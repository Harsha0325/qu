import React, { useEffect, useState, useContext } from "react";
import {
  Table,
  Spin,
  Alert,
  Dropdown,
  Button,
  Input,
  Row,
  Col,
  Breadcrumb,
  notification,
  Modal
} from "antd";

import { SlOptionsVertical } from "react-icons/sl";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaCircleUser } from "react-icons/fa6";
import { IoSearch, IoArrowBack } from "react-icons/io5";
import { IoIosPeople } from "react-icons/io";
import { FaAngleRight } from "react-icons/fa6";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { CiShop } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { AiOutlineThunderbolt } from "react-icons/ai";
import Api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { RolesContext } from "../../context/RoleContext";
import ShareCommunityPopup from "./ShareCommunityPopup";

const CommunityMembers = () => {
  const { userId } = useContext(RolesContext);
  const { communityId } = useParams(); // Retrieve communityId from URL
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [community, setCommunity] = useState(null); // State for community data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768); // Define isSmallScreen state
  const navigate = useNavigate(); // Hook for navigating back
  const { jwtToken, refreshToken } = useAuth() || {}; // Assuming refreshToken is available in the Auth context
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [adminName, setAdminName] = useState(""); // State for admin name
  const [joinRequestCount, setJoinRequestCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false); // State for admin name

  const [communityRequest, setCommunityRequest] = useState(false); // State for admin name X state for opening join request page
  const [communityRequestList, setCommunityRequestList] = useState([]);

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

  const fetchCommunityRequests = async () => {
    setLoading(true);
    try {
      // Fetch community join requests details
      const communityResponse = await Api.get(`/${communityId}/join-requests`);
      setCommunityRequestList(communityResponse.data);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Unauthorized error, attempt token refresh
        await handleUnauthorizedError();
        return;
      }
      console.error("Error fetching community join requests:", error);
      setError(`Failed to load community join requests. Error: ${error.message}`);
      setLoading(false);
    }
  }

  const fetchCommunityMembers = async () => {
    setLoading(true);
    try {
      // Fetch community members
      const membersResponse = await Api.get(
        `/communityUsers/${communityId}`
      );
      setMembers(membersResponse.data);
      setFilteredMembers(membersResponse.data);
      const admin = membersResponse.data.find(
        (member) => member.role === "ADMIN"
      );
      setAdminName(admin ? admin.fullName : "Unknown");

      const loggedInUserId = userId;
      const isAdmin = admin && admin.id === parseInt(loggedInUserId);
      setIsAdmin(isAdmin);
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
  }

  useEffect(() => {
    if (!communityId) {
      setError("Community ID is not provided.");
      setLoading(false);
      return;
    }

    const fetchCommunityData = async () => {
      setLoading(true);

      try {
        // Fetch community details
        const communityResponse = await Api.get(`/community/${communityId}`);
        setCommunity(communityResponse.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Unauthorized error, attempt token refresh
          await handleUnauthorizedError();
          return;
        }
        console.error("Error fetching community:", error);
        setError(`Failed to load community. Error: ${error.message}`);
      }

      fetchCommunityRequests();
      fetchCommunityMembers();
      setLoading(false);
    };

    fetchCommunityData();
  }, [communityId, refreshToken]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
    setFilteredMembers(
      members.filter(
        (member) =>
          (member.fullName &&
            member.fullName.toLowerCase().includes(value.toLowerCase())) ||
          (member.jobTitle &&
            member.jobTitle.toLowerCase().includes(value.toLowerCase())) ||
          (member.companyName &&
            member.companyName.toLowerCase().includes(value.toLowerCase()))
      )
    );
  };

  const showDeleteModal = (deleteUserId) => {
    setUserToDelete(deleteUserId);
    setIsDeleteModalVisible(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      await removeMember(userToDelete);

      if(userId === userToDelete) {
        handleCancelDelete();
        navigate("/community");
      } else {
        handleCancelDelete();
      }
    }
  };

  const removeMember = async(deleteUserId) => {
    try {
      const response = await Api.delete(`/${communityId}/remove-user/${deleteUserId}`);
      if(response.status === 200) {
        notification.info({
          message: "Removed",
          description: "User Removed successfully!"
        });
      }
      fetchCommunityMembers();
    } catch(error) {
      notification.error({
        message: "Failed to Remove the member",
        description: "An error occurred. Please try again.",
      });
      fetchCommunityMembers();
    }
  }

  const handleMenuClick = async(e, nthUserId, userQCardId) => {
    if (e.key === "1") {
      const url = `${window.location.origin}/business-card/${userQCardId}`;
      window.open(url, "_blank");
    } else if (e.key === "2") {
      alert("Make admin clicked");
    } else if (e.key === "3") {
      showDeleteModal(nthUserId);
    } else if (e.key == "4") {
      showDeleteModal(nthUserId);
    }
  };

  const groupOptions = [
    {
      key: "1",
      label: "Share Community",
      onClick: (e) => showShareModal()
    }
  ]

  const menuItems = (nthUserId, userQCardId) => {
    const items = [
      {
        key: "1",
        label: `Profile Details`,
        onClick: (e) => handleMenuClick(e, nthUserId, userQCardId),
      }
    ];
  
    // Only add "Make Admin" and "Remove Member" if user is an admin
    if (isAdmin && userId !== nthUserId) {
      items.push(
        // {
        //   key: "2",
        //   label: "Make Admin",
        //   onClick: (e) => handleMenuClick(e, nthUserId, userQCardId),
        // },
        {
          key: "3",
          label: "Remove Member",
          onClick: (e) => handleMenuClick(e, nthUserId, userQCardId),
        }
      );
    }
    if (!isAdmin && userId === nthUserId) {
      items.push(
        {
          key: "4",
          label: "Leave Community",
          onClick: (e) => handleMenuClick(e, nthUserId, userQCardId),
        }
      );
    }
  
    return items;
  };

  const openProfile = (userId) => {
    const url = `${window.location.origin}/business-card/${userId}`;
    window.open(url, "_blank");
  };

  const handleAccept = async(userId) => {
    try {
      const response = await Api.post(`/${communityId}/accept/${userId}`);
      if (response.status === 200) {
        notification.success({
          message: "Success",
          description: "Join request accepted.",
        });
      }
      fetchCommunityRequests();
    } catch (error) {
      notification.error({
        message: "Failed to Accept the member",
        description: "An error occurred. Please try again.",
      });
      fetchCommunityRequests();
    }
  }

  const handleIgnore = async(userId) => {
    try {
      const response = await Api.delete(`/${communityId}/reject/${userId}`);
      if (response.status === 204) {
        notification.info({
          message: "Rejected",
          description: "Join request declined successfully.",
        });
      }
      fetchCommunityRequests();
    } catch (error) {
      notification.error({
        message: "Failed to reject the member",
        description: "An error occurred. Please try again.",
      });
      fetchCommunityRequests();
    }
  }

  const showShareModal = () => {
    setIsShareModalVisible(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalVisible(false);
  };

  const handleMenuForShareCommunityClick = (e) => {
    if (e.key === "1") {
      showShareModal();
    }
  };

  const handleRedirect = () => {
    navigate(`/join`, { state: { communityId } });
  };

  const menuForShareCommunity = [
    {
      key: "1",
      label: "Share Community",
      onClick: handleMenuForShareCommunityClick, // Handle the click event
    },
  ];

  useEffect(() => {
    const fetchJoinRequestCount = async () => {
      try {
        const response = await Api.get(`/${communityId}/join-request-count`);

        setJoinRequestCount(response.data.joinRequestCount);
        setLoading(false);
      } catch (error) {
        setError("Error fetching the join request count");
        setLoading(false);
      }
    };

    fetchJoinRequestCount();
  }, [communityId, jwtToken]);

  const columns = [
    {
      render: (text, record) => (
        <div className={`flex items-center ${record.role === "ADMIN" ? "border-l-4 border-[#00CBFF] rounded-[6px]" : ""}`}>
          {record.image ? 
          <img
            src={record.image}
            alt="Profile"
            className="rounded-[50%] w-[80px] h-[80px] cursor-pointer m-2"
            onClick={() => openProfile(record.userQCardId)}
          />
          :
          <FaCircleUser className="rounded-[50%] w-[80px] h-[80px] cursor-pointer m-2 text-gray-300" />
          }
          <div style={{ marginLeft: 10, flex: 1 }}>
            <div className="flex justify-between items-center">
              <div className="mr-[10px]">
                <p
                  className="m-0 font-[1rem] font-inter text-black cursor-pointer"
                  onClick={() => openProfile(record.userQCardId)}
                >
                  {" "}
                  {record.fullName}{" "}
                </p>
                <p className="m-0 font-[0.875rem] font-inter text-[#3B4950]">
                  {record.jobTitle}
                  {record.companyName ? ` | ${record.companyName}` : ""}
                </p>
                <div className="hidden lg:flex lg:flex-row lg:justify-start lg:items-center lg:gap-2 md:text-xs">
                  <div className="flex flex-row justify-start items-start text-white">
                    { record?.productsCount || record?.serviceCount ?
                    <div className="box-border flex flex-row justify-start items-center px-3 py-1 rounded-[50px] min-w-[20px] [background:linear-gradient(126.71deg,_#00cbff,_#066882)]">
                      <div className="relative flex-1 font-medium leading-[100%]">
                        {record?.productsCount ? record.productsCount : "0"} products • {record?.serviceCount ? record.serviceCount : "0"} services
                      </div>
                    </div>
                    : "" }
                  </div>
                  <div className="flex flex-row justify-start items-center gap-0.5 text-product-type-type-600">
                    <AiOutlineThunderbolt className="relative w-4 h-4 shrink-0 text-gray-500" />
                    <div className="relative leading-[130%]">
                      1 mutual network
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                {record.role === "ADMIN" && (
                  <div className="hidden lg:flex items-center">
                    {" "}
                    <div className="bg-[E9F2E8] mr-[10px] px-[2px] py-[6px] rounded-[4px] text-[#1B5A10]">
                      Community {record.role.toLowerCase()}
                    </div>
                  </div>
                )}
                {/* <div className="flex flex-row justify-start items-start text-product-primary-primary-500">
                  <div className="flex flex-row justify-center items-center border-[1px] border-product-primary-primary-500 px-5 py-2 border-solid rounded overflow-hidden" style={{ borderColor: '#035E7B', color: '#035E7B' }}>
                    <div className="relative font-medium leading-[145%]">
                      Connect
                    </div>
                  </div>
                </div> */}
                <Dropdown
                  menu={{ items: menuItems(record.id, record.userQCardId) }}
                  trigger={["click"]}
                >
                  <Button icon={<SlOptionsVertical />} type="text" className="text-gray-600" />
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div
        className={`p-[20px] ${
          isSmallScreen ? "0px" : "240px"
        } flex justify-center items-center h-[90vh]`}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`ml-[${isSmallScreen ? "0px" : "240px"}] p-[20px]`}>
        {" "}
        <Alert message="Error" description={error} type="error" />
      </div>
    );
  }

  return (
    <div
      className={`${
        isSmallScreen ? "pl-[0px] pr-[0px] m-0" : "pl-[260px]"
      } flex  items-start justify-center  min-w-[300px] p-10 mt-[20px] w-full h-full font-inter`}
    >
      <div className={`max-w-[1440px] w-[1080px] overflow-hidden`}>
        {/* Community Header */}
        <div className="flex items-center mb-[10px]">
          <IoArrowBack
            className="text-[#677379] text-[24px] cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <div className="flex w-full">
            <Breadcrumb items={[
              { title: 'My Communities' },
              { title: community?.communityName, href: '' },
            ]} />
          </div>
        </div>

        {!communityRequest && (
          <>
            {community && (
              <>
                <div className="border rounded-lg my-6 overflow-hidden">
                  <div className="top-0 sticky w-full h-[40%]">
                    <div
                      style={{ background: "linear-gradient(106deg, rgba(0,18,22,1) 0%, rgba(6,163,242,1) 100%)" }}
                      className="w-[1127px] h-[170px]"
                      alt="Community Navigation"
                    />
                  </div>

                  <div className="relative bottom-0 flex flex-wrap lg:flex-nowrap items-center w-full">
                    <div className="-mt-10 mb-4 border-[5px] border-white mx-auto lg:mx-[32px] rounded-full w-[120px] lg:w-[160px] h-[120px] lg:h-[160px] overflow-hidden shadow">
                      <img
                        src={community.groupIcon}
                        alt="Group Icon"
                        className="w-full h-full object-cover bg-gray-200 rounded-full"
                      />
                    </div>

                    <div className="flex flex-col justify-center items-center gap-4 p-4 lg:p-0 w-full lg:w-[calc(100%-200px)] text-left lg:text-center">
                      <div className="flex justify-between w-full">
                        <div className="flex lg:flex-row flex-col items-center gap-3 lg:gap-[12px] w-full">
                          <p className="font-bold text-lg lg:text-[30px]">
                            {community.communityName.toUpperCase()}
                          </p>
                          <div className="flex items-center border-2 px-2 border-[#066882] rounded-full">
                            <div className="border-[#066882] border-[2px] lg:border-[5px] mr-2 rounded-full"></div>
                            <span className="text-[#066882] text-sm lg:text-base">
                              {/* first letter capital and then lowercase */}
                            {community.accountType.slice(0,1).toUpperCase() + community.accountType.toLowerCase().slice(1,)} Group
                            </span>
                          </div>
                        </div>
                        <div>
                          <Dropdown
                            menu={{ items: groupOptions }}
                            trigger={["click"]}
                          >
                            <Button icon={<SlOptionsVertical />} type="text" className="text-gray-600 mr-2" />
                          </Dropdown>
                        </div>
                      </div>

                      <div className="flex lg:flex-row flex-col items-center gap-2 lg:gap-[12px] w-full">
                        <IoIosPeople className="text-gray-600 text-xl" />
                        <p className="text-[#242C30]">{filteredMembers.length} members</p>
                        <p className="text-[#9e9e9e]">
                          | created by{" "}
                          <span className="text-[#242C30]">
                            {adminName}
                          </span>
                        </p>
                      </div>

                      <p className="w-full text-[#475467] lg:text-left text-sm text-center lg:text-[14px]">
                        {community.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative flex flex-row flex-wrap justify-between items-stretch gap-4 mb-2 w-full font-inter text-gray-900 text-left text-sm flex-col lg:flex-row">
                  <div className="box-border flex flex-col justify-stretch items-start border-[1px] border-gray-200 bg-base-white shadow-[0px_1px_2px_rgba(16,_24,_40,_0.05)] p-3 border-solid rounded-xl flex-1">
                    <div className="flex flex-row justify-start items-center gap-4 w-full">
                      <div className="p-2" style={{borderRadius: "8px", background: "linear-gradient(106deg, rgba(217,240,245,1) 0%, rgba(137,186,212,1) 100%)"}}>
                        <div className="p-4" style={{borderRadius: "4px", background: "linear-gradient(165deg, rgba(70,212,244,1) 0%, rgba(5,65,80,1) 100%)", position: "absolute", zIndex: -1, transform: "rotate(12deg)"}}></div>
                        <IoIosPeople className="text-[#057e9e] text-xl" />
                      </div>
                      <div className="relative flex-1 leading-[24px] whitespace-pre-wrap">Total Members</div>
                      <div className="relative font-medium text-xl leading-[44px] tracking-[-0.02em]">
                        {filteredMembers.length}
                      </div>
                    </div>
                  </div>
                  <div className="box-border flex flex-col justify-start items-start border-[1px] border-gray-200 bg-base-white shadow-[0px_1px_2px_rgba(16,_24,_40,_0.05)] p-3 border-solid rounded-xl flex-1">
                    <div className="flex flex-row justify-start items-center gap-4 w-full">
                      <div className="p-2" style={{borderRadius: "8px", background: "linear-gradient(106deg, rgba(217,240,245,1) 0%, rgba(137,186,212,1) 100%)"}}>
                        <div className="p-4" style={{borderRadius: "4px", background: "linear-gradient(165deg, rgba(70,212,244,1) 0%, rgba(5,65,80,1) 100%)", position: "absolute", zIndex: -1, transform: "rotate(12deg)"}}></div>
                        <HiMiniArrowTrendingUp className="text-[#057e9e] text-xl" />
                      </div>
                      <div className="relative flex-1 leading-[24px]">
                        Churn Rate
                      </div>
                      <div className="relative font-medium text-xl leading-[44px] tracking-[-0.02em]">
                        10%
                      </div>
                    </div>
                  </div>
                  <div className="box-border flex flex-col justify-start items-start border-[1px] border-gray-200 bg-base-white shadow-[0px_1px_2px_rgba(16,_24,_40,_0.05)] p-3 border-solid rounded-xl flex-1">
                    <div className="flex flex-row justify-start items-center gap-4 w-full">
                      <div className="p-2" style={{borderRadius: "8px", background: "linear-gradient(106deg, rgba(217,240,245,1) 0%, rgba(137,186,212,1) 100%)"}}>
                        <div className="p-4" style={{borderRadius: "4px", background: "linear-gradient(165deg, rgba(70,212,244,1) 0%, rgba(5,65,80,1) 100%)", position: "absolute", zIndex: -1, transform: "rotate(12deg)"}}></div>
                        <CiShop className="text-[#057e9e] text-xl" />
                      </div>
                      <div className="relative flex-1 leading-[24px]">
                        Total Product Listings
                      </div>
                      <div className="relative font-medium text-xl leading-[44px] tracking-[-0.02em]">
                        30
                      </div>
                    </div>
                  </div>
                </div>
                {isAdmin ?
                <div className={`${community.accountType === "PUBLIC" ? "hidden" : ""} relative box-border flex flex-row justify-end items-center gap-3 bg-gray-200 mb-2 px-4 py-2.5 rounded w-full font-archivo text-[14px] text-left text-product-type-type-400`}>
                  <div className="flex flex-col justify-start items-start self-stretch">
                    <div
                      onClick={() => {
                        setCommunityRequest(true);
                      }}
                      className="relative flex flex-row justify-center items-center gap-2 cursor-pointer"
                    >
                      <div>
                        <IoIosNotificationsOutline className="relative z-[0] w-5 h-5 overflow-hidden shrink-0" />
                      </div>
                      
                      <div className="relative z-[2] leading-[145%]">
                        {joinRequestCount} new member requests
                      </div>

                    </div>
                  </div>
                  <FaAngleRight className="text-gray-500 text-xl"/>
                </div>
                : "" }
              </>
            )}
            <Row
              justify="space-between"
              align="middle"
              className="border-[#8A2BE2] mb-[16px] mt-10"
            >
              <Col xs={24} sm={12}>
                <Input
                  value={searchText}
                  placeholder="Search community"
                  onChange={(e) => handleSearch(e.target.value)}
                  prefix={<IoSearch />}
                  // enterButton={
                  //   <Button className="border-[#035E7B] border-3 bg-[#035E7B] text-white">
                  //     <IoSearch />
                  //   </Button>
                  // }
                  className="w-[320px] h-10"
                />
              </Col>
              <Col xs={24} sm={12} className="text-right">
                <p>{filteredMembers?.length} Members</p>
              </Col>
            </Row>
          </>
        )}

        {!communityRequest && (
          <div className="border-[#ECEEEE] border-[1px] rounded p-[5px] mb-10">
            <Table
              dataSource={filteredMembers}
              columns={columns}
              rowKey="id"
              pagination={false}
              scroll={{ x: isSmallScreen ? "max-content" : undefined }}
              showHeader={false}
            />
          </div>
        )}

        {/* =============================================================================================
                                            Community Requests window
            ============================================================================================= */}
        {communityRequest && (
          <div className="border-[#ECEEEE] p-[5px]">
            <div className="relative flex flex-row justify-between items-center w-full font-archivo text-[20px] text-black text-left">
              <div className="relative font-medium leading-[135%]">
                Community Requests
              </div>
              <div className="relative font-inter text-product-type-type-800 text-sm leading-[145%]">
                {communityRequestList.length} members
              </div>
            </div>
            <div className="border-[1px] rounded-l mt-4 overflow-x-auto">
            {communityRequestList.map((data) => (
              <div className="rounded-xl flex" key={data.id}>
                <div
                  className="flex flex-row gap-14 max-sm:flex-col justify-between items-start max-sm:gap-2 border-product-outline-outline-200 m-2 mb-0 p-2 border-b-[1px] border-solid w-full font-product-14-145lh-medium text-base text-left text-product-type-type-800"
                >
                  <div className="flex gap-4">
                    {data.user.image ? 
                      <img
                        className="w-20 h-20 rounded-[50%]"
                        src={data.user.image}
                        alt="profile image"
                      />
                    :
                      <FaCircleUser className="rounded-[50%] w-[80px] h-[80px] cursor-pointer m-2 text-gray-300" />
                    }
                    <div>
                    </div>
                    <div className="flex flex-col justify-center items-start">
                      <div className="flex flex-col justify-center items-start gap-2 px-0 py-1">
                        <div className="flex flex-col justify-center items-start self-stretch">
                          <div className="relative font-medium leading-[150%] self-stretch">
                            {data.user.fullName}
                          </div>
                          <div className="flex flex-row justify-start items-start gap-1 text-product-type-type-600 text-sm">
                            <div className="relative leading-[145%]">
                              {data.user.jobTitle}
                            </div>
                            <div className="relative leading-[145%]">|</div>
                            <div className="relative leading-[145%]">
                              {data.user.companyName}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row justify-start items-center gap-2 text-xs">
                          <div className="flex flex-row justify-start items-start text-white">
                          { data.user?.productsCount || data?.serviceCount ?
                            <div className="box-border flex flex-row justify-start items-center px-3 py-1 rounded-[50px] min-w-[20px] [background:linear-gradient(126.71deg,_#00cbff,_#066882)]">
                              <div className="relative flex-1 font-medium leading-[100%]">
                                {data?.productsCount ? data.productsCount : "0"} products • {data?.serviceCount ? data.serviceCount : "0"} services
                              </div>
                            </div>
                            : "" }
                          </div>
                          <div className="flex flex-row justify-start items-center gap-0.5 text-product-type-type-600">
                          <AiOutlineThunderbolt className="relative w-4 h-4 shrink-0 text-gray-500" />
                            <div className="relative leading-[130%]">
                              1 mutual network
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row flex-wrap max-sm:w-full max-sm:justify-center justify-start items-center gap-24 sm:gap-4 text-center text-product-type-type-500 text-sm h-full">
                    <div className="flex flex-row justify-start items-start">
                      <div className="flex flex-row justify-center items-center rounded cursor-pointer" onClick={() => handleIgnore(data.user.id)}>
                        <div className="relative font-medium leading-[145%] text-[#415058]">
                          Ignore
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row justify-start items-start text-product-primary-primary-500">
                      <div className="flex flex-row justify-center items-center border-[1px] border-product-primary-primary-500 px-5 py-2 border-solid rounded cursor-pointer" 
                        style={{ borderColor: '#035E7B', color: '#035E7B' }}
                        onClick={() => handleAccept(data.user.id)}>
                        <div className="relative font-medium leading-[145%">
                          Accept
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        )}
      </div>

      {isShareModalVisible && (
        <ShareCommunityPopup
          url={`${window.location.origin}/oauth/login?communityId=${communityId}`}
          onClose={handleCloseShareModal}
          communityName={community?.communityName}
        />
      )} 
{/*   ====================================================================================== */}
{/*                 Modal for both remove user as well as exit community */}
{/*   ====================================================================================== */}
      <Modal
        open={isDeleteModalVisible}
        footer={null}
        onCancel={handleCancelDelete}
        centered
        className="w-[380px]"
      >
        <div>
          <div className="flex justify-between items-center mb-5">
            <RiDeleteBin6Line className="bg-red-100 p-1.5 rounded-full text-2xl text-red-500" />
          </div>
          <span className="font-bold font-inter text-gray-800 text-lg">
            {userId !== userToDelete ? "Remove Member?" : "Exit Community?" }
          </span>
          <p className="mt-4 font-inter text-gray-600 text-sm">
            Are you sure you want to {userId !== userToDelete ? "remove the member?" : "exit the community?"}
          </p>
          <div className="flex justify-end mt-6">
            <Button onClick={handleCancelDelete} className="mr-2">
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              type="primary"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {userId !== userToDelete ? "Remove Member" : "Exit Community"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CommunityMembers;
