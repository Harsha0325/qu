import React, { useState } from "react";
import { Form, Input, Button, message, Typography, Layout, Card } from "antd";
import { useNavigate } from "react-router-dom";
import Api from "../BaseUrlAPI"; // Ensure this imports the configured axios instance

import "./ResetPassword.css";

const ResetPassword = () => {
  const { Content } = Layout;
  const { Title } = Typography;
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  const [token, setToken] = useState("");
  const sendOtp = async (values) => {
    setLoading(true);
    try {
      // Check if the email is registered
      const checkResponse = await Api.get(`/check-user/${values.email}`);

      if (checkResponse.data.status) {
        // Email is registered, send OTP
        const response = await Api.post("/otp/send-otp-password-reset", {
          email: values.email,
        });
        message.success("OTP sent successfully to your email.");
        setEmail(values.email); // Save email for OTP verification
        setCurrentStep(2); // Move to step 2 after successful OTP sent
      } else {
        // Email is not registered
        message.error(
          "Email is not registered. Please check your email and try again."
        );
      }
    } catch (error) {
      message.error(
        "Email is not registered. Please check your email and try again."
      );
    }
    setLoading(false);
  };
  // Step 2: Verify OTP
  const verifyOtp = async (values) => {
    setLoading(true);
    try {
      const response = await Api.post("/otp/verify-otp-password-reset", {
        email: email,
        otp: values.otp,
      });

      // Extract token from response
      if (response.data.success) {
        setToken(response.data.token); // Save the token
        message.success("OTP verified successfully!");
        setOtp(values.otp); // Save OTP for further processing
        setCurrentStep(3); // Move to step 3 after successful OTP verification
      } else {
        message.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      message.error("Invalid OTP. Please try again.");
    }
    setLoading(false);
  };

  // Step 3: Reset Password
  const resetPassword = async (values) => {
    setLoading(true);
    try {
      const response = await Api.post(
        "/reset-password",
        {
          userName: email,
          newPassword: values.newPassword,
          otp: otp,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the request headers
          },
        }
      );
      message.success("Password reset successfully!");
      navigate("/oauth/login");
    } catch (error) {
      message.error("Failed to reset password. Please try again.");
    }
    setLoading(false);
  };

  const renderStepForm = () => {
    if (currentStep === 1) {
      // Step 1: Enter email to receive OTP
      return (
        <Form onFinish={sendOtp}>
          <Title
            level={2}
            style={{
              textAlign: "center",
              color: "white",
              margin: "0 auto",
              fontFamily: "Archivo",
            }}
          >
            Reset Password
          </Title>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your registered email" },
            ]}
          >
            <Input
              className="custom-input"
              placeholder="Enter your email"
              style={{
                backgroundColor: "transparent", // Transparent input field
                border: "1px solid white", // White border
                color: "white", // White text
                padding: "10px",
                marginTop: "25px",
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                background: `linear-gradient(to right, #066882, #00CBFF)` /* Gradient from #066882 to #00CBFF */,
                backgroundColor: "white",
                padding: "20px",
              }}
            >
              Send OTP
            </Button>
          </Form.Item>
        </Form>
      );
    } else if (currentStep === 2) {
      // Step 2: Enter received OTP
      return (
        <Form onFinish={verifyOtp}>
          <Title
            level={2}
            style={{
              textAlign: "center",
              color: "white",
              margin: "0 auto",
              fontFamily: "Archivo",
            }}
          >
            Enter OTP
          </Title>
          <Form.Item
            name="otp"
            rules={[{ required: true, message: "Please enter the OTP" }]}
          >
            <Input
              placeholder="Enter the OTP"
              className="custom-input"
              style={{
                backgroundColor: "transparent", // Transparent input field
                border: "1px solid white", // White border
                color: "white", // White text
                padding: "10px",
                marginTop: "25px",
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                background: `linear-gradient(to right, #066882, #00CBFF)` /* Gradient from #066882 to #00CBFF */,
                backgroundColor: "white",
                padding: "20px",
              }}
            >
              Verify OTP
            </Button>
          </Form.Item>
        </Form>
      );
    } else if (currentStep === 3) {
      // Step 3: Enter new password and confirm
      return (
        <Form onFinish={resetPassword}>
          <Title
            level={2}
            style={{
              textAlign: "center",
              color: "white",
              margin: "0 auto",
              fontFamily: "Archivo",
            }}
          >
            Set New Password
          </Title>
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: "Please enter your new password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
            hasFeedback
          >
            <Input.Password
              className="custom-input-password"
              placeholder="New Password"
              style={{
                backgroundColor: "transparent", // Transparent input field
                border: "1px solid white", // White border
                color: "white", // White text
                padding: "10px",
                marginTop: "25px",
                width: "100%",
              }}
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
                    new Error("The passwords do not match.")
                  );
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password
              className="custom-input-password"
              placeholder="Confirm New Password"
              style={{
                backgroundColor: "transparent", // Transparent input field
                border: "1px solid white", // White border
                color: "white", // White text
                padding: "10px",
                marginTop: "25px",
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                background: `linear-gradient(to right, #066882, #00CBFF)` /* Gradient from #066882 to #00CBFF */,
                backgroundColor: "white",
                padding: "20px",
              }}
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      );
    }
  };

  return (
    <Layout
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background:
        "linear-gradient(120deg, rgba(27, 51, 81, 1) 40.11%, rgba(36, 6, 33, 1) 102.2%)",
        strokeWidth: "1px",
        stroke: "rgba(51, 66, 255, 0)",
        backdropFilter: "blur(50px)",
        padding : "5px"
      }}
    >
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Card
          style={{
            maxWidth: "550px",
            width: "100%",
            padding: "20px",
            backgroundColor:
              " rgba(255, 255, 255, 0.1)" /* white with 10% opacity */,
            backdropFilter: "blur(10px)", // Dark background for card
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            border: "none", // Optional: a subtle shadow for depth
          }}
        >
          {renderStepForm()}
        </Card>
      </Content>
    </Layout>
  );
};

export default ResetPassword;


