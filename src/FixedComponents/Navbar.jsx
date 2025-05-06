import React, { useContext, useEffect, useState, useRef } from "react";
import * as FaIcons from "react-icons/fa";
import { IconContext } from "react-icons";
import { Link, useNavigate } from "react-router-dom";
import { SidebarData } from "./SlidebarData";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";
import { RolesContext } from "../context/RoleContext";
import Api from "../qutree/api";
import { IoMdLogOut } from "react-icons/io";
import { useLocation } from "react-router-dom";
import QUIKYNET_LOGO from "../image/WebPageImages/Quky_logo.svg";
import { IoCloseSharp } from "react-icons/io5";
import { message } from "antd";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const { logout } = useAuth() || {};
  const { roles, userId } = useContext(RolesContext);
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchCardData = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      if (!userId) return;

      const response = await Api.get(`/user/navbar?userId=${userId}`);

      if (response.status !== 200) {
        message.error(response.data || "Failed to fetch card data.");
        if (response.status === 401) {
          navigate("/oauth/login");
        }
        return;
      }

      setCard(response.data);
    } catch (error) {
      message.error("Failed to fetch card data.");
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCardData();
    } else {
      setLoading(false); // If no userId, stop loading
    }
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const showSidebar = () => setSidebar(!sidebar);
  const toggleDropdown = (event) => {
    event.stopPropagation();
    setDropdownVisible(!dropdownVisible);
  };

  const handleDropdownClick = (action) => {
    setSidebar(false);
    setDropdownVisible(false);

    if (action === "logout") {
      logout();
      navigate("/");
    } else if (action === "change-password") {
      navigate("/change-password");
    }
  };

  const filteredSidebarData = SidebarData.filter((item) => {
    return item.roles && roles.some((role) => item.roles.includes(role));
  });

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to create initials for Avatar if no profile picture is available
  const getInitials = (name) => {
    const words = name.split(" ");
    const initials = words[0]?.[0] || "" + (words[1]?.[0] || "");
    return initials.toUpperCase();
  };

  return (
    <IconContext.Provider value={{ color: "black" }}>
      <div className="navbar-container">
        <div className="mobile-menu">
          {sidebar === true ? (
            <Link to="#" className="menu-bars" onClick={showSidebar}>
              <IoCloseSharp style={{ color: "white", fontSize: "40px" }} />
            </Link>
          ) : (
            <Link to="#" className="menu-bars" onClick={showSidebar}>
              <FaIcons.FaBars style={{ color: "white" }} />
            </Link>
          )}
        </div>

        <div className="navbar-right">
          {loading ? (
            // Placeholder UI while loading
            <>
              {!isSmallScreen && <div className="notification-bell-placeholder" />}
              <div
                className="profile-img-placeholder"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#e0e0e0",
                }}
              />
              {!isSmallScreen && (
                <div className="profile-name-placeholder">
                  <div
                    style={{
                      width: "100px",
                      height: "16px",
                      backgroundColor: "#e0e0e0",
                      marginBottom: "4px",
                    }}
                  />
                  <div
                    style={{
                      width: "80px",
                      height: "12px",
                      backgroundColor: "#e0e0e0",
                    }}
                  />
                </div>
              )}
            </>
          ) : card ? (
            // Actual UI when data is loaded
            <>
              {!isSmallScreen && <NotificationBell userId={userId} />}
              {card.image && card.image.startsWith("data:image/") ? (
                <img
                  src={card.image}
                  alt="Profile"
                  className="profile-img"
                  onClick={toggleDropdown}
                  loading="lazy"
                />
              ) : (
                <div
                  className="profile-avatar"
                  onClick={toggleDropdown}
                  style={{ backgroundColor: "#035E7B" }}
                >
                  {getInitials(card?.fullName || "")}
                </div>
              )}
              {!isSmallScreen && card.fullName && (
                <span className="profile-name" onClick={toggleDropdown}>
                  {card.fullName.length > 10
                    ? `${card.fullName.substring(0, 10)}...`
                    : card.fullName}
                  <span className="full-name-tooltip">{card.fullName}</span>
                  <div className="account-type">
                    {card.accountType.charAt(0).toUpperCase() +
                      card.accountType.slice(1).toLowerCase()}{" "}
                    account
                  </div>
                </span>
              )}
            </>
          ) : (
            // Fallback UI if no card data
            <>
              {!isSmallScreen && <div className="notification-bell-placeholder" />}
              <div
                className="profile-avatar"
                onClick={toggleDropdown}
                style={{ backgroundColor: "#035E7B" }}
              >
                --
              </div>
              {!isSmallScreen && (
                <span className="profile-name" onClick={toggleDropdown}>
                  Unknown User
                  <div className="account-type">Unknown account</div>
                </span>
              )}
            </>
          )}
          {dropdownVisible && (
            <div className="profile-dropdown" ref={dropdownRef}>
              <ul>
                <li
                  onClick={() => handleDropdownClick("change-password")}
                  style={{ borderBottom: "1px solid #E6E8E9" }}
                >
                  Change Password
                </li>
                <li
                  onClick={() => navigate("/referral-code")}
                  style={{ borderBottom: "1px solid #E6E8E9" }}
                >
                  Referral code
                </li>
                <li
                  onClick={() => handleDropdownClick("logout")}
                  className="logout-item"
                >
                  Logout{" "}
                  <IoMdLogOut
                    style={{ color: "#970C0C", paddingRight: "20px" }}
                  />
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
        <ul className="nav-menu-items" onClick={showSidebar}>
          <li className="navbar-toggle">
            {isSmallScreen ? (
              ""
            ) : (
              <div className="navbar-logo">
                <img
                  style={{ width: "185px", height: "42.5px" }}
                  src={QUIKYNET_LOGO}
                  alt="Quiky logo"
                />
              </div>
            )}
            <Link to="#" className="menu-bars"></Link>
          </li>

          {filteredSidebarData.length > 0 ? (
            filteredSidebarData.map((item, index) => (
              <li key={index} className="nav-menu-item">
                <Link
                  to={item.path}
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      location.pathname === item.path
                        ? "#FFFFFF"
                        : "transparent",
                    color:
                      location.pathname === item.path ? "#035E7B" : "#FFFFFF",
                    border:
                      location.pathname === item.path
                        ? "1px solid #B1CDD6"
                        : "none",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color:
                        location.pathname === item.path
                          ? "#035E7B"
                          : "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "20px",
                    }}
                  >
                    {React.cloneElement(item.icon, {
                      style: {
                        color:
                          location.pathname === item.path
                            ? "#035E7B"
                            : "#FFFFFF",
                      },
                    })}
                  </span>
                  <span style={{ paddingLeft: "8px" }}>{item.title}</span>
                </Link>
              </li>
            ))
          ) : (
            <div></div>
          )}
        </ul>
      </nav>
    </IconContext.Provider>
  );
}