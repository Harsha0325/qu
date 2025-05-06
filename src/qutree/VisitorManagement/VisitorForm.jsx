import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Logo_quikynet from "../../image/QuikynetLogo.svg";
import Api from "../BaseUrlAPI";
import { FaArrowRight } from "react-icons/fa6";
import { DownOutlined } from "@ant-design/icons";

const VisitorForm = () => {
  const { Option, OptGroup } = Select;
  const [form] = Form.useForm();
  const [visitingPurposes, setVisitingPurposes] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const tempParams = new URLSearchParams(window.location.search);
  const companyId = tempParams.get("companyId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVisitingPurposes = async () => {
      try {
        const response = await Api.get(`/companies/${companyId}/visiting-purposes`);
        if (response.status === 200) {
          setVisitingPurposes(response.data);
        } else {
          console.error("Failed to fetch visiting purposes:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching visiting purposes:", error);
      }
    };

    fetchVisitingPurposes();
  }, []);

  const onFinish = async (values) => {
    const selectedOptionId = values.visitingOption;
    const selectedOption = visitingPurposes
      .flatMap((purpose) => purpose.options)
      .find((option) => option.id === selectedOptionId);

    if (!selectedOption) {
      console.error("No valid visiting option selected.");
      return;
    }

    const checkInData = {
      visitorName: values.visitorName,
      mobileNo: values.mobileNo,
      email: values.email,
      purposeOfVisit: selectedOption.optionName,
    };

    try {
      const response = await Api.post(`/check-in?companyId=${companyId}`, checkInData);
      if (response.status === 200) {
        setIsSubmitted(true);
        console.log("Check-in successful");
      } else {
        console.error("Check-in failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during check-in:", error);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 py-8"
      style={{
        background: "linear-gradient(120deg, rgba(27, 51, 81, 1) 40.11%, rgba(36, 6, 33, 1) 102.2%)",
        backdropFilter: "blur(50px)",
      }}
    >
      <Link to="/" className="mb-8">
        <img src={Logo_quikynet} alt="Logo quikynet" className="h-14" />
      </Link>

      {!isSubmitted ? (
        <div className="w-full max-w-xl">
          <h1 className="text-2xl font-archivo text-white text-center mb-8">Visitor Entry Form</h1>

          <div className="bg-white/10 backdrop-blur-md shadow-lg p-6 rounded-lg">
            <Form layout="vertical" form={form} onFinish={onFinish} className="space-y-6">
              {/** Visitor Name Field */}
              <Form.Item
                label={<span className="text-white font-raleway">Visitor Name<span className="text-red-500"> *</span></span>}
                name="visitorName"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input
                  placeholder="Enter your name"
                  className="bg-gray-100 hover:bg-gray-100 border border-white text-black px-4 py-1.5 w-full rounded-md placeholder-gray-400"
                />
              </Form.Item>

              {/** Contact Number Field */}
              <Form.Item
                label={<span className="text-white font-raleway">Contact Number<span className="text-red-500"> *</span></span>}
                name="mobileNo"
                rules={[{ required: true, message: "Please enter your contact number" }]}
              >
                <Input
                  placeholder="Enter your contact number"
                  className="bg-gray-100 hover:bg-gray-100 border border-white text-black px-4 py-1.5 w-full rounded-md placeholder-gray-400"
                />
              </Form.Item>

              {/** Email Field */}
              <Form.Item
                label={<span className="text-white font-raleway">Email ID<span className="text-red-500"> *</span></span>}
                name="email"
                rules={[{ required: true, message: "Please enter your email" }]}
              >
                <Input
                  placeholder="Enter your email"
                  className="bg-gray-100 hover:bg-gray-100 border border-white text-black px-4 py-1.5 w-full rounded-md placeholder-gray-400"
                />
              </Form.Item>

              {/** Visiting Purpose Field */}
              <Form.Item
                label={<span className="text-white font-raleway">Visiting Purpose<span className="text-red-500"> *</span></span>}
                name="visitingOption"
                rules={[{ required: true, message: "Please select the purpose of your visit" }]}
              >
              <Select
              placeholder="Select purpose of visit"
              className="bg-transparent hover:bg-transparent text-white w-full rounded-md placeholder-gray-200"
              dropdownStyle={{ backgroundColor: "white", color: "white" }}
              optionLabelProp="label"
              suffixIcon={<DownOutlined  className="text-gray-500 font-bold text-lg" />}
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "rgba(255, 255, 255, 0.1)", 
                  borderColor: "white",
                  color: "white", 
                }),
                singleValue: (base) => ({
                  ...base,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "white", 
                }),
                option: (base) => ({
                  ...base,
                  backgroundColor:"rgba(255, 255, 255, 0.1)" , 
                  color: "white",
                  ":hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }),
              }}
            >
              {visitingPurposes.map((purpose) => (
                <OptGroup key={purpose.id} label={purpose.purposeName}>
                  {purpose.options.map((option) => (
                    <Option key={option.id} value={option.id} label={option.optionName}>
                      {option.optionName}
                    </Option>
                  ))}
                </OptGroup>
              ))}
            </Select>

              </Form.Item>

              {/** Submit Button */}
              <Form.Item className="flex justify-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-transparent border border-white text-white px-6 py-2 rounded-md hover:bg-white hover:text-[#091416] transition-colors duration-300"
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-xl mt-20 text-center">
          <div className="bg-white/10 backdrop-blur-md shadow-lg border-none text-white p-8 rounded-lg">
            <h2 className="text-xl font-archivo text-[#ECEEEE] mb-6">
              Create Your Digital Business Card for Easy Check-ins & Networking!
            </h2>
            <p className="text-sm text-[#C4C9CB] mb-8">
              Save time on your next visit and start using your card as your digital business card.
            </p>
            <Button
              type="primary"
              onClick={() => navigate("/oauth/signup")}
              className="bg-white/10 backdrop-blur-md shadow-lg text-white border border-[#FEFAF6] px-2 py-3 rounded-none text-base font-archivo flex items-center gap-2
                         hover:bg-[#FEFAF6] hover:text-[#00080b] transition-colors duration-300"
            >
              Create Digital Business Card <FaArrowRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorForm;
