import React, { useState, useEffect } from "react";
import { Table, Input, DatePicker, Space, Image, Pagination, Tooltip } from "antd";
import dayjs from "dayjs";  // Import dayjs
import Api from "../api";
import { FaSquareXTwitter } from "react-icons/fa6";
import { AiOutlineLinkedin, AiOutlineGlobal } from 'react-icons/ai';
import ShareModal from "../SharePopup";
import { BsQrCodeScan } from "react-icons/bs";
const { RangePicker } = DatePicker;

const UserDetailsTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Detect if it's mobile view

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [fullName, setFullName] = useState("");
  const [userQCardId, setUserQCardId] = useState("");
  useEffect(() => {
    fetchData();
  }, [page, pageSize, searchText, dateRange]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Update isMobile state based on window size
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Format the dates using dayjs
      const startDate = dateRange[0] ? dayjs(dateRange[0]).format("YYYY-MM-DD") : null;
      const endDate = dateRange[1] ? dayjs(dateRange[1]).format("YYYY-MM-DD") : null;

      const response = await Api.get("/page/getUserDetails", {
        params: {
          page: page - 1, // Backend expects 0-based page index
          size: pageSize,
          searchText,
          startDate, // Pass formatted start date
          endDate,   // Pass formatted end date
        },
      });

      const { content, totalElements } = response.data;
      setData(content);
      setTotal(totalElements);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      const startDate = dates[0].startOf('day');
      const endDate = dates[1].endOf('day');
      setDateRange([startDate, endDate]);
    } else {
      setDateRange([]);
    }
    setPage(1); // Reset to first page on date filter
  };

  const handleShareClick = (userId, fullName) => {
    if (userId) {
      const url = `https://quikynet.com/business-card/${userId}`;
      setShareUrl(url);
      setFullName(fullName);
      setUserQCardId(userId);
      setIsModalOpen(true);
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'User ID',
      dataIndex: 'userQCardId',
      key: 'userQCardId',
    },
    {
      title: 'Phone Numbers',
      dataIndex: 'phone',
      key: 'phone',
      render: (phones) => (
        <ul style={{ paddingLeft: 0, margin: 0 }}>
          {(phones && Array.isArray(phones)) ? phones.map((phone, index) => (
            <li key={index}>{phone}</li>
          )) : <li>No phone numbers available</li>}
        </ul>
      ),
    },
    {
      title: 'WhatsApp',
      dataIndex: 'whatsapp',
      key: 'whatsapp',
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Job Title',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Emails',
      dataIndex: 'email',
      key: 'email',
      render: (emails) => (
        <ul style={{ paddingLeft: 0, margin: 0 }}>
          {(emails && Array.isArray(emails)) ? emails.map((email, index) => (
            <li key={index}>{email}</li>
          )) : <li>No emails available</li>}
        </ul>
      ),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <Image src={image} width={100} />,
    },
    {
      title: 'Company Logo',
      dataIndex: 'companyLogo',
      key: 'companyLogo',
      render: (logo) => logo ? <Image src={logo} width={100} /> : 'N/A',
    },
    {
      title: 'Date & Time',
      dataIndex: 'dateTime',
      key: 'dateTime',
      render: (dateTime) => new Date(dateTime).toLocaleString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          {record.linkedin ? (
            <Tooltip title="LinkedIn Profile">
              <a href={record.linkedin} target="_blank" rel="noopener noreferrer">
                <AiOutlineLinkedin style={{ color: '#0e76a8', fontSize: '18px' }} />
              </a>
            </Tooltip>
          ) : (
            <AiOutlineLinkedin style={{ color: '#ccc', fontSize: '18px' }} />
          )}

          {record.twitter ? (
            <Tooltip title="Twitter Profile">
              <a href={record.twitter} target="_blank" rel="noopener noreferrer">
                <FaSquareXTwitter style={{ color: '#000000', fontSize: '18px' }} />
              </a>
            </Tooltip>
          ) : (
            <FaSquareXTwitter style={{ color: '#ccc', fontSize: '18px' }} />
          )}

          {record.company ? (
            <Tooltip title="Company Website">
              <a href={record.company} target="_blank" rel="noopener noreferrer">
                <AiOutlineGlobal style={{ color: '#000', fontSize: '18px' }} />
              </a>
            </Tooltip>
          ) : (
            <AiOutlineGlobal style={{ color: '#ccc', fontSize: '18px' }} />
          )}
          
        
          <Tooltip title="Download QR Code">
          <BsQrCodeScan
            style={{ color: '#000000', fontSize: '18px' }}
            onClick={() => handleShareClick(record.userQCardId, record.fullName)}
          />
          </Tooltip>

        </div>
      ),
    },
  ];

  return (
    <div style={{ marginLeft: isMobile ? "0px" : "250px", marginTop: "20px" }}>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search"
          value={searchText}
          onChange={handleSearch}
          style={{ width: 200 }}
        />
        <RangePicker onChange={handleDateChange} />
      </Space>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        pagination={false}
        loading={loading}
      />
      <Pagination
        current={page}
        pageSize={pageSize}
        total={total}
        onChange={(page, pageSize) => {
          setPage(page);
          setPageSize(pageSize);
        }}
        style={{ marginTop: 16, textAlign: "center" }}
      />

        {isModalOpen && (
              <ShareModal
                url={shareUrl}
                onClose={handleCloseModal}
                 name={fullName}
                 qCardId={userQCardId}
              />
            )}
    </div>
  );
};

export default UserDetailsTable;
