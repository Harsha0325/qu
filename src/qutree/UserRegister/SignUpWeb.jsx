import React, { useState, useContext, useEffect } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import Api from "../BaseUrlAPI";
import { Base64 } from "js-base64";
import { OAuthContext } from "../OAuth/OAuthContext";
import InfoLeftContainer from "../OAuth/InfoLeftContainer";
import SignUp from "./SignUp";

const SignUpWeb = () => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);;
  const [userQCardId, setUserQCardId] = useState(null);
  const navigate = useNavigate();
  const { oauth } = useContext(OAuthContext);
  const queryParams = new URLSearchParams(window.location.search);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const tempParams = new URLSearchParams(window.location.search);

    if(tempParams.get("quizId")){
      const extractedFullName = tempParams.get("fullName");
      const extractedEmail = tempParams.get("email");
      const extractedPhone = tempParams.get("phone");
  
      if (extractedFullName) setFullName(decodeURIComponent(extractedFullName));
      if (extractedEmail) setUserName(decodeURIComponent(extractedEmail));
      if (extractedPhone) setPhoneNumber(decodeURIComponent(extractedPhone));
    }

    const userCardId = tempParams.get("userQCardId");
    if (userCardId != null) {
      setUserQCardId(userCardId);
    }
  }, []);

  const handlePasswordVisibility = () => setShowPassword(!showPassword);
  const handleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const validate = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Full Name is required.";
    if (!phoneNumber.trim())
      newErrors.phoneNumber = "Phone Number is required.";
    if (!userName.trim()) {
      newErrors.userName = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userName)) {
      newErrors.userName = "Invalid email format.";
    }
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters long";
    // else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
    //   newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
    // }
    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required.";
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (setter, fieldName, value) => {
    setter(value);
    if (errors[fieldName]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: "",
      }));
    }
  };

  const handleFormSubmit = async () => {
    if (!validate()) return;
  
    const userData = {
      fullName,
      phone: [phoneNumber],
      email: [userName],
      userName,
      backgroundIndex: 0,
      dateTime: null,
      password,
    };
    
    setLoading(true);
    try {
      if (userQCardId != null) {
        const response = await Api.post(`/agents/create-user`, userData, {
          params: { userCardId: userQCardId },
        });
  
        if (response.status === 201) {
          const newUserId = response.data?.id;
          if (newUserId) {
            message.success("Registration Successful");
            navigate(`/plan-card/${Base64.encode(newUserId)}/${Base64.encode(userQCardId)}`);
          } else {
            message.error("User ID not found in response.");
          }
        }
      } else {
        const response = await Api.post(`/user/create-user`, userData, {
          params: { roleName: "USER" },
        });
  
        if (response.status === 201 || response.status === 200) {
          const newUserId = response.data?.id;
          if (newUserId) {
            message.success("Registration Successful");
  
            // Get tempParams again inside the function
            const tempParams = new URLSearchParams(window.location.search);
            
            if (oauth.service && oauth.service !== "") {
              navigate(`/oauth/login${window.location.search}`);
            } else if (tempParams.get("encodedId") !== null) {
              navigate(`/payment?id=${tempParams.get("encodedId")}&userId=${Base64.encode(newUserId)}}&categoryName=${tempParams.get("encodedCategoryName")}`);
            } else if (tempParams.get("quizId") !== null) {
              window.location.href = `https://qugates.com/quiz/test/${tempParams.get("quizId")}/${userName}/${encodeURIComponent(fullName)}/${encodeURIComponent(phoneNumber)}`;
            }  else {
              navigate("/oauth/login");
            }
          } else {
            message.error("User ID not found in the registration response.");
          }
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      if (errorMessage) {
          message.error(errorMessage);
      } else {
        message.error("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const renderLabel = (labelText) => (
    <label
      className="required-label"
      style={{ color: "white", fontSize: "14px" }}
    >
      {labelText} <span className="required-asterisk">*</span>
    </label>
  );

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      {isMobile ? <></> : <InfoLeftContainer />}
      <SignUp
        {...{
          isMobile,
          oauth,
          renderLabel,
          fullName,
          handleInputChange,
          setFullName,
          errors,
          phoneNumber,
          setPhoneNumber,
          userName,
          setUserName,
          setErrors,
          showPassword,
          password,
          setPassword,
          handlePasswordVisibility,
          showConfirmPassword,
          confirmPassword,
          setConfirmPassword,
          handleConfirmPasswordVisibility,
          loading,
          handleFormSubmit,
          navigate,
          queryParams,
        }}
      />
    </div>
  );
};

export default SignUpWeb;
