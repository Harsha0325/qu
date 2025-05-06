import React, { useEffect, useState } from "react";
import { Table, Modal, Alert, Tag, message } from "antd";
import api from "../api";
import { FaCheck } from "react-icons/fa";
const ContactUs = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Detect if it's mobile view
  
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768); // Update isMobile state based on window size
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

  const [selectedDetails, setSelectedDetails] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      const response = await api.get("contact-us");
      setData(response.data);
    } catch (error) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenMessage = (details) => {
    setSelectedDetails({
      fullName: details.fullName,
      email: details.email,
      message: details.message,
    });
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedDetails({
      fullName: "",
      lastName: "",
      email: "",
      message: "",
    });
  };

  // Ant Design Table Columns
  const columns = [
    {
      title: "SR.NO",
      dataIndex: "id",
      key: "id",
      width: 10,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "firstName",
    },
    {
      title: "Submitted on",
      dataIndex: "submittedOn",
      key: "submittedOn",
      render: (date) => {
        if (!date) return "N/A";
        const formattedDate = new Date(date).toLocaleDateString();
        const formattedTime = new Date(date).toLocaleTimeString();

        return (
          <div className="flex flex-col">
            <span className="font-medium">{formattedDate}</span>
            <span className="text-gray-500 text-sm">{formattedTime}</span>
          </div>
        );
      },
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          {/* Resolve Button */}
          <Tag
            onClick={() => handleResolve(record.id, record.status)}
            className={`cursor-pointer px-3 py-1 flex items-center gap-1 rounded-lg w-[90px] ${
              record.status
                ? "bg-[#aaefc6] text-[#067647] border border-[#067647]"
                : "bg-[transparent] text-black border-2 border-gray"
            }`}
          >
            {record.status === true ? (
              <>
                <FaCheck className="text-[#067647]" /> Resolved
              </>
            ) : (
              "Mark Resolve"
            )}
          </Tag>

          <button
            onClick={() => handleOpenMessage(record)}
            className="bg-white text-black px-3 py-1 rounded-lg border-2 border-gray"
          >
            View Message
          </button>

          {/* Delete Button */}
          <button
            onClick={() => handleDelete(record.id)}
            className="bg-white text-black px-3 py-1 rounded-lg border-2 border-gray"
          >
            Delete
          </button>
        </div>
      ),
      width: "400px",
    },
  ];

  const handleResolve = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    const action = newStatus ? "Resolved" : "Unresolved";

    if (!newStatus) {
      Modal.confirm({
        title: "Are you sure?",
        content: "Do you really want to mark this as UnResolved?",
        okText: "Yes",
        cancelText: "No",
        onOk: async () => {
          await updateStatus(id, newStatus, action);
        },
      });
    } else {
      await updateStatus(id, newStatus, action);
    }
  };

  const updateStatus = async (id, newStatus, action) => {
    try {
      await api.put(`/contact-us/resolve/${id}`, { status: newStatus });
      setData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
      message.destroy();
      message.success(`Marked as ${action}`);
    } catch (error) {
      message.destroy();
      message.error(`Failed to mark as ${action}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`contact-us/${id}`);
      setData((prevData) => prevData.filter((item) => item.id !== id));
      message.destroy();
      message.success("Delted");
    } catch (error) {
      message.destroy();
      message.warning("Failed to delete the message");
    }
  };

  return (
    <div style={{marginTop : "20px" ,marginLeft : isMobile ? "0px" : "250px", height: "100%" }}>
      <div className="">
        {loading && (
          <div className="text-center">
           Loadnig...
          </div>
        )}

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        {!loading && !error && (
          <Table
            dataSource={data}
            columns={columns}
            rowKey="id"
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
            }}
          />
        )}

        <Modal
          title="Message Details"
          open={isModalVisible}
          onCancel={handleCloseModal}
          footer={null}
        >
          {Object.entries(selectedDetails).map(([key, value]) => (
            <div key={key} className="flex space-x-4 my-2">
              <p className="text-[gray] font-bold capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </p>
              <p>{value || "N/A"}</p>
            </div>
          ))}
        </Modal>
      </div>
    </div>
  );
};

export default ContactUs;
