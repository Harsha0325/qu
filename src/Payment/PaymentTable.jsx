import React, { useEffect, useState } from "react";
import api from "./APIs/PaymentApi";
import { Button, message, Modal, Table, Tag } from "antd";
import NoData from "../FixedComponents/NoData";

const PaymentTable = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [noData, setNoData] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Detect if it's mobile view

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Update isMobile state based on window size
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const columns = [
    {
      title: "Sl.no",
      key: "sl_no",
      render: (text, record, index) => index + 1,
    },
    { title: "Order ID", dataIndex: "order_id", key: "order_id" },
    { title: "Origin", dataIndex: "payment_origin", key: "payment_origin" },
    { title: "Tracking ID", dataIndex: "tracking_id", key: "tracking_id" },
    { title: "Bank Ref No", dataIndex: "bank_ref_no", key: "bank_ref_no" },
    {
      title: "Order Status",
      dataIndex: "order_status",
      key: "order_status",
      render: (order_status) => (
        <Tag color={getStatusColor(order_status)}>{order_status}</Tag>
      ),
    },
    { title: "Payment Mode", dataIndex: "payment_mode", key: "payment_mode" },
    { title: "Card Name", dataIndex: "card_name", key: "card_name" },
    { title: "Currency", dataIndex: "currency", key: "currency" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Vault", dataIndex: "vault", key: "vault" },
    {
      title: "Discount Value",
      dataIndex: "discount_value",
      key: "discount_value",
    },
    { title: "Merchant Amount", dataIndex: "mer_amount", key: "mer_amount" },
    { title: "Retry", dataIndex: "retry", key: "retry" },
    {
      title: "Transaction Date",
      dataIndex: "trans_date",
      key: "trans_date",
      render: (date) =>
        new Date(date).toLocaleString() !== `Invalid Date`
          ? new Date(date).toLocaleString()
          : date,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="flex gap-2">
          <Button type="primary"
           onClick={() => showModal(record)}
           className="flex gap-2 text-white bg-gradient-to-r from-blue-400 to-purple-600 hover:from-blue-500 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            View Details
          </Button>
        </div>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  useEffect(() => {
    getTransactions(page, limit);
  }, [page, limit, noData]);

  const getTransactions = async (page, limit) => {
    try {
      const response = await api.get(`/quikynetpayments`, {
        params: {
          payment_origin: "https://quikynet.com",
          page: page,
          limit: limit,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `qwertyasdquikynetcollabe2ezxcvbnm`,
        },
      });

      if (response.data.totalTransactions === 0) {
        setNoData(true);
      }

      setData(response.data.transactions);
      setTotal(response.data.totalTransactions);
    } catch (error) {
      message.destroy();
      message.warning(
        "Unable to load Transactions at the moment try after some time",
        5
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Success":
        return "green";
      case "Aborted":
        return "red";
      case "Timeout":
        return "orange";
      default:
        return "default";
    }
  };

  const showModal = (record) => {
    setSelectedTransaction(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedTransaction(null);
  };

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);
  };

  if (noData) {
    return (
      <div className="p-4" style={{ marginLeft: isMobile ? "0px" : "240px" }}>
        <Button
          onClick={() => {
            setNoData(!noData);
            getTransactions(page, limit);
          }}
        >
          back
        </Button>
        <NoData message={`No Transactions Available!!`} />
      </div>
    );
  }
  return (
    <div className="p-2" style={{ marginLeft: isMobile ? "0px" : "240px" }}>
     <h1 className="text-xl text-start  text-black bg-clip-text underline mb-2">
      Payment Details
     </h1>
      <h1>
        <b>Number of Transactions: {total}</b>
      </h1>

      <div className="overflow-x-scroll">
        <Table
          rowSelection={rowSelection}
          rowKey="_id"
          columns={columns}
          dataSource={data}
          pagination={{
            current: page,
            pageSize: limit,
            showQuickJumper: true,
            showSizeChanger: true,
            total: total,
          }}
          onChange={handleTableChange}
        />
      </div>
      <Modal
        title="Billing & Delivery Details"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedTransaction && (
          <div className="space-y-2">
            <div className="">
              <b>
                <u>Payment Origin:</u>
              </b>
              <p>{selectedTransaction.payment_origin}</p>
              <b>
                <u>Payment For:</u>
              </b>
              <p>{selectedTransaction.paid_for}</p>
            </div>

            {selectedTransaction.order_status === "Success" && (
              <div className="flex justify-between">
                <div>
                  <b>
                    <u>Billing Details</u>
                  </b>
                  <p>Billing Name: {selectedTransaction.billing_name}</p>
                  <p>Billing Address: {selectedTransaction.billing_address}</p>
                  <p>Billing City: {selectedTransaction.billing_city}</p>
                  <p>Billing State: {selectedTransaction.billing_state}</p>
                  <p>Billing Zip: {selectedTransaction.billing_zip}</p>
                  <p>Billing Country: {selectedTransaction.billing_country}</p>
                  <p>Billing Tel: {selectedTransaction.billing_tel}</p>
                  <p>Billing email: {selectedTransaction.billing_email}</p>
                </div>

                <div>
                  <b>
                    <u>Delivery Details</u>
                  </b>
                  <p>Delivery Name: {selectedTransaction.delivery_name}</p>
                  <p>
                    Delivery Address: {selectedTransaction.delivery_address}
                  </p>
                  <p>Delivery City: {selectedTransaction.delivery_city}</p>
                  <p>Delivery State: {selectedTransaction.delivery_state}</p>
                  <p>Delivery Zip: {selectedTransaction.delivery_zip}</p>
                  <p>
                    Delivery Country: {selectedTransaction.delivery_country}
                  </p>
                  <p>Delivery Tel: {selectedTransaction.delivery_tel}</p>
                </div>
              </div>
            )}

            {selectedTransaction.status_message && (
              <div>
                <b>
                  <u>Status Message</u>
                </b>
                <p>{selectedTransaction.status_message}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PaymentTable;
