import React, { useCallback, useEffect, useState } from "react";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { format, addDays, subDays } from "date-fns";
import { FaSearch } from "react-icons/fa";
import Api from "../BaseUrlAPI"; // Ensure this is your base API URL
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Spin } from "antd";

const VisitorsTable = () => {
  const [visitors, setVisitors] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState("checkedIn");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedDate, setSelectedDate] = useState(new Date()); // State to store selected date
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { jwtToken, userId } = useAuth() || {};
  const updateMedia = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  useEffect(() => {
    const fetchCompanyId = async () => {
      try {
        setLoading(true);
        const response = await Api.get(`/user/${userId}/company-id`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        });

        const { companyId } = response.data;
        console.log("companyId: ", companyId);
        setCompanyId(companyId);
        localStorage.setItem("companyId", companyId);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred.");
        console.error(
          "Error fetching company ID:",
          err.response || err.message
        );
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchCompanyId();
  }, [userId, jwtToken]); // Runs when component mounts and dependencies change

  const fetchCheckedInVisitors = useCallback(async () => {
    try {
      if (companyId) {
        const response = await Api.get(`/checked-in/${companyId}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        setVisitors(response.data);
      }
    } catch (err) {
      console.error("Error fetching checked-in visitors:", err);
      setError("Could not fetch checked-in visitors.");
    }
  }, [companyId, jwtToken]); // Add dependencies for companyId and jwtToken

  const fetchVisitorHistoryByDate = useCallback(
    async (date) => {
      try {
        if (companyId) {
          const response = await Api.get(`/visitor-history/${companyId}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
            params: {
              date: format(date, "yyyy-MM-dd"),
            },
          });
          setVisitors(response.data);
        }
      } catch (err) {
        console.error("Error fetching visitor history:", err);
        setError("Could not fetch visitor history.");
      }
    },
    [companyId, jwtToken]
  ); // Add dependencies for companyId, jwtToken, and date if needed

  useEffect(() => {
    if (companyId) {
      if (selectedOption === "checkedIn") {
        fetchCheckedInVisitors();
      } else if (selectedOption === "history") {
        fetchVisitorHistoryByDate(selectedDate);
      }
    }
  }, [
    companyId,
    selectedOption,
    selectedDate,
    fetchCheckedInVisitors,
    fetchVisitorHistoryByDate,
  ]); // Add the functions as dependencies

  // Function to handle previous and next date
  const handlePreviousDate = () => {
    const previousDate = subDays(selectedDate, 1);
    setSelectedDate(previousDate);
  };

  const handleNextDate = () => {
    const nextDate = addDays(selectedDate, 1);
    setSelectedDate(nextDate);
  };

  // Function to handle check-out
  const handleCheckOut = async (id) => {
    try {
      const token = localStorage.getItem("jwtToken");
      await Api.put(
        `/check-out/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCheckedInVisitors(); // Refetch the visitors after checking out
    } catch (err) {
      console.error(`Error checking out visitor with ID ${id}:`, err);
      setError("Could not check out visitor.");
    }
  };

  // Fetch the data based on selected option
  useEffect(() => {
    if (selectedOption === "checkedIn") {
      fetchCheckedInVisitors();
    } else if (selectedOption === "history") {
      fetchVisitorHistoryByDate(selectedDate);
    }
  }, [selectedOption, selectedDate]);

  const navigate = useNavigate();

  const VisitorQRCode = () => {
    navigate("/vistor-qr-code");
  };

  // Replace plain text with the spinner
  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Spin size="large" />
      </div>
    );

  return (
    <div style={{ marginLeft: isMobile ? "0px" : "240px", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <div
            style={{
              textAlign: "left",
              margin: "0",
              fontFamily: "Archivo",
              fontSize: "1.5rem",
              color: "#242C30",
              fontWeight: "bold",
            }}
          >
            Visitor Management
          </div>
          <div
            style={{
              textAlign: "left",
              margin: "5px 0 20px",
              fontFamily: "Inter",
              fontSize: "0.875rem",
              color: "#242C30",
            }}
          >
            Effortlessly monitor and record guest check-ins and check-outs.
          </div>
        </div>
        <button
          onClick={VisitorQRCode}
          style={{
            backgroundColor: "white",
            color: "#035E7B",
            border: "1px solid #035E7B",
            borderRadius: "4px",
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          Visitor QR Code <FaArrowRight />
        </button>
      </div>

      {/* Option Buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => setSelectedOption("checkedIn")}
            style={{
              marginRight: "10px",
              backgroundColor: "transparent",
              color: selectedOption === "checkedIn" ? "#035E7B" : "#2E393E",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              padding: "8px",
              fontFamily: "Inter",
              borderBottom:
                selectedOption === "checkedIn"
                  ? "2px solid #035E7B"
                  : "2px solid #ddd",
            }}
          >
            Checked-In
          </button>
          <button
            onClick={() => setSelectedOption("history")}
            style={{
              backgroundColor: "transparent",
              color: selectedOption === "history" ? "#035E7B" : "#2E393E",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              padding: "8px",
              fontFamily: "Inter",
              borderBottom:
                selectedOption === "history"
                  ? "2px solid #035E7B"
                  : "2px solid #ddd",
            }}
          >
            History
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #ddd",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "8px", backgroundColor: "#f5f5f5" }}>
            <FaSearch style={{ color: "#999" }} />
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px",
              width: "355px",
              border: "none",
              outline: "none",
            }} // Remove border for the input
          />
        </div>
        <div style={{ padding: "8px" }}>{visitors.length} visitors</div>
      </div>
      {selectedOption === "history" && (
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              fontFamily: "Archivo",
              fontSize: "2rem",
              padding: "8px",
              fontWeight: "bold",
              color: "#242C30",
            }}
          >
            {format(selectedDate, "d MMMM, yyyy")}
          </div>
          <button
            onClick={handlePreviousDate}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              fontSize: "2rem",
              color: "#6E7172",
            }}
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={handleNextDate}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              fontSize: "2rem",
              color: "#6E7172",
            }}
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {/* Visitors Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ border: "1px solid #ddd" }}>
            <td
              style={{
                padding: "8px",
                textAlign: "center",
                fontFamily: "Inter",
                color: "#415058",
              }}
            >
              {" "}
              <input type="checkbox" />
            </td>
            <td
              style={{
                padding: "8px",
                textAlign: "start",
                fontFamily: "Inter",
                color: "#415058",
              }}
            >
              Visitor Name
            </td>
            <td
              style={{
                padding: "8px",
                textAlign: "start",
                fontFamily: "Inter",
                color: "#415058",
              }}
            >
              Contact Number
            </td>
            <td
              style={{
                padding: "8px",
                textAlign: "start",
                fontFamily: "Inter",
                color: "#415058",
              }}
            >
              Email
            </td>
            <td
              style={{
                padding: "8px",
                textAlign: "start",
                fontFamily: "Inter",
                color: "#415058",
              }}
            >
              Visiting Purpose
            </td>
            <td
              style={{
                padding: "8px",
                textAlign: "start",
                fontFamily: "Inter",
                color: "#415058",
              }}
            >
              Check-In
            </td>
            {selectedOption === "checkedIn" ? (
              <td
                style={{
                  padding: "8px",
                  textAlign: "start",
                  fontFamily: "Inter",
                  color: "#415058",
                }}
              >
                Check-Out
              </td>
            ) : (
              <td
                style={{
                  padding: "8px",
                  textAlign: "start",
                  fontFamily: "Inter",
                  color: "#415058",
                }}
              >
                Check-Out
              </td>
            )}
          </tr>
        </thead>
        <tbody>
          {visitors
            .filter(
              (visitor) =>
                visitor.visitorName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                visitor.mobileNo
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                visitor.email
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                visitor.purposeOfVisit
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
            )
            .map((visitor) => (
              <tr key={visitor.id} style={{ border: "1px solid #ddd" }}>
                <td style={{ padding: "8px", textAlign: "center" }}>
                  <input type="checkbox" />
                </td>
                <td
                  style={{
                    padding: "8px",
                    fontFamily: "Inter",
                    color: "#242C30",
                  }}
                >
                  {visitor.visitorName}
                </td>
                <td
                  style={{
                    padding: "8px",
                    fontFamily: "Inter",
                    color: "#242C30",
                  }}
                >
                  {visitor.mobileNo}
                </td>
                <td
                  style={{
                    padding: "8px",
                    fontFamily: "Inter",
                    color: "#242C30",
                  }}
                >
                  {visitor.email}
                </td>
                <td
                  style={{
                    padding: "8px",
                    fontFamily: "Inter",
                    color: "#242C30",
                  }}
                >
                  {visitor.purposeOfVisit}
                </td>
                <td
                  style={{
                    padding: "8px",
                    fontFamily: "Inter",
                    color: "#242C30",
                  }}
                >
                  {new Date(visitor.checkInTime).toLocaleString()}
                </td>
                {selectedOption === "checkedIn" ? (
                  <td
                    style={{
                      padding: "8px",
                      fontFamily: "Inter",
                      color: "#242C30",
                    }}
                  >
                    <button
                      onClick={() => handleCheckOut(visitor.id)}
                      style={{
                        backgroundColor: "#035E7B",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "5px 10px",
                        cursor: "pointer",
                      }}
                    >
                      Check-Out
                    </button>
                  </td>
                ) : (
                  <td
                    style={{
                      padding: "8px",
                      fontFamily: "Inter",
                      color: "#242C30",
                    }}
                  >
                    {visitor.checkOutTime
                      ? new Date(visitor.checkOutTime).toLocaleString()
                      : "N/A"}
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default VisitorsTable;
