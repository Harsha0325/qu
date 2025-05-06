import * as React from "react";
import Header from "./Header";
import Table from "./Table";
import { useState } from "react";
import { useEffect } from "react";
import VisitorsManagement from "./VisitorsManagement";
import Api from "../../api";
import { message, Modal } from "antd";
import useCompanyId from "../useCompanyId";
import Loading from "../../../FixedComponents/Loading";

function VisitorsTable() {
  const [table, setTable] = useState(true);
  const [visitorDatapp, setVisitorDatapp] = useState([]);
  const [visitorData, setVisitorData] = useState([]);
  const { companyId, loading } = useCompanyId();

  const fetchVisitorData = async () => {
    try {
      const response = await Api.get(`/checked-in/${companyId}`);
      const transformedData = response.data.map((visitor) => ({
        id: visitor.id.toString(),
        name: visitor.visitorName,
        email: visitor.email,
        purpose: visitor.purposeOfVisit,
        mobile: visitor.mobileNo,
        checkIn: new Date(visitor.checkInTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
      setVisitorDatapp(transformedData);
    } catch (error) {
      console.error("Error fetching visitor data:", error);
      setVisitorDatapp([]); // Set empty array on error
    }
  };

  const fetchVisitorHistoryByDate = async () => {
    try {
      const response = await Api.get(`/visitor-history/${companyId}`);
      const transformedData = response.data.map((visitor) => ({
        id: visitor.id.toString(),
        name: visitor.visitorName,
        email: visitor.email,
        purpose: visitor.purposeOfVisit,
        mobile: visitor.mobileNo,
        checkIn: new Date(visitor.checkInTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        checkOut: visitor.checkOutTime
          ? new Date(visitor.checkOutTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-",
      }));
      setVisitorData(transformedData);
    } catch (err) {
      console.error("Error fetching visitor history:", err);
      setVisitorData([]); // Set empty array on error
    }
  };

  useEffect(() => {
    // Only fetch data when companyId is available and loading is false
    if (!loading && companyId) {
      fetchVisitorData();
      fetchVisitorHistoryByDate();
    }
  }, [companyId, loading]);
  
  const handleCheckout = async (id) => {
    Modal.confirm({
      title: "Confirm Checked out",
      content: "Are you sure you want to check out the visitor.",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          const response = await Api.put(`/check-out/${id}`);
          
          if (response.status === 200) {
            message.success("Visitor checked out successfully!"); 
            fetchVisitorData();
            fetchVisitorHistoryByDate();
          }
        } catch (err) {
          console.error(`Error checking out visitor with ID ${id}:`, err);
        }
      },
    }); 
  };


    if (loading) {
      return (
        <div>
          <Loading />
        </div>
      );
    }
  return (
    <div className="flex flex-col ml-[250px] px-4 py-6 h-screen">
      <Header table={table} setTable={setTable} />
      {table ? (
        <div>
          <Table
            visitorData={visitorData}
            visitorDatapp={visitorDatapp}
            handleCheckout={handleCheckout}
          />
        </div>
      ) : (
        <VisitorsManagement />
      )}
    </div>
  );
}

export default VisitorsTable;
