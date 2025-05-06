import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "@mui/material";
import Api from "../api";
import { format } from 'date-fns'

export const UserDetailsDashboardComponent=()=>{

    const [data, setData] = useState([]);
    const [totalElement, setTotalElement] = useState(0);
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);


  const fetchUserDataForDashboard = async () => {
    try {
      const response = await Api.get("/page/getUsersForDashboard", {
        params: {
          page: page - 1,
          size: 5,
        }
      })
      const { content, totalPages } = response.data;
      setTotalElement(totalPages);
      setData(content);
    } catch (error) {
      console.error("Failed to fetch user data for dashboard".error)
    }

  }  

  useEffect(() => {
    setPageSize(5);
    fetchUserDataForDashboard();
  }, [page, pageSize]);


  const handlePageChange = (event, value) => {
    setPage(value);
  };


       return ( <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">User Details</h2>
            <button
              onClick={() => navigate("/user/details")}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SR NO
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User card Id
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>

                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((data, index) => (

                  <tr key={data.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{data.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap"> 
                      {data.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {data.userQCardId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{data.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{data.phone + " "}</td>

                    <td className="px-6 py-4 whitespace-nowrap">{format(new Date(data.dateTime), 'MMMM dd, yyyy HH:mm:ss')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              <Pagination
                count={totalElement}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </div>
          </div>
        </div>
)}