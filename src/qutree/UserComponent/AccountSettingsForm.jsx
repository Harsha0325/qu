import React, { useState, useEffect } from "react"; // Import useEffect
// import { RiLogoutCircleRLine } from "react-icons/ri";
import { FaArrowRight } from "react-icons/fa"; // Import FaEdit for the edit icon
import { Switch } from "antd";
import { MdOutlineEdit } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";
import Api from "../BaseUrlAPI";
import { Modal, Button, message } from "antd"; // import message from antd
import { RiDeleteBin6Line } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";
const handleBack = () => {
  window.history.back(); // or use your own navigation logic
};

function AccountSettingsForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error handling
  const [image, setImage] = useState("");
  const [accountType, setAccountType] = useState(""); // true for private, false for public
  const [preference, setPreference] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { jwtToken, userId } = useAuth() || {};

  useEffect(() => {
    const handleResize = () => {
      const isSmall = window.innerWidth <= 768;
      setIsMobile(isSmall);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await Api.get(
          `/account-setting-user-details/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        // Extracting values from the API response
        setImage(response.data.image || "");
        setFullName(response.data.fullName || "");
        setEmail(response.data.email[0] || ""); // Accessing the first email in the array
        setUserName(response.data.userName || "");

        // Set account type based on API response, assuming "private" means true
        setAccountType(response.data.accountType === "PRIVATE");

        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleAccountTypeChange = (checked) => {
    setAccountType(checked);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateUser = async () => {
    const updatedUserData = {
      fullName,
      userName,
      accountType: accountType ? "PRIVATE" : "PUBLIC",
      email: [email],
      image,
    };

    try {
      const response = await Api.put(
        `/update-user/${userId}`, // Update the endpoint URL as necessary
        updatedUserData,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        message.success("User updated successfully!"); // success message
      }
    } catch (err) {
      setError(err);

      // Check if the error is due to username conflict (HTTP 409 status)
      if (err.response && err.response.status === 409) {
        message.error(
          "Username already taken by another user. Please choose a different one."
        );
      } else {
        message.error(
          "Error updating user: " + (err.message || "Unknown error")
        );
      }
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);

    try {
      const response = await Api.delete(`/remove-user-by-id/${userId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.status === 200) {
        message.success("Account deleted successfully!");
        localStorage.removeItem("jwtToken");
        window.location.href = "/"; // Redirect to home or login page
      }
    } catch (err) {
      setError(err);
      message.error("Error deleting account: " + err.message);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Trigger this function to show the modal when user wants to remove their account
  const handleRemoveAccount = () => {
    showModal();
  };
  if (loading)
    return (
      <div style={{ marginLeft: isMobile ? "0px" : "240px" }}>Loading...</div>
    ); // Loading state
  if (error)
    return <div style={{ marginLeft: isMobile ? "0px" : "240px" }}></div>; // Loading state
  return (
    <div style={{ marginLeft: isMobile ? "0px" : "240px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "20px 0 0 0px",
        }}
      >
        <IoMdArrowBack
          onClick={handleBack}
          style={{
            width: "24px",
            height: "24px",
            marginRight: "10px",
            color: "#GE7172",
          }}
        />
        <p
          style={{
            fontSize: "28px",
            margin: 0,
            color: "var(--colors-common-black, #000)",
            fontFamily: "Archivo",
          }}
        >
          Account Settings
        </p>
        <button
          onClick={handleUpdateUser} // Call the update function on button click
          style={{
            backgroundColor: "#035E7B",
            padding: "8px",
            alignItems: "center",
            justifyContent: "center",
            width: "107px",
            height: "32px",
            color: "white",
            fontSize: "12px",
            textAlign: "center",
            borderRadius: "4px",
            border: "none",
            marginLeft: "auto", // Aligns the button to the right
            marginTop: "10px",
          }}
        >
          Save Changes
        </button>
      </div>

      <div
        className="form"
        style={{
          marginTop: "40px",
          display: "flex",
          flexDirection: "column",
          borderRadius: "4px",
          padding: isMobile ? "10px" : "24px",
          width: isMobile ? "300px" : "500px",
          border: "1px solid #ECEEEE",
        }}
      >
        <fieldset style={{ border: "none" }}>
          <form>
            <div>
              {/* Profile Image Section */}
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  marginBottom: "20px",
                }}
              >
                <img
                  src={image}
                  alt="Profile"
                  style={{
                    width: "140px",
                    height: "140px",
                    borderRadius: "50%",
                  }}
                />
                <label
                  htmlFor="imageUpload"
                  style={{ position: "absolute", bottom: "5px", right: "5px" }}
                >
                  <MdOutlineEdit
                    style={{
                      color: "white",
                      cursor: "pointer",
                      padding: "5px",
                      backgroundColor: "#035E7B",
                      borderRadius: "50%",
                      fontSize: "24px",
                    }}
                  />
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <label htmlFor="fullName" style={labelStyle}>
              Full Name
            </label>
            <input
              style={inputStyle}
              type="text"
              name="fullName"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              required
            />
            <label htmlFor="username" style={labelStyle}>
              UserName
            </label>
            <input
              style={inputStyle}
              type="text" // Change type to text for username
              name="userName"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="User Name"
              required
            />

            <label htmlFor="email" style={labelStyle}>
              Email Address
            </label>
            <input
              style={inputStyle}
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />

            <div style={sectionStyle}>
              <p style={sectionTitleStyle}>Profile Visibility</p>
              <p style={sectionSubtitleStyle}>Make this account private?</p>
              <Switch
                checked={accountType} // Toggle based on account type
                onChange={handleAccountTypeChange} // Handle toggle change
              />
            </div>

            <div style={sectionStyle}>
              <p style={sectionTitleStyle}>
                Contact Preferences & Restrictions
              </p>
              {["anyone", "mutual", "block"].map((option) => (
                <div key={option} style={radioGroupStyle}>
                  <input
                    type="radio"
                    name="preferences"
                    value={option}
                    id={option}
                    checked={preference === option}
                    onChange={(e) => setPreference(e.target.value)}
                  />
                  <label htmlFor={option} style={radioLabelStyle}>
                    {option === "anyone"
                      ? "Allow Requests from Anyone"
                      : option === "mutual"
                      ? "Allow Only Mutual Connections"
                      : "Block Requests from Unknown Users"}
                  </label>
                </div>
              ))}
              <button type="button" style={manageButtonStyle}>
                Manage User Restrictions
                <FaArrowRight
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "130px",
                    width: "28px",
                    height: "20px",
                    color: "#6E7172",
                  }}
                />
              </button>
            </div>

            <div style={sectionStyle}>
              <p style={sectionTitleStyle}>Delete Account</p>
              <p style={deleteAccountDescriptionStyle}>
                Permanently delete your QuikyNet account, including all contacts
                and community data. This action cannot be undone.
              </p>
              <Button
                type="primary"
                style={deleteButtonStyle}
                onClick={handleRemoveAccount}
              >
                Delete Account
              </Button>

              <Modal
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ style: ModelDeleteButtonStyle }}
                cancelButtonProps={{ style: ModelCancelButtonStyle }}
                title={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "start",
                      flexDirection: "column",
                    }}
                  >
                    <RiDeleteBin6Line
                      style={{
                        color: "#D41111",
                        fontSize: "20px",
                        marginRight: "8px",
                        padding: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#FBE7E7",
                      }}
                    />
                    <span>Confirm Account Deletion</span>
                  </div>
                }
              >
                <p>Are you sure you want to delete your account?</p>
                <p>This action cannot be undone.</p>
              </Modal>
            </div>

            {/* <button type="button" style={logoutButtonStyle}>
            Log Out <RiLogoutCircleRLine style={{ marginLeft: "8px" }} />
          </button> */}
          </form>
        </fieldset>
      </div>
    </div>
  );
}

