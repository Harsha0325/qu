import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select } from "antd";
import { Link, useParams } from "react-router-dom";
import Logo_quikynet from "../../image/QuikynetLogo.svg";
import Api from "../BaseUrlAPI";
import "../HomeComponents/ResetPassword.css";
import { DownOutlined } from "@ant-design/icons";
const VisitorFormForQuikyNetUser = () => {
  const { Option, OptGroup } = Select;

  const [form] = Form.useForm();
  const [visitingPurposes, setVisitingPurposes] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [accountType, setAccountType] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [fullName, setFullNameType] = useState("");
  const tempParams = new URLSearchParams(window.location.search);
  const companyId = tempParams.get("companyId");
  const { id } = useParams();
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await Api.get(`/get-visitor-details/${id}`);
        if (response.status === 200) {
          setUserDetails(response.data);
          setAccountType(response.data.accountType);
          setFullNameType(response.data.fullName);
  
          console.log("test", response.data.accountType);
          console.log("test data" , userDetails);
          // Set form values only if account type is PRIVATE
          if (response.data.accountType === "PRIVATE") {
            form.setFieldsValue({
              visitorName: response.data.fullName,
              mobileNo: response.data.phone[0],
              email: response.data.email[0],
             
            });
          
          }
        } else {
          console.error("Failed to fetch user details:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    const fetchVisitingPurposes = async () => {
      try {
        const response = await Api.get(
          `/companies/${companyId}/visiting-purposes`
        );
        if (response.status === 200) {
          setVisitingPurposes(response.data);
        } else {
          console.error(
            "Failed to fetch visiting purposes:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching visiting purposes:", error);
      }
    };

    fetchUserDetails();
    fetchVisitingPurposes();
  }, [form]);

  const onFinish = async (values) => {
    const selectedOptionId = values.visitingOption;
    const selectedOption = visitingPurposes
      .flatMap((purpose) => purpose.options)
      .find((option) => option.id === selectedOptionId);

    if (!selectedOption) {
      console.error("No valid visiting option selected.");
      return;
    }

    // Prepare check-in data based on account type
    const checkInData =
      accountType === "PUBLIC"
        ? {
            visitorName: fullName,
            mobileNo: userDetails.phone[0],       
            email: userDetails.email[0],
            purposeOfVisit: selectedOption.optionName,
          }
        : {
            visitorName: values.visitorName,
            mobileNo: values.mobileNo,
            email: values.email,
            purposeOfVisit: selectedOption.optionName,
          };

    try {
      const response = await Api.post(
        `/check-in?companyId=${companyId}`,
        checkInData
      );
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
   
      <div className="w-full max-w-xl">
        {!isSubmitted ? (
          <>
            {accountType === "PRIVATE" ? (
              <div className="text-center text-white mb-5 mt-5 font-[Archivo] text-xl">
                Visitor Entry Form
              </div>
            ) : (
              <>
                <div className="text-center text-white mb-5 mt-2 font-[Archivo] text-xl">
                  Welcome, {fullName}!
                </div>
                <div className="text-center text-white mb-5 mt-6 font-[Archivo] text-lg">
                  Please enter your visiting purpose to complete the check-in.
                </div>
              </>
            )}
            <div className="bg-white/10 backdrop-blur-md shadow-lg p-6 rounded-lg border-none">
              <Form layout="vertical" form={form} onFinish={onFinish}>
                {accountType === "PRIVATE" && (
                  <>
                    <Form.Item
                      label={
                        <span className="text-white font-raleway">
                          Visitor Name<span className="text-red-500"> *</span>
                        </span>
                      }
                      name="visitorName"
                      rules={[
                        { required: true, message: "Please enter your name" },
                      ]}
                    >
                      <Input
                        placeholder="Enter your name"
                        className="bg-gray-100 hover:bg-gray-100 border border-white text-black px-2 py-1.5 w-full rounded-md placeholder-gray-400"
                      />
                    </Form.Item>

                    {/** Contact Number Field */}
                    <Form.Item
                      label={
                        <span className="text-white font-raleway">
                          Contact Number<span className="text-red-500"> *</span>
                        </span>
                      }
                      name="mobileNo"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your contact number",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter your contact number"
                        className="bg-gray-100 hover:bg-gray-100 border border-white text-black px-4 py-1.5 w-full rounded-md placeholder-gray-400"
                      />
                    </Form.Item>

                    {/** Email Field */}
                    <Form.Item
                      label={
                        <span className="text-white font-raleway">
                          Email ID<span className="text-red-500"> *</span>
                        </span>
                      }
                      name="email"
                      rules={[
                        { required: true, message: "Please enter your email" },
                      ]}
                    >
                      <Input
                        placeholder="Enter your email"
                        className="bg-gray-100 hover:bg-gray-100 border border-white text-black px-4 py-1.5 w-full rounded-md placeholder-gray-400"
                      />
                    </Form.Item>
                  </>
                )}

                <Form.Item
                  label={
                    <span style={{ color: "white", fontFamily: "Raleway" }}>
                      Visiting Purpose<span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  name="visitingOption"
                  rules={[
                    {
                      required: true,
                      message: "Please select the purpose of your visit",
                    },
                  ]}
                >
                  {accountType === "PUBLIC" ? (
                    <Select
                      placeholder="Select purpose of visit"
                      className="bg-transparent hover:bg-transparent text-white w-full rounded-md placeholder-gray-200"
                      dropdownStyle={{
                        backgroundColor: "white",
                        color: "white",
                      }}
                      optionLabelProp="label"
                      suffixIcon={
                        <DownOutlined className="text-gray-500 font-bold text-lg" />
                      }
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
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
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
                            <Option
                              key={option.id}
                              value={option.id}
                              label={option.optionName}
                            >
                              {option.optionName}
                            </Option>
                          ))}
                        </OptGroup>
                      ))}
                    </Select>
                  ) : (
                    <Select
                      placeholder="Select purpose of visit"
                      className="bg-transparent hover:bg-transparent text-white w-full rounded-md placeholder-gray-200"
                      dropdownStyle={{
                        backgroundColor: "white",
                        color: "white",
                      }}
                      optionLabelProp="label"
                      suffixIcon={
                        <DownOutlined className="text-gray-500 font-bold text-lg" />
                      }
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
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
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
                            <Option
                              key={option.id}
                              value={option.id}
                              label={option.optionName}
                            >
                              {option.optionName}
                            </Option>
                          ))}
                        </OptGroup>
                      ))}
                    </Select>
                  )}
                </Form.Item>

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
          </>
        ) : (
          <div
            style={{ color: "white", textAlign: "center", marginTop: "80px" }}
          >
            Thank you! Your entry has been recorded.
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitorFormForQuikyNetUser;
