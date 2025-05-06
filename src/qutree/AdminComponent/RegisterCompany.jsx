import { AiOutlineCheck } from "react-icons/ai"; 
import React, { useState } from "react";
import Api from "../BaseUrlAPI";
import { FaPlus, FaTrash } from "react-icons/fa";
import { message } from "antd";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MuiTelInput } from "mui-tel-input";
const RegisterCompany = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    linkedin: "",
    twitter: "",
    phone: [""],
    email: [""],
    userName: "",
    companyName: "",
    password: "",
    visitorCompany: {
      name: "",
      numberOfEmployees: "",
      companyAddress: {
        street: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
      },
    },
  });

  const [currentStep, setCurrentStep] = useState(1);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordToggle = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const keys = name.split(".");
      setFormData((prev) => {
        const updated = { ...prev };
        keys.reduce((acc, key, idx) => {
          if (idx === keys.length - 1) acc[key] = value;
          else acc[key] = { ...acc[key] };
          return acc[key];
        }, updated);
        return updated;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleArrayChange = (e, field, index) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

 
  const validateStep = () => {
    let newErrors = {};
  
    if (currentStep === 1) {
      if (!formData.fullName) {
        newErrors.fullName = "Full Name is required.";
      }
      if (!formData.userName) {
        newErrors.userName = "Username is required.";
      }
      if (!formData.phone[0]) {
        newErrors.phone = "Phone Number is required.";
      }
      if (!formData.email[0]) {
        newErrors.email = "Email is required.";
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email[0])) {
        newErrors.email = "Please enter a valid email address.";
      }
    }  if (currentStep === 2) {
      const company = formData.visitorCompany;
      const address = company.companyAddress;
  
      if (!company.name) {
        newErrors.visitorCompanyName = "Visitor Company Name is required.";
      }
      if (!company.numberOfEmployees) {
        newErrors.numberOfEmployees = "Number of Employees is required.";
      }
      if (!address.street) {
        newErrors.street = "Street is required.";
      }
      if (!address.city) {
        newErrors.city = "City is required.";
      }
      if (!address.state) {
        newErrors.state = "State is required.";
      }
      if (!address.country) {
        newErrors.country = "Country is required.";
      }
      if (!address.pinCode) {
        newErrors.pinCode = "Pin Code is required.";
      }
    }  if (currentStep === 3) {
      if (!formData.password) {
        newErrors.password = "Password is required.";
      }
      if (formData.password.length < 6) {
        newErrors.passwordLength = "Password must be at least 6 characters.";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPasswordMatch = "Passwords do not match.";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirm Password is required.";
      }
    }
  
    setErrors(newErrors); // Update error state
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
  

  const handleNext = () => {
    if (validateStep()) setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    try {
      await Api.post("/create-user-with-company", formData);
      message.success("User registered successfully!");
    } catch (error) {
      message.error(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
        <div className="h-full bg-gray-100 flex justify-center items-center p-4">
          <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-6">
          <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className={`w-8 h-8 rounded-full border-2 ${currentStep > 1 ? "bg-gradient-to-r from-[#066882] to-[#00cbff] text-white" : "border-gray-400 text-gray-400"} flex items-center justify-center`}>
          {currentStep > 1 ? <AiOutlineCheck /> : "1"}
        </div>
        <div className={`flex-1 h-1 ${currentStep > 1  ? "bg-gradient-to-r from-[#066882] to-[#00cbff]" : "bg-gray-300"} mx-2`}></div>
        <div className={`w-8 h-8 rounded-full border-2 ${currentStep > 2 ? "bg-gradient-to-r from-[#066882] to-[#00cbff] text-white" : "border-gray-400 text-gray-400"} flex items-center justify-center`}>
          {currentStep > 2 ? <AiOutlineCheck /> : "2"}
        </div>
        <div className={`flex-1 h-1 ${currentStep > 2  ? "bg-gradient-to-r from-[#066882] to-[#00cbff]" : "bg-gray-300"} mx-2`}></div>
        <div className={`w-8 h-8 rounded-full border-2 ${currentStep === 3 ? "bg-gradient-to-r from-[#066882] to-[#00cbff] text-white" : "border-gray-400 text-gray-400"} flex items-center justify-center`}>
          {currentStep === 3 ? <AiOutlineCheck /> : "3"}
        </div>
      </div>

    </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          {currentStep === 1 && (
          <div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                placeholder="Full Name"
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                placeholder="Username"
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.userName && <p className="text-red-500 text-sm">{errors.userName}</p>}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
          <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">
          Phone <span className="text-red-500">*</span>
        </label>

        {formData.phone.map((phone, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <MuiTelInput
              className="w-full p-0 rounded-md"
              name={`phone-${index}`}
              value={phone}
              onChange={(value) =>
                handleArrayChange({ target: { name: `phone-${index}`, value } }, "phone", index)
              }
              required
              defaultCountry="IN"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  padding: 0.5,
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

            <div className="flex gap-2">
              {formData.phone.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField("phone", index)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  <FaTrash />
                </button>
              )}
              <button
                type="button"
                onClick={() => addArrayField("phone")}
                className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
              >
                <FaPlus />
              </button>
            </div>
          </div>
        ))}

        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
      </div>
    </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              {formData.email.map((email, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="email"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => handleArrayChange(e, "email", index)}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex gap-2">
                    {formData.email.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField("email", index)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => addArrayField("email")}
                      className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
              ))}
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn Profile
              </label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                placeholder="LinkedIn Profile"
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter Profile
              </label>
              <input
                type="url"
                name="twitter"
                value={formData.twitter}
                placeholder="Twitter Profile"
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          </div>)}


          {/* Visitor Company Section */}
          {currentStep === 2 && (
          <div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 text-center">
              Visitor Company
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visitor Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="visitorCompany.name"
                value={formData.visitorCompany.name}
                placeholder="Visitor Company Name"
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.visitorCompanyName && (
              <p className="text-red-500 text-sm">{errors.visitorCompanyName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Employees <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="visitorCompany.numberOfEmployees"
                value={formData.visitorCompany.numberOfEmployees}
                placeholder="Number of Employees"
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
               {errors.numberOfEmployees && (
              <p className="text-red-500 text-sm">{errors.numberOfEmployees}</p>
              )}
            </div>
          </div>

          {/* Company Address Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 text-center">
              Company Address
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="visitorCompany.companyAddress.street"
                value={formData.visitorCompany.companyAddress.street}
                placeholder="Street"
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
                {errors.street && (
              <p className="text-red-500 text-sm">{errors.street}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="visitorCompany.companyAddress.city"
                value={formData.visitorCompany.companyAddress.city}
                placeholder="City"
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
                {errors.city && (
              <p className="text-red-500 text-sm">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="visitorCompany.companyAddress.state"
                value={formData.visitorCompany.companyAddress.state}
                placeholder="State"
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
               {errors.state && (
              <p className="text-red-500 text-sm">{errors.state}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="visitorCompany.companyAddress.country"
                value={formData.visitorCompany.companyAddress.country}
                placeholder="Country"
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              /> 
              {errors.country && (
                <p className="text-red-500 text-sm">{errors.country}</p>
                )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pin Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="visitorCompany.companyAddress.pinCode"
                value={formData.visitorCompany.companyAddress.pinCode}
                placeholder="Pin Code"
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
               {errors.pinCode && (
                <p className="text-red-500 text-sm">{errors.pinCode}</p>
                )}
            </div>
          </div>
          </div>)}

            {/* Password Fields */}
            {currentStep === 3 && (
        <div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              placeholder="Username"
              onChange={handleInputChange}
              required
              disabled
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-4">
            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  placeholder="Password"
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handlePasswordToggle}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              {errors.passwordLength && <p className="text-red-500 text-sm">{errors.passwordLength}</p>}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  placeholder="Confirm Password"
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleConfirmPasswordToggle}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
              {errors.confirmPasswordMatch && <p className="text-red-500 text-sm">{errors.confirmPasswordMatch}</p>}
            </div>
          </div>
        </div>
      )}

          {/* Submit Button */}
          <div className="flex justify-between mt-4">
            {currentStep > 1 && (
              <button type="button" onClick={handlePrevious} className="px-4 py-2 bg-gray-300 rounded">
                Previous
              </button>
            )}
            {currentStep < 3 && (
              <button type="button" onClick={handleNext} className="px-4 py-2 bg-gradient-to-r from-[#066882] to-[#00cbff] text-white rounded">
                Next
              </button>
            )}
            {currentStep === 3 && (
              <button type="submit" className="px-4 py-2 bg-gradient-to-r from-[#066882] to-[#00cbff] text-white rounded">
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterCompany;