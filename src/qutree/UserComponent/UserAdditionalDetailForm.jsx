import React, { useState, useEffect } from "react";
import Api from "../BaseUrlAPI";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { message } from "antd";
const UserAdditionalDetailForm = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    designation: "",
    bloodGroup: "",
    residenceAddress: "",
    nokContactNo: "",
    validityUpTo: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const { jwtToken, userId } = useAuth() || {};
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  const updateMedia = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  useEffect(() => {
    const fetchAdditionalDetails = async () => {
      try {
        const response = await Api.get(`/get-additional-details/${userId}`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });

        // Check if there is data; if so, populate the form
        setFormData({
          employeeId: response.data.employeeId || "",
          designation: response.data.designation || "",
          bloodGroup: response.data.bloodGroup || "",
          residenceAddress: response.data.residenceAddress || "",
          nokContactNo: response.data.nokContactNo || "",
          validityUpTo: response.data.validityUpTo || "",
        });
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError(null); // Clear error for form display
        } else {
          setError("Failed to load user additional details.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAdditionalDetails();
  }, [userId, jwtToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Api.put(
        `/update-user-additional-details/${userId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      setFormData(response.data);
      message.success("User additional details updated successfully.");
    } catch (error) {
      message.error("Failed to update user additional details.");
    }
  };

  if (loading)
    return (
      <p style={{ marginLeft: isMobile ? "0px" : "260px", padding: "10px" }}>
        Loading...
      </p>
    );
  if (error)
    return (
      <p style={{ marginLeft: isMobile ? "0px" : "260px", padding: "10px" }}>
        {error}
      </p>
    );

  return (
    <div style={{ marginLeft: isMobile ? "0px" : "260px" }}>
      <dir>
        <ArrowLeftOutlined
          style={{ fontSize: "24px", cursor: "pointer", color: "#333" }}
          onClick={() => navigate(-1)}
        />
      </dir>
      <div
        style={{
          marginRight: "auto",
          maxWidth: "600px",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)",
          marginTop: "20px",
          backgroundColor: "#ffffff",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#333" }}>
          User Additional Details
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <label style={labelStyle}>
            Employee ID:
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId || ""}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Designation:
            <input
              type="text"
              name="designation"
              value={formData.designation || ""}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Blood Group:
            <input
              type="text"
              name="bloodGroup"
              value={formData.bloodGroup || ""}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Residence Address:
            <textarea
              name="residenceAddress"
              value={formData.residenceAddress || ""}
              onChange={handleInputChange}
              style={textareaStyle}
            />
          </label>
          <label style={labelStyle}>
            Next of Kin Contact No:
            <input
              type="text"
              name="nokContactNo"
              value={formData.nokContactNo || ""}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Validity Up To:
            <input
              type="date"
              name="validityUpTo"
              value={formData.validityUpTo || ""}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </label>
          <button type="submit" style={buttonStyle}>
            Update Details
          </button>
        </form>
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </div>
    </div>
  );
};

const labelStyle = {
  display: "flex",
  flexDirection: "column",
  fontWeight: "bold",
  color: "#555",
};

const inputStyle = {
  padding: "10px",
  fontSize: "16px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
  minHeight: "80px",
};

const buttonStyle = {
  padding: "10px",
  fontSize: "16px",
  borderRadius: "4px",
  border: "none",
  backgroundColor: "#035E7B",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
  marginTop: "10px",
};

export default UserAdditionalDetailForm;
