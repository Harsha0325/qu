import { AiOutlineInsertRowBelow } from "react-icons/ai"; 
import { BiDownArrow } from "react-icons/bi"; 
import { BiRightArrow } from "react-icons/bi"; 
import { BsQrCodeScan } from "react-icons/bs";
import React, { useState, useEffect, useRef } from "react";
import { FaWhatsapp, FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaYoutube, FaBuilding } from "react-icons/fa";
import { Input, DatePicker, Space } from "antd";
import Api from "../api";
import dayjs from "dayjs";
import Loading from "../../FixedComponents/Loading";
import ShareModal from "../SharePopup";
import { Pagination } from "@mui/material";
import { format } from "date-fns";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [fullName, setFullName] = useState("");
  const [userQCardId, setUserQCardId] = useState("");
  const [searchMessage, setSearchMessage] = useState(""); // State for search input message
  const searchInputRef = useRef(null);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1); // 1-based for UI
  const debounceTimeoutRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, [page, dateRange]);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const fetchUsers = async (searchValue = searchText) => {
    setLoading(true);
    try {
      const startDate = dateRange[0] ? dayjs(dateRange[0]).format("YYYY-MM-DD") : null;
      const endDate = dateRange[1] ? dayjs(dateRange[1]).format("YYYY-MM-DD") : null;
  
      const params = {
        page: page - 1, // Convert to 0-based for API
        size: 10,
        searchText: searchValue.length >= 3 ? searchValue : null,
        startDate,
        endDate,
      };
  
      let apiUrl = "/page/getUserDetails";
      if (searchValue.length >= 3) {
        apiUrl = "/users/search-text";
      } else if (startDate && endDate) {
        apiUrl = "/users/date-range";
      }
  
      const response = await Api.get(apiUrl, { params });
      setUsers(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setTotalPages(0);
    }
    setLoading(false);
  };

  const toggleExpandRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSearchChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setSearchText(value);
  
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  
    debounceTimeoutRef.current = setTimeout(() => {
      setPage(1);
  
      if (value.length === 0) {
        // If search text is empty, call the default API
        fetchUsers("");
      } else if (value.length < 3) {
        // Show message for insufficient characters
        setSearchMessage("Enter at least 3 characters to search");
      } else {
        // Call search API with the entered text
        setSearchMessage("");
        fetchUsers(value);
      }
    }, 1000);
  };
  

  
  const handleDateChange = (dates) => {
    setDateRange(dates || []); // Ensure dateRange is not null
    setPage(1);
  };

  const handleShareClick = (userId, fullName) => {
    if (userId) {
      const url = `https://quikynet.com/business-card/${userId}`;
      setShareUrl(url);
      setFullName(fullName);
      setUserQCardId(userId);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const socialLinks = [
    { key: "whatsapp", label: "WhatsApp", icon: <FaWhatsapp />, baseUrl: "https://wa.me/" },
    { key: "linkedin", label: "LinkedIn", icon: <FaLinkedin /> },
    { key: "twitter", label: "Twitter", icon: <FaTwitter /> },
    { key: "facebook", label: "Facebook", icon: <FaFacebook /> },
    { key: "instagram", label: "Instagram", icon: <FaInstagram /> },
    { key: "youtube", label: "YouTube", icon: <FaYoutube /> },
    { key: "company", label: "Company", icon: <FaBuilding /> },
  ];

  if (loading) {
    return <Loading message="Loading" />;
  }

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className={`pt-4 ${screenWidth > 768 ? "ml-[240px]" : ""} font-inter`}>
      <div className="self-stretch my-auto text-2xl leading-none font-semibold text-gray-900">User Details</div>

      {/* Search and Date Range Filter */}
      <div className=" bg-gray-50 mt-4 py-4 px-4">
      <div className="mb-4">
        <Space direction={screenWidth < 768 ? "vertical" : "horizontal"} style={{ width: "100%", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <Input
              placeholder="Search"
              value={searchText}
              onChange={handleSearchChange}
              style={{
                width: screenWidth < 768 ? "100%" : 200,
                marginBottom: screenWidth < 768 ? "8px" : "0",
              }}
              ref={searchInputRef}
            />
            {searchMessage && (
              <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                {searchMessage}
              </div>
            )}
          </div>
          <DatePicker.RangePicker
            value={dateRange} // Bind dateRange to display selected dates
            onChange={handleDateChange}
            style={{ width: screenWidth < 768 ? "100%" : 250 }}
            format="YYYY-MM-DD"
          />
        </Space>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md p-6">
        <table className="min-w-full">
          <thead>
            <tr className="border-b rounded-lg bg-gray-50">
              <th className="p-2 "><AiOutlineInsertRowBelow /></th>
              {screenWidth > 768 && <th className="p-2">ID</th>}
              <th className="p-2">Image</th>
              {screenWidth > 768 && <th className="p-2">QCard ID</th>}
              <th className="p-2">Full Name</th>
              {screenWidth > 768 && <th className="p-2">Phone</th>}
              {screenWidth > 1024 && <th className="p-2">Email</th>}
              {screenWidth > 1440 && <th className="p-2">Date & Time</th>}
              <th className="p-">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <React.Fragment key={user.id}>
                <tr className="border-b">
                  <td
                    className="p-2 text-center cursor-pointer"
                    onClick={() => toggleExpandRow(user.id)}
                  >
                    {expandedRows[user.id] ? <BiDownArrow /> :  <BiRightArrow />}
                  </td>
                  {screenWidth > 768 && (
                    <td className="p-2 text-center">{user.id}</td>
                  )}
                  <td className="p-2  text-center">
                    {user.image ? (
                      <img src={user.image} alt="User" className="h-12 w-12 rounded-full mx-auto" />
                    ) : (
                      "-"
                    )}
                  </td>
                  {screenWidth > 768 && (
                    <td className="p-2 ">{user.userQCardId || "-"}</td>
                  )}
                  <td className="p-2  ">{user.fullName || "-"}</td>
                  {screenWidth > 768 && (
                    <td className="p-2  ">
                      {Array.isArray(user.phone) ? (
                        user.phone.map((phone, index) => <div key={index}>{phone}</div>)
                      ) : (
                        user.phone || "-"
                      )}
                    </td>
                  )}
                  {screenWidth > 1024 && (
                    <td className="p-2  ">
                      {Array.isArray(user.email) ? (
                        user.email.map((email, index) => <div key={index}>{email}</div>)
                      ) : (
                        user.email || "-"
                      )}
                    </td>
                  )}
                  {screenWidth > 1440 && (
                    <td className="p-2  ">
                      {format(new Date(user.dateTime), "MMMM dd, yyyy HH:mm:ss")}
                    </td>
                  )}
                  <td className="flex justify-center items-center pt-4">
                    <BsQrCodeScan
                      style={{ color: "#000000", fontSize: "18px" }}
                      onClick={() => handleShareClick(user.userQCardId, user.fullName)}
                    />
                  </td>
                </tr>
                {expandedRows[user.id] && (
                  <tr className=" ">
                    <td
                      colSpan={screenWidth > 1024 ? 6 : screenWidth > 768 ? 5 : 4}
                      className="p-4"
                    >
                      <div className="m-0">
                        {screenWidth <= 768 && (
                          <div className="p-2">
                            <strong>QCard ID:</strong> {user.userQCardId || "-"}
                          </div>
                        )}
                        {screenWidth <= 1024 && (
                          <div className="p-2">
                            <strong>Email:</strong>{" "}
                            {Array.isArray(user.email) ? user.email.join(", ") : user.email || "-"}
                          </div>
                        )}
                        <div className="p-2">
                          <strong>Location:</strong> {user.location || "-"}
                        </div>
                        <div className="p-2">
                          <strong>Job Title:</strong> {user.jobTitle || "-"}
                        </div>
                        {screenWidth <= 1440 && (
                          <div className="p-2">
                            <strong>DateTime:</strong>{" "}
                            {format(new Date(user.dateTime), "MMMM dd, yyyy HH:mm:ss")}
                          </div>
                        )}
                        <div className="p-2">
                          <strong>Company Name:</strong> {user.companyName || "-"}
                        </div>
                        <div className="p-2">
                          <strong>WhatsApp:</strong> {user.whatsapp || "-"}
                        </div>
                        <div className="p-2">
                          <strong>Action:</strong>
                          <div className="flex flex-wrap gap-4 mt-2">
                            {socialLinks.map(({ key, label, icon, baseUrl }) => {
                              const link = user[key] ? (baseUrl ? `${baseUrl}${user[key]}` : user[key]) : null;
                              return (
                                <a
                                  key={key}
                                  href={link || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-2 p-2 rounded ${
                                    link ? "text-blue-500 hover:text-blue-700" : "text-gray-400 cursor-not-allowed pointer-events-none"
                                  }`}
                                >
                                  {icon} {label}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>

      {isModalOpen && (
        <ShareModal
          url={shareUrl}
          onClose={handleCloseModal}
          name={fullName}
          qCardId={userQCardId}
        />
      )}
      </div>
    </div>
  );
};

export default UserTable;