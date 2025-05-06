import React, { useEffect, useState, useRef } from "react";
import { FaRegBell } from "react-icons/fa";
import Api from "../qutree/api";
import useNotificationSocket from "./useNotificationSocket"; // from above

const NotificationBell = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch unread notifications initially
  const fetchNotifications = async () => {
    const res = await Api.get(`/notifications/${userId}`);
    setNotifications(res.data);
    setUnreadCount(res.data.length);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Listen to WebSocket messages
  useNotificationSocket(userId, (newNotification) => {
    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  });

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleMarkAsRead = async (notificationId) => {
    await Api.put(`/notifications/mark-as-read/${notificationId}`);
    fetchNotifications(); // Refresh list
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block mr-[35px] font-inter" ref={dropdownRef}>
  <div
    className="border border-gray-300 p-[6px] rounded-[8px] cursor-pointer"
    onClick={toggleDropdown}
  >

<FaRegBell className="text-[#6E7172] text-[20px]" />
{unreadCount > 0 && (
  <span
    className="absolute top-[2px] right-[4px] bg-[#D41111] text-white text-[8px] rounded-full px-[5px] font-semibold py-[2px] min-w-[16px] text-center"
  >
    {unreadCount}
  </span>
)}
      </div>

      {dropdownOpen && (
       <div className="absolute right-0 mt-[10px] bg-white border border-[#ccc] rounded-lg w-[300px] max-h-[300px] overflow-y-auto z-[999] shadow-md">
          {notifications.length === 0 ? (
            <p className="p-2.5 text-center">No new notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="p-2.5 border-b border-gray-200 cursor-pointer"
                onClick={() => handleMarkAsRead(n.id)}
              >
                <strong>{n.title}</strong>
                <p style={{ margin: 0 }}>{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