// Define styles outside the component to keep the JSX clean
const labelStyle = {
  marginTop: "24px",
  color: "var(--Product-Type-type-600, #3B4950)",
  fontFamily: "Inter",
  fontSize: "14px",
  fontWeight: "500",
  lineHeight: "145%",
};

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "8px",
  boxSizing: "border-box",
  border: "1px solid #ddd",
  borderRadius: "3px",
  fontSize: "12px",
  marginTop: "5px",
};

const sectionStyle = {
  marginTop: "40px",
};

const sectionTitleStyle = {
  color: "#242C30",
  fontFamily: "Archivo",
  fontSize: "18px",
  fontWeight: "600",
  lineHeight: "140%",
};

const sectionSubtitleStyle = {
  color: "var(--Product-Type-type-600, #3B4950)",
  fontFamily: "Inter",
  fontSize: "14px",
  lineHeight: "145%",
};

const radioGroupStyle = {
  display: "flex",
  alignItems: "center",
  marginTop: "10px",
};

const radioLabelStyle = {
  color: "var(--Product-Type-type-600, #3B4950)",
  fontFamily: "Inter",
  fontSize: "14px",
  fontWeight: "600",
  marginLeft: "5px",
};

const manageButtonStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px ",
  width: "348px",
  height: "36px",
  gap: "8px",
  color: "#2E393E",
  marginTop: "20px",
  background: "transparent",
  border: "1px solid #ECEEEE",
  borderRadius: "4px",
};

const deleteAccountDescriptionStyle = {
  color: "var(--Product-Type-type-600, #3B4950)",
  width: "348px",
  fontFamily: "Inter",
  fontSize: "14px",
  fontWeight: "600",
  lineHeight: "145%",
  marginTop: "10px",
};

const deleteButtonStyle = {
  display: "flex",
  padding: "8px 20px",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  color: "#2E393E",
  marginTop: "20px",
  borderRadius: "4px",
  border: "1px solid var(--Product-Outline-outline-100, #ECEEEE)",
  background: "transparent",
};

// const logoutButtonStyle = {
// display: "flex",
// marginTop: "100px",
// color: "red",
// justifyContent: "center",
// textAlign: "center",
// padding: "10px",
// background: "transparent",
// border: "none",
// };
const ModelDeleteButtonStyle = {
  backgroundColor: "#D41111", // Customize delete button color
  borderColor: "#D41111",
  color: "white",
};

const ModelCancelButtonStyle = {
  backgroundColor: "#ffffff", // Customize cancel button color
  borderColor: "#ECEEEE",
  color: "#2E393E",
};
export default AccountSettingsForm;
