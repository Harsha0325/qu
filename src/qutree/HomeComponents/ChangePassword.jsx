import React, { useState } from "react";
import { Form, Input, Button, message, Typography, Layout } from "antd";
import { useNavigate } from "react-router-dom";
import Api from "../api"; // Ensure this imports the configured axios instance
import { useAuth } from "../../context/AuthContext";
const ChangePassword = () => {
  const { Content } = Layout;
  const { Title } = Typography;
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  const { jwtToken, logout } = useAuth();
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Retrieve the username and JWT token from localStorage or useAuth
      const username = localStorage.getItem("userEmail");
  
      if (!username || !jwtToken) {
        message.error("Authentication details are not available. Please log in again.");
        setLoading(false);
        return;
      }
      // API call to change the password with authentication
      await Api.post(
        "/change-password",
        {
          userName: username,
          existingPassword: values.oldPassword,
          newPassword: values.newPassword,
        },

      );
  
      message.destroy();
      message.success("Password changed successfully!");
      logout();
      navigate("/oauth/login");
  
    } catch (error) {
      if (error.response && error.response.status === 403) {
        message.destroy();
        message.error("Current password is incorrect. Please try again.");
      } else {
        console.error("Password change error:", error);
        message.destroy();
        message.error("Failed to change password. Please try again.");
      }
    }
    setLoading(false);
  };
  
  return (
    <Layout
      style={{
        backgroundColor: "transparent",
        height: "82.5vh",
      }}
    >
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100%",
          width: "100%",
        }}
      >
        <Form
          name="change_password_form"
          onFinish={onFinish}
          layout="vertical"
          style={{
            display: "grid",
            maxWidth: "500px",
            width: "100%",
            padding: "50px",
            borderRadius: "8px",

          border : "1px solid #ccc"
          }}
        >
          <Title level={2} style={{ textAlign: "center",fontFamily: "Inter", }}>
          Set new password
          </Title>
  
          <div style={{ textAlign: "center", fontFamily: "Inter", color: "#475467", paddingBottom: "10px"}}>
          Your new password must be different to previously used passwords.
          </div>
          <Form.Item
            name="oldPassword"
            rules={[
              {
                required: true,
                message: "Please enter your current password",
              },
            ]}
          >
            <Input.Password
              placeholder="Current Password"
              onPaste={(e) => e.preventDefault()}
              style={{ padding : '10px' }}
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            dependencies={["oldPassword"]}
            rules={[
              { required: true, message: "Please enter your new password" },
              { min: 6, message: "Password must be at least 6 characters" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("oldPassword") !== value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "New password should not be the same as the old password."
                    )
                  );
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password
              placeholder="New Password"
              onPaste={(e) => e.preventDefault()}
              style={{ padding : '10px' }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match."
                    )
                  );
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password
              placeholder="Confirm New Password"
              onPaste={(e) => e.preventDefault()}
              style={{ padding : '10px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: "24px" }}>
          <Button
  type="primary"
  htmlType="submit"
  block
  loading={loading}
  style={{
    backgroundImage: 'linear-gradient(to right, #066882, #00CBFF)',
    padding: '20px',
    border: 'none', 
    color: '#fff', 
  }}
>
  Change Password
</Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default ChangePassword;
