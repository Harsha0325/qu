import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  message,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { BsCalendar2Date } from "react-icons/bs";
const { TextArea } = Input;
import axios from "@axios";
const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    appointmentDate: "",
    purpose: "",
    assignedUserId: "",
    companyId: "",
  });

  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  // Fetch companies when the component loads
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("/companies");
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies", error);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch users when a company is selected
  useEffect(() => {
    if (formData.companyId) {
      const fetchUsers = async () => {
        try {
          const response = await axios.get(
            `/users/by-company?companyId=${formData.companyId}`
          );
          setUsers(response.data);
        } catch (error) {
          console.error("Error fetching users", error);
          setUsers([]);
        }
      };
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [formData.companyId]);

  const handleCompanyChange = (value) => {
    setFormData({ ...formData, companyId: value });
    form.setFieldValue("assignedUserId", null); // Reset assigned user on company change
  };

  const handleUserChange = (value) => {
    setFormData({ ...formData, assignedUserId: value });
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const appointmentData = {
      fullName: values.fullName,
      email: values.email,
      phoneNumber: values.phoneNumber,
      appointmentDate: values.appointmentDate.toISOString(),
      purpose: values.purpose,
      assignedUser: { id: values.assignedUserId },
    };

    try {
      await axios.post(
        `/take-appointment?companyId=${values.companyId}`,
        appointmentData
      );
      message.success("Appointment successfully created!");
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error("Error creating appointment. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#00080b] flex justify-center items-center px-4 py-8 overflow-y-auto">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-archivo text-white text-center mb-8">
          Take an Appointment
        </h1>

        <div className="bg-[#091416] rounded-lg shadow-lg p-6 border-none">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={formData}
            className="space-y-6"
          >
            <Form.Item
              name="fullName"
              label={
                <span className="text-white font-raleway">
                  Name<span className="text-red-500"> *</span>
                </span>
              }
              rules={[{ required: true, message: "Please enter your full name" }]}
            >
              <Input
                placeholder="Enter your full name"
                className="bg-transparent border border-white text-white px-4 py-2 w-full
                          focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-md"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label={
                <span className="text-white font-raleway">
                  Email<span className="text-red-500"> *</span>
                </span>
              }
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" }
              ]}
            >
              <Input
                placeholder="Enter your email"
                className="bg-transparent border border-white text-white px-4 py-2 w-full
                          focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-md"
              />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label={
                <span className="text-white font-raleway">
                  Phone Number<span className="text-red-500"> *</span>
                </span>
              }
              rules={[
                { required: true, message: "Please enter your phone number" },
              ]}
            >
              <Input
                placeholder="Enter your phone number"
                className="bg-transparent border border-white text-white px-4 py-2 w-full
                          focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-md"
              />
            </Form.Item>

            <Form.Item
              name="appointmentDate"
              label={
                <span className="text-white font-raleway">
                  Appointment Date<span className="text-red-500"> *</span>
                </span>
              }
              rules={[
                { required: true, message: "Please select an appointment date" },
              ]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid white",
                  color: "white",
                  padding: "10px",
                  width: "100%",
                }}
                suffixIcon={
                  <BsCalendar2Date
                    style={{
                      color: "#D4D8DA",
                      fontSize: "1.2rem",
                      padding: "2px 2px 2px 2px",
                    }}
                  />
                }
              />
            </Form.Item>

            <Form.Item
              name="purpose"
              label={
                <span className="text-white font-raleway">
                  Purpose<span className="text-red-500"> *</span>
                </span>
              }
              rules={[{ required: true, message: "Please enter the purpose" }]}
            >
              <TextArea
                placeholder="Enter the purpose of the appointment"
                rows={3}
                className="bg-transparent border border-white text-white px-4 py-2 w-full
                          focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-md"
              />
            </Form.Item>

            <Form.Item
              name="companyId"
              label={
                <span className="text-white font-raleway">
                  Company<span className="text-red-500"> *</span>
                </span>
              }
              rules={[{ required: true, message: "Please select a company" }]}
            >
              <Select
                placeholder="Select a company"
                onChange={handleCompanyChange}
                className="bg-transparent border border-white text-white px-4 py-2 w-full
                          focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-md"
                value={formData.companyId}
                style={{ width: "100%" }}
                dropdownStyle={{ backgroundColor: "white", color: "white" }}
                optionLabelProp="label"
                suffixIcon={
                  <DownOutlined
                    style={{
                      color: "#D4D8DA",
                      fontSize: "1.2rem",
                      padding: "15px 10px 10px 10px",
                    }}
                  />
                }
              >
                {companies.map((company) => (
                  <Select.Option
                    key={company.id}
                    value={company.id}
                    label={company.name}
                  >
                    {company.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="assignedUserId"
              label={
                <span className="text-white font-raleway">
                  Assigned User<span className="text-red-500"> *</span>
                </span>
              }
              rules={[{ required: true, message: "Please select a user" }]}
            >
              <Select
                placeholder="Select a user"
                value={formData.assignedUserId}
                onChange={handleUserChange}
                disabled={!formData.companyId}
                className="bg-transparent border border-white text-white px-4 py-2 w-full
                          focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-md"
                style={{ width: "100%" }}
                dropdownStyle={{ backgroundColor: "white", color: "white" }}
                optionLabelProp="label"
                suffixIcon={
                  <DownOutlined
                    style={{
                      color: "#D4D8DA",
                      fontSize: "1.2rem",
                      padding: "15px 10px 10px 10px",
                    }}
                  />
                }
              >
                {users.map((user) => (
                  <Select.Option
                    key={user.id}
                    value={user.id}
                    label={user.fullName}
                  >
                    {user.fullName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item className="flex justify-end">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="bg-transparent border border-white text-white px-6 py-2 
                         hover:bg-white hover:text-[#091416] transition-colors duration-300
                         rounded-md min-w-[100px]"
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;
