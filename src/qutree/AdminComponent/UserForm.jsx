import { BsFillBuildingFill } from "react-icons/bs"; 
import { FaUserPlus } from "react-icons/fa";  
import React, { useState, useRef, useEffect } from "react";
import { Input, message } from "antd";
import { MdFileUpload } from "react-icons/md";
import Api from "../api";
import { MuiTelInput } from "mui-tel-input";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import RegisterCompany from "./RegisterCompany";
const UserForm = () => {
  const [links, setLinks] = useState({
    fullName: "",
    phone: "",
    whatsapp: "",
    linkedin: "",
    twitter: "",
    company: "",
    email: "",
    image: "",
    password: "",
    userName: "",
    role: "",
    userQCardId: "",
    backgroundIndex: 0,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isUploaded, setIsUploaded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [cropData, setCropData] = useState(null);
  const [cropper, setCropper] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const fileInputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isSmall = window.innerWidth <= 768;
      setIsMobile(isSmall);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setLinks((prevLinks) => ({
      ...prevLinks,
      [name]: value,
      ...(name === "email" && { userName: value }),
    }));

    if (name === "email") {
      setEmailError("");
      setIsButtonDisabled(false);
      if (value) {
        try {
          const response = await Api.get(
            `/check-user/${encodeURIComponent(value)}`
          );
          if (response.data.status) {
            setEmailError(
              "Email already in use. Please logIn or choose another."
            );
            setIsButtonDisabled(true);
          }
        } catch (error) {
          console.error("Error checking email:", error);
        }
      } else {
        setIsButtonDisabled(false);
      }
    }
  };
  console.log(isGenerating);

  console.log(isGenerating);
  const handleImageUpload = (e) => {
    e.preventDefault();
    let files = e.target.files || e.dataTransfer.files;

    if (files.length) {
      const file = files[0];

      // Check if the selected file is an image
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setCropData(reader.result);
        setIsUploaded(false);
        setIsButtonDisabled(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCropData = () => {
    if (cropper && typeof cropper.getCroppedCanvas === "function") {
      const canvas = cropper.getCroppedCanvas({
        width: 160,
        height: 160,
      });

      if (canvas) {
        const croppedImage = canvas.toDataURL();
        setCropData(croppedImage);
        setLinks((prevLinks) => ({
          ...prevLinks,
          image: croppedImage,
        }));
        setIsUploaded(true);
        setLoading(false);
      } else {
        console.error("Failed to generate the cropped canvas.");
        setLoading(false);
      }
    } else {
      console.error("Cropper is not initialized or invalid.");
      setLoading(false);
    }
  };

  const handleRegisterUser = async () => {
    try {
      const formData = {
        ...links,
        backgroundIndex: 0,
      };
      // const roleToSend =
      //   formData.role === "CANDIDATE" || formData.role === "AGENT"
      //     ? formData.role
      //     : "USER";

      const roleToSend =
        formData.role === "CANDIDATE" ||
        formData.role === "AGENT" ||
        formData.role === "SECURITY"
          ? formData.role
          : "USER";
      const transformedData = {
        phone: [formData.phone],
        fullName: formData.fullName,
        whatsapp: formData.whatsapp,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        company: formData.company,
        email: [formData.email],
        userName: formData.userName,
        image: formData.image,
        password: formData.password,
        backgroundIndex: 0,
      };

      await Api.post(
        `/createInternally?roleName=${roleToSend}&userCardId=${formData.userQCardId}`,
        transformedData
      );
    } catch (error) {
      console.error("Error generating QR code:", error);
      message.error("An unexpected error occurred. Please try again.");
    }
  };

  const handlesubmitt = async () => {
    if (!links.email || !links.password || !links.confirmPassword) {
      message.error("Email, Password, and Confirm Password are required.");
      return; // Prevent proceeding if validation fails
    }

    // Check for password length and matching passwords
    if (links.password.length < 6) {
      message.error("Password must be at least 6 characters long.");
      return;
    }

    if (links.password !== links.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }
    setIsGenerating(true); // Start loading for QR code generation
    try {
      await handleRegisterUser();
      message.success("User created successfully.");
      setLinks({
        fullName: "",
        phone: "",
        whatsapp: "",
        linkedin: "",
        twitter: "",
        company: "",
        email: "",
        image: "",
        password: "",
        userName: "",
        role: "",
        userQCardId: "",
        backgroundIndex: 0,
      });
    } catch (error) {
      message.error("There was an issue. Please try again.");
    } finally {
      setShowValidation(false);
      setIsGenerating(false); // Stop loading for QR code generation
    }
  };
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }
  return (
    <div
      style={{
        marginLeft: isMobile ? "0px" : "240px",
        paddingTop: isMobile ? "20px" : "20px",
      }}
    >
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      {/* Switch Button Container */}
      <div className="order-1 md:order-2">
        <label className='themeSwitcherTwo shadow-card relative inline-flex cursor-pointer select-none items-center justify-center rounded-md bg-white p-1'>
          <input
            type='checkbox'
            className='sr-only'
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <span
            className={`flex items-center space-x-[6px] rounded py-2 px-[18px] text-md font-medium ${
              !isChecked ? 'text-primary bg-[#035E7B] text-white' : 'bg-[#f4f7ff]'
            }`}
          >
            <FaUserPlus className="mr-2" />
            User Account
          </span>
          <span
            className={`flex items-center space-x-[6px] rounded py-2 px-[18px] text-md font-medium ${
              isChecked ? 'text-primary bg-[#035E7B] text-white' : 'bg-[#f4f7ff]'
            }`}
          >
            <BsFillBuildingFill className="mr-2"/>
            Company Account
          </span>
        </label>
      </div>

      {/* Text Container */}
      <div className="order-2 md:order-1 mt-4 md:mt-0">
        <h1
          className={`text-3xl font-semibold leading-none p-4 text-center font-inter ${
            isMobile ? "text-[26px]" : "text-[32px]"
          }`}
        >
          {!isChecked ? "Create User Account" : "Create Visitor Company Account"}
        </h1>
      </div>
    </div>

     { isChecked ? (
      <>
  
     <RegisterCompany/> 
       </>
     ) : (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
       <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="fullName">
            Full Name <span className="text-red-600 ">*</span>
          </label>
          <Input
            className="border border-[#ccc] mt-2 rounded-[4px]"
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={links.fullName}
            onChange={handleChange}
            required
          />
          {showValidation && !links.fullName && (
            <p className="text-start text-red-500 text-sm">
              Full Name is required.
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email">
            Email <span className="text-red-600">*</span>
          </label>
          <Input
            className="border border-[#ccc] mt-2 rounded-[4px]"
            type="email"
            name="email"
            placeholder="abc@example.com"
            value={links.email}
            onChange={handleChange}
            required
          />
          {showValidation && !links.email && (
            <p className="text-start text-red-500 text-sm">
              Email is required.
            </p>
          )}
          {emailError && (
            <p className="text-start text-red-500">{emailError}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="phone">
            Phone Number <span className="text-red-600">*</span>
          </label>
          <MuiTelInput
            className=" w-full p-0 rounded-md"
            name="phone"
            value={links.phone}
            onChange={(value) =>
              handleChange({ target: { name: "phone", value } })
            }
            required
            defaultCountry="IN"
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                padding: 0,
              },
              "& .MuiInputBase-input": {
                padding: 0.8,
              },
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: "white",
                  color: "#091416",
                  height: "25%",
                },
              },
            }}
          />
          {showValidation && !links.phone && (
            <p className="text-start text-red-500 text-sm">
              Phone Number is required.
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="userQCardId">User Card Id</label>
          <Input
            className="border border-[#ccc] mt-2 rounded-[4px]"
            type="text"
            name="userQCardId"
            placeholder="VIP0000000"
            value={links.userQCardId}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter User Card ID to map an existing QR code, or leave it blank to
            create a new QR code.
          </p>
        </div>

        <div className="mb-4">
          <label htmlFor="role">
            Profile Type <span className="text-red-600">*</span>
          </label>
          <select
            name="role"
            value={links.role}
            onChange={(e) => {
              const selectedRole = e.target.value;
              setLinks((prev) => ({ ...prev, role: selectedRole }));
            }}
            className="mt-2 border rounded-md p-[6px] border-[#ccc] focus:border-blue-600 bg-white w-full"
          >
            <option value="" disabled>
              Select your profile type
            </option>
            <option value="USER">Business owner</option>
            <option value="CANDIDATE">Student</option>
            <option value="EMPLOYEE">Employee</option>
            <option value="SECURITY">Security</option>
            <option value="AGENT">Agent</option>
          </select>
          {showValidation && !links.role && (
            <p className="text-start text-red-500 text-sm">
              Profile Type is required.
            </p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="whatsapp" className="mb-2">
            WhatsApp
          </label>
          <MuiTelInput
            className="w-full border border-red-500"
            name="whatsapp"
            value={links.whatsapp}
            onChange={(value) =>
              handleChange({ target: { name: "whatsapp", value } })
            }
            defaultCountry="IN"
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                padding: 0,
              },
              "& .MuiInputBase-input": {
                padding: 0.8,
              },
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: "white",
                  color: "#091416",
                  height: "25%",
                },
              },
            }}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="linkedin">LinkedIn</label>
          <Input
            className="mt-2 rounded-[4px]"
            type="url"
            name="linkedin"
            placeholder="https://in.linkedin.com/"
            value={links.linkedin}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="twitter">Twitter</label>
          <Input
            className="mt-2 rounded-[4px]"
            type="url"
            name="twitter"
            placeholder="https://x.com/"
            value={links.twitter}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="company">Company</label>
          <Input
            className="mt-2 rounded-[4px]"
            type="url"
            name="company"
            placeholder="https://company.com"
            value={links.company}
            onChange={handleChange}
          />
        </div>

        <div>
          <h5 className="text-start mb-2">Profile Picture</h5>
          <div
            className="p-[20px] relative text-center border-dashed border-[#ccc] border-2"
            onDrop={handleImageUpload}
            onDragOver={(e) => e.preventDefault()}
          >
            <input
              type="file"
              accept="image/*"
              key={Date.now()}
              onClick={(e) => {
                e.target.value = null; // Reset file input when clicked
              }}
              onChange={handleImageUpload}
              className="hidden"
              ref={fileInputRef}
              id="image-upload"
            />
            {!cropData ? (
              <div className="flex flex-col justify-center items-center">
                <label htmlFor="image-upload">
                  <MdFileUpload className="text-[#02021B] rounded text-[45px] p-2 cursor-pointer " />
                </label>
                <label htmlFor="image-upload" className="mt-3 cursor-pointer">
                  Drag and drop an image or click to select
                </label>
              </div>
            ) : (
              <div className="relative">
                <Cropper
                  className="w-full"
                  initialAspectRatio={1}
                  aspectRatio={1}
                  src={cropData}
                  viewMode={1}
                  guides={true}
                  minCropBoxHeight={160}
                  minCropBoxWidth={160}
                  background={false}
                  responsive={true}
                  autoCropArea={1}
                  checkOrientation={false}
                  onInitialized={(instance) => setCropper(instance)}
                />
                <button
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }}
                  className="border cursor-pointer rounded-[4px] py-1 px-3 m-2 border-[#42c6fa] transition-3s hover:scale-105"
                >
                  Change Image
                </button>
                {!isUploaded && (
                  <button
                    className="border cursor-pointer rounded-[4px] py-1 px-3 m-2  bg-gradient-to-r from-[#066882] to-[#00cbff] text-white hover:scale-105"
                    type="primary"
                    onClick={async () => {
                      if (cropData && cropper) {
                        setLoading(true);
                        getCropData();
                      }
                    }}
                    loading={loading}
                    disabled={isUploaded}
                  >
                    Upload
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4 mt-2">
          <label htmlFor="password">
            Password <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <Input
              className="mt-2 rounded-[4px]"
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={links.password}
              onChange={handleChange}
              required
            />
            <span
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {passwordVisible ? (
                <EyeOutlined className="text-[#066882]" />
              ) : (
                <EyeInvisibleOutlined className="text-[#ccc]" />
              )}
            </span>
          </div>
          {links.password && links.password.length < 6 && (
            <p className="text-start text-red-500 text-sm">
              Password must be at least 6 characters long!
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword">
            Confirm Password <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <Input
              className="mt-2 rounded-[4px]"
              type={confirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={links.confirmPassword}
              onChange={handleChange}
              required
            />
            <span
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {confirmPasswordVisible ? (
                <EyeOutlined className="text-[#066882]" />
              ) : (
                <EyeInvisibleOutlined className="text-[#ccc]" />
              )}
            </span>
          </div>

          {links.password &&
            links.confirmPassword &&
            links.password !== links.confirmPassword && (
              <p className="text-start text-red-500 text-sm">
                Passwords do not match !
              </p>
            )}
        </div>

        <div className="flex justify-end items-end">
          <button
            className="border cursor-pointer rounded-[4px] py-2 px-10 m-2  bg-gradient-to-r from-[#066882] to-[#00cbff] text-white hover:scale-105"
            onClick={async () => {
              try {
                await handlesubmitt();
              } catch (error) {
                console.error(error);
              }
            }}
            disabled={isButtonDisabled}
          >
            Submit
          </button>
        </div>
      </div>
    
      </div>)}
    </div>
  );
};

export default UserForm;
