import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Row,
  Col,
  Input,
  Button,
  notification,
  Modal,
  message,
  Card,
  Space,
  Tooltip,
  Empty,
  Spin,
} from "antd";
import { Pagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Api from "../api";
import { useAuth } from "../../context/AuthContext";
import ShareCommunityPopup from "./ShareCommunityPopup";
import { FaPlus } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RolesContext } from "../../context/RoleContext";
import {
  ExploreCommunityCard,
  MyCommunityCardWithChat,
  SubTab,
} from "./Utility";
import { InfoCircleOutlined } from "@ant-design/icons";

// const { Search } = Input;

const CommunityList = () => {
  const [childIndex, setChildIndex] = useState(0);
  const [communities, setCommunities] = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [requestedCommunities, setRequestedCommunities] = useState([]);
  const [exploreCommunities, setExploreCommunities] = useState([]);
  const [newestCommunities, setNewestCommunities] = useState([]);
  const [popularCommunities, setPopularCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [selectedCommunityName, setSelectedCommunityName] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("myCommunity");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const { jwtToken } = useAuth() || {};
  const { userId } = useContext(RolesContext);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const [searchText, setSearchText] = useState("");
  const [mycommunityPinindex, setMycommunityPinindex] = useState([]);
  const [explorecommunityPinindex, setExplorecommunityPinindex] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [communityToDelete, setCommunityToDelete] = useState(null);
  const [communityNameToDelete, setCommunityNameToDelete] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [communityToEdit, setCommunityToEdit] = useState(null);
  const [communityNameToEdit, setCommunityNameToEdit] = useState(null);
  const [editData, setEditData] = useState({});
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(communities.length / itemsPerPage);

  const handleSubTabClick = (index) => {
    setCurrentPage(1);
    setChildIndex(index);
  }

  const subTabs = useMemo(() => ["My Communities", "Requested"], []);
  const subTabs2 = useMemo(() => ["All", "Newest", "Popular"], []);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!userId) return; // Prevent fetching if userId or token is missing
    setLoading(true);
    if (activeTab === "myCommunity") {
      childIndex === 0 ? fetchMyCommunities() : fetchRequestedCommunities();
    } else {
      if (childIndex === 0) fetchAllCommunities();
      else if (childIndex === 1) fetchNewestCommunities();
      else if (childIndex === 2) fetchPopularCommunities();
    }
  }, [userId, activeTab, childIndex, jwtToken]);

  const fetchMyCommunities = useCallback(async () => {
    setLoading(true);
    try {
      const response = await Api.get(`/community/users/${userId}`);
      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        setMyCommunities(data);
        setCommunities(data);
      } else {
        setMyCommunities([]);
        setCommunities([]);
        notification.destroy();
        notification.info({ message: "No communities found for you." });
      }
    } catch (error) {
      console.error("Error fetching my communities:", error);
      setMyCommunities([]);
      setCommunities([]);
      notification.destroy();
      notification.error({
        message: "Failed to Load My Communities",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchRequestedCommunities = useCallback(async () => {
    setLoading(true);
    try {
      const response = await Api.get(`/communities/join-requests/user/${userId}`);
      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        setRequestedCommunities(data);
        setCommunities(data);
      } else {
        setRequestedCommunities([]);
        setCommunities([]);
        notification.destroy();
        notification.info({ message: "No requested communities found." });
      }
    } catch (error) {
      console.error("Error fetching requested communities:", error);
      setRequestedCommunities([]);
      setCommunities([]);
      notification.error({
        message: "Failed to Load Requested Communities",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchAllCommunities = useCallback(async () => {
    setLoading(true);
    try {
      const response = await Api.get(`/communities/not-joined/${userId}`);
      const data = response.data.content || [];
      if (data.length > 0) {
        setExploreCommunities(data);
        setCommunities(data);
      } else {
        setExploreCommunities([]);
        setCommunities([]);
        notification.destroy();
        notification.info({ message: "No communities available to explore." });
      }
    } catch (error) {
      console.error("Error fetching all communities:", error);
      setExploreCommunities([]);
      setCommunities([]);
      notification.error({
        message: "Failed to Load Communities",
        description: "Unable to fetch communities. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchNewestCommunities = useCallback(async () => {
    setLoading(true);
    try {
      const response = await Api.get(`/communities/latest`, {
        params: { userId }
      });
      const data = response.data;

      if (data.length > 0) {
        setNewestCommunities(data);
        setCommunities(data);
      } else {
        setNewestCommunities([]);
        setCommunities([]);
        notification.destroy();
        notification.info({ message: "No new communities found." });
      }
    } catch (error) {
      console.error("Error fetching newest communities:", error);
      setNewestCommunities([]);
      setCommunities([]);
      notification.error({
        message: "Failed to Load Newest Communities",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }, [myCommunities]);

  const fetchPopularCommunities = useCallback(async () => {
    setLoading(true);
    try {
      const response = await Api.get(`/communities/popular`, {
        params: { userId }
      });
      const data = response.data;
      if (data.length > 0) {
        setPopularCommunities(data);
        setCommunities(data);
      } else {
        setPopularCommunities([]);
        setCommunities([]);
        notification.destroy();
        notification.info({ message: "No popular communities found." });
      }
    } catch (error) {
      console.error("Error fetching popular communities:", error);
      setPopularCommunities([]);
      setCommunities([]);
      notification.error({
        message: "Failed to Load Popular Communities",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }, [myCommunities]);

  const isRequested = (communityId) => {
    return requestedCommunities.some((community) => community.id === communityId);
  };

  const currentCommunities = communities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleShare = (communityId, communityName) => {
    setSelectedCommunity(communityId);
    setSelectedCommunityName(communityName);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedCommunity(null);
    setSelectedCommunityName(null);
  };

  const handleViewMembers = (communityId) =>
    navigate(`/community/${communityId}/members`);

  const handleCreateCommunity = () => navigate("/create/community");

  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();
    const filterCommunities = (communities) =>
      communities.filter(
        ({ communityName, accountType, description, memberCount }) =>
          [
            communityName,
            accountType,
            description || "",
            memberCount?.toString(),
          ].some((field) => field.toLowerCase().includes(searchValue))
      );
    setSearchText(value);
    if (activeTab === "myCommunity") {
      setCommunities(
        filterCommunities(
          childIndex === 0 ? myCommunities : requestedCommunities
        )
      );
    } else {
      setCommunities(
        filterCommunities(
          childIndex === 0
            ? exploreCommunities
            : childIndex === 1
            ? newestCommunities
            : popularCommunities
        )
      );
    }
  };

  const joinCommunity = async (communityId) => {
    try {
      const response = await Api.post(`/${communityId}/join`, null, {
        params: { quickyNetId: userId },
      });
      if (response.status === 200) {
        message.success("Successfully joined the community!");
        fetchMyCommunities();
        setActiveTab("myCommunity");
      }
    } catch (error) {
      console.error("Error joining community:", error);
      notification.error({
        message: "Failed to Join Community",
        description: "An error occurred while joining. Please try again.",
      });
    }
  };

  const requestJoinCommunity = async (communityId) => {
    try {
      const response = await Api.post(
        `/${communityId}/request-join/${userId}`, null);
      if (response.status === 202) {
        notification.destroy();
        message.success("Join request sent to the community admin.");
        fetchRequestedCommunities();
      } else {
        fetchMyCommunities();
      }
    } catch (error) {
      error.response?.status === 400
        ? message.info(
            "You have already sent a request to join this community."
          )
        : notification.error({
            message: "Failed to Request Join",
            description: "An error occurred. Please try again.",
          });
    }
  };

  const handleDeleteCommunity = async (communityId) => {
    try {
      const response = await Api.delete(`/delete-community/${communityId}`);
      if (response.status === 200) {
        notification.success({
          message: "Community Deleted",
          description: "The community has been deleted successfully.",
        });
        fetchMyCommunities();
      }
    } catch (error) {
      notification.error({
        message: "Delete Failed",
        description: "Failed to delete the community. Please try again.",
      });
    }
  };

  const handleEditCommunity = async (communityId, data) => {
    try {
      setCommunityToEdit(communityId);
      navigate("/edit/community", { state: { communityId, data } });
    } catch (error) {
      notification.error({
        message: "Edit Failed",
        description: "Failed to edit the community. Please try again.",
      });
    }
  };

  const showDeleteModal = (communityId, name) => {
    setCommunityToDelete(communityId);
    setCommunityNameToDelete(name);
    setIsDeleteModalVisible(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setCommunityToDelete(null);
    setCommunityNameToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (communityToDelete) {
      await handleDeleteCommunity(communityToDelete);
      handleCancelDelete();
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalVisible(false);
    setCommunityToEdit(null);
    setCommunityNameToEdit(null);
  };

  const handleConfirmEdit = async () => {
    await handleEditCommunity(communityToEdit, editData);
    handleCancelEdit();
  };

  const showEditModal = (communityId, name, data) => {
    setCommunityToEdit(communityId);
    setCommunityNameToEdit(name);
    setIsEditModalVisible(true);
    setEditData(data);
  };

  const handleTabChange = (tab) => {
    setCurrentPage(1);
    setActiveTab(tab);
    setChildIndex(0);
    setSearchText(""); // Reset search when switching tabs
    tab === "myCommunity" ? fetchMyCommunities() : fetchAllCommunities();
  };

  const handleJoinClick = (communityId) => {
    jwtToken
      ? joinCommunity(communityId)
      : (window.location.href = `/login?communityId=${communityId}`);
  };

  const handleRequestJoinClick = (communityId) => {
    jwtToken
      ? requestJoinCommunity(communityId)
      : (window.location.href = `/login?communityId=${communityId}`);
  };

  return (
    <div
      className={`mt-[50px] font-inter ${isSmallScreen ? "ml-0 p-[8px]" : "ml-[240px] p-[20px]"}`}
    >
      <Row justify="space-between" align="middle">
        <Col>
          <div className="font-archivo text-[#242C30] text-2xl flex items-center">
            Communities
            <Tooltip title="Manage and explore communities you’re part of or discover new ones.">
              <InfoCircleOutlined className="ml-2 text-gray-500" />
            </Tooltip>
          </div>
          <p className="font-inter text-[#242C30] text-sm">
            Connect with groups from your life—work, school, social circles—and
            discover new ones.
          </p>
        </Col>
        <Col>
          <Tooltip title="Create a new community to connect with others.">
            <Button
              type="primary"
              onClick={handleCreateCommunity}
              className="bg-[#035E7B] px-5 py-2 text-white flex items-center"
            >
              <FaPlus className="mr-2" /> Create Community
            </Button>
          </Tooltip>
        </Col>
      </Row>

      <Row className="mt-[20px]">
        <Col>
          <Space>
            <Tooltip title="View communities you’re a member of or have requested to join.">
              <Button
                type="text"
                onClick={() => handleTabChange("myCommunity")}
                className={`relative ${
                  activeTab === "myCommunity"
                    ? "text-[#066882]"
                    : "text-[#667085]"
                } cursor-pointer font-bold`}
              >
                My Communities
                {activeTab === "myCommunity" && (
                  <div className="-bottom-1.5 left-0 absolute bg-[#035E7B] w-full h-[2px]" />
                )}
              </Button>
            </Tooltip>
            <Tooltip title="Discover new communities to join.">
              <Button
                type="text"
                onClick={() => handleTabChange("exploreCommunity")}
                className={`relative ${
                  activeTab === "exploreCommunity"
                    ? "text-[#066882]"
                    : "text-[#667085]"
                } cursor-pointer font-bold`}
              >
                Explore Communities
                {activeTab === "exploreCommunity" && (
                  <div className="-bottom-1.5 left-0 absolute bg-[#035E7B] w-full h-[2px]" />
                )}
              </Button>
            </Tooltip>
          </Space>
        </Col>
      </Row>

      <Row>
        <div className="flex flex-wrap justify-between items-center my-4 w-full">
          <div className="flex space-x-2">
            {activeTab === "myCommunity" && (
              <div className="flex flex-wrap items-center">
                {subTabs.map((label, index) => (
                  <SubTab
                    key={label}
                    label={label}
                    isActive={childIndex === index}
                    onClick={() => handleSubTabClick(index)}
                  />
                ))}
              </div>
            )}
            {activeTab === "exploreCommunity" && (
              <div className="flex flex-wrap items-center">
                {subTabs2.map((label, index) => (
                  <SubTab
                    key={label}
                    label={label}
                    isActive={childIndex === index}
                    onClick={() => handleSubTabClick(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Row>
      
      <div className="flex justify-between items-center w-full my-5">
        <Tooltip title="Search communities by name, type, or description.">
          <Input
            className="w-full max-w-[370px] h-10"
            placeholder="Search communities"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<IoSearch className="text-[#6e7172]" />}
          />
        </Tooltip>
        <div className="text-right max-sm:mt-2 w-full">
          <p>{communities.length} Communities</p>
        </div>
      </div>

      <Card className="mt-[20px] p-4 border-none">
        {loading ? (
          <div className="text-center py-10">
            <Spin spinning size="large" />
          </div>
        ) : communities.length === 0 ? (
          <Empty
            description={
              activeTab === "myCommunity"
                ? childIndex === 0
                  ? "You haven’t joined any communities yet."
                  : "You haven’t requested to join any communities."
                : childIndex === 0
                ? "No communities available to explore."
                : childIndex === 1
                ? "No new communities found."
                : "No popular communities found."
            }
          >
            {activeTab === "myCommunity" && childIndex === 0 && (
              <Button type="primary" onClick={handleCreateCommunity}>
                Create One Now
              </Button>
            )}
          </Empty>
        ) : (
          <Row style={{ display: "flex", flexWrap: "wrap", gap: "15px", justifyContent: isSmallScreen ? "center" : "", alignItems: isSmallScreen ? "center" : "" }}>
            {activeTab === "myCommunity" &&
              currentCommunities.map((community, index) => (
                <Col
                  key={index}
                  className="sm:w-[100%] max-w-[300px] rounded-lg"
                >
                  { childIndex === 0 ?
                    <MyCommunityCardWithChat
                      index={index}
                      community={community}
                      mycommunityPinindex={mycommunityPinindex}
                      setMycommunityPinindex={setMycommunityPinindex}
                      handleShare={handleShare}
                      showDeleteModal={showDeleteModal}
                      showEditModal={showEditModal}
                      handleViewMembers={handleViewMembers}
                    />
                    :
                    <ExploreCommunityCard
                      index={index}
                      community={community}
                      explorecommunityPinindex={explorecommunityPinindex}
                      setExplorecommunityPinindex={setExplorecommunityPinindex}
                      handleJoinClick={handleJoinClick}
                      handleRequestJoinClick={handleRequestJoinClick}
                      isRequested={isRequested(community.id)}
                    />
                  }
                </Col>
              ))}

            {activeTab === "exploreCommunity" &&
              currentCommunities.map((community, index) => (
                // <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <Col
                  key={index}
                  className="sm:w-[100%] max-w-[300px] rounded-lg"
                >
                  <ExploreCommunityCard
                    index={index}
                    community={community}
                    explorecommunityPinindex={explorecommunityPinindex}
                    setExplorecommunityPinindex={setExplorecommunityPinindex}
                    handleJoinClick={handleJoinClick}
                    handleRequestJoinClick={handleRequestJoinClick}
                    isRequested={isRequested(community.id)}
                  />
                </Col>
              ))}
          </Row>
        )}
      </Card>

      <div className="flex justify-center mt-4">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          sx={{
            '& .MuiPaginationItem-root.Mui-selected': {
              backgroundColor: '#035E7B',
            },
          }}
        />

      {isModalVisible && selectedCommunity && (
        <ShareCommunityPopup
          url={`${window.location.origin}/oauth/login?communityId=${selectedCommunity}`}
          communityName={selectedCommunityName}
          onClose={handleCloseModal}
        />
      )}

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
            Delete Community?
          </span>
          <p className="mt-4 font-inter text-gray-600 text-sm">
            Are you sure you want to delete{" "}
            <strong>{communityNameToDelete}</strong>? All members will lose
            access, and the community will be permanently removed.
          </p>
          <p className="mt-4 font-inter text-gray-600 text-sm">
            This action cannot be undone.
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
              Delete Community
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={isEditModalVisible}
        footer={null}
        onCancel={handleCancelEdit}
        centered
        className="w-[380px]"
      >
        <div>
          <span className="font-bold font-inter text-gray-800 text-lg">
            Edit Community?
          </span>
          <p className="mt-4 font-inter text-gray-600 text-sm">
            Are you sure you want to edit <strong>{communityNameToEdit}</strong>
            ?
          </p>
          <div className="flex justify-end mt-6">
            <Button onClick={handleCancelEdit} className="mr-2">
              Cancel
            </Button>
            <Button
              onClick={handleConfirmEdit}
              type="primary"
              className="bg-[#035E7B] hover:bg-[#024e6a] text-white"
            >
              Edit Community
            </Button>
          </div>
        </div>
      </Modal>
      </div>
    </div>
  );
};

export default CommunityList;
