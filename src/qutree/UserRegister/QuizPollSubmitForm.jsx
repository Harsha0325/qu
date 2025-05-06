import React, { useState } from "react";
import { Input, Button } from "antd";
import { MuiTelInput } from "mui-tel-input";
import { useParams } from "react-router-dom";

const QuizPollSubmitForm = () => {
  const [data, setData] = useState({
    fullName: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    email: "",
  });

  const { quizid } = useParams();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handlePhoneChange = (value) => {
    setData((prev) => ({ ...prev, phone: value }));
    if (errors.phone) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: "",
      }));
    }
  };

  const validateFields = () => {
    let isValid = true;
    let errorMessages = { fullName: "", phone: "", email: "" };

    // Validate Full Name
    if (!data.fullName.trim()) {
      errorMessages.fullName = "Full Name is required.";
      isValid = false;
    }

    // Validate Email
    if (!data.email.trim()) {
      errorMessages.email = "Email is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errorMessages.email = "Please enter a valid email address.";
      isValid = false;
    }

    // Validate Phone Number
    if (!data.phone.trim()) {
      errorMessages.phone = "Phone Number is required.";
      isValid = false;
    } else if (!/^\+?\d{1,4}?[\s.-]?\(?\d{1,3}?\)?[\s.-]?\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{1,9}$/.test(data.phone)) {
      errorMessages.phone = "Please enter a valid phone number.";
      isValid = false;
    }

    setErrors(errorMessages);
    return isValid;
  };

  const handleUserAndPollSubmit = async () => {
    if (!validateFields()) {
      return;
    }
    window.location.href = `https://qugates.com/quiz/test/${quizid}/${data.email}/${encodeURIComponent(data.fullName)}/${encodeURIComponent(data.phone)}`; 
  };

  return (
    <div
      className="flex justify-center items-center h-screen overflow-y-scroll p-1 w-full overflow-x-hidden font-inter"
      style={{
        background:
          "linear-gradient(120deg, rgba(27, 51, 81, 1) 40.11%, rgba(36, 6, 33, 1) 102.2%)",
        strokeWidth: "1px",
        stroke: "rgba(51, 66, 255, 0)",
        backdropFilter: "blur(50px)",
      }}
    >
      <div className="p-6 w-full max-w-lg bg-opacity-10 backdrop-blur-md rounded-lg">
        <div className="text-center text-white font-bold text-[30px] mb-6">Quiz Poll</div>
        <form>
          <div className="mb-4 w-full">
            <label htmlFor="fullName" className="block text-white font-semibold">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="fullName"
              placeholder="Jane Doe"
              value={data.fullName}
              onChange={handleChange}
              required
              className="w-full p-4 bg-transparent focus:ring-0 bg-white"
            />
            {errors.fullName && <p className="text-start text-red-500 text-xs">{errors.fullName}</p>}
          </div>

          <div className="mb-4 w-full">
            <label htmlFor="email" className="block text-white font-semibold">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              name="email"
              placeholder="janedoe@example.com"
              value={data.email}
              onChange={handleChange}
              required
              className="w-full p-4 bg-transparent focus:ring-0 bg-white"
            />
            {errors.email && <p className="text-start text-red-500 text-xs">{errors.email}</p>}
          </div>

          <div className="mb-4 w-full">
            <label htmlFor="phone" className="block text-white font-semibold">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <MuiTelInput
              name="phone"
              value={data.phone}
              onChange={handlePhoneChange}
              required
              defaultCountry="IN"
              variant="outlined"
              className="w-full bg-transparent rounded-md bg-white"
            />
            {errors.phone && <p className="text-start text-red-500 text-xs">{errors.phone}</p>}
          </div>

          <Button
            type="primary"
            onClick={handleUserAndPollSubmit}
            loading={loading}
            className="flex justify-center items-center mt-6 py-6 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-md w-full"
          >
            {loading ? "Processing..." : "Next"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default QuizPollSubmitForm;
