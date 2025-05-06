import React, { useState, useMemo, useEffect, useContext } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Paper } from "@mui/material";
import classNames from "classnames";
import useCompanyId from "../useCompanyId";
import Api from "../../api";
import { DatePicker, Modal, Select, message } from "antd";
import { format } from "date-fns"; // Add date-fns for date formatting
import { RolesContext } from "../../../context/RoleContext";

const AppointmentTable = () => {
  const [sorting, setSorting] = useState([]);
  const [openRowIndex, setOpenRowIndex] = useState(null);
  const [appointmentData, setAppointmentData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // State for selected date
  const columnHelper = createColumnHelper();
  const { companyId, loading, userId } = useCompanyId();
  const [pagination, setPagination] = useState({
    pageIndex: 0, 
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
  });

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [assignModal, setAssignModal] = useState({ visible: false, appointmentId: null });
  const { roles } = useContext(RolesContext);

  const fetchVisitorAppointment = async (page = pagination.pageIndex, size = pagination.pageSize, date = selectedDate) => {
    try {
       let url = ``;
      if(roles.includes("ADMIN")){
        url = `appointment-assigned/${companyId}/${userId}?page=${page}&size=${size}`;
      }else{
        url = `/get-all-appointments-by-company?companyId=${companyId}&page=${page}&size=${size}`;
      }
    
      if (date) {
        const formattedDate = format(date, "yyyy-MM-dd");
        url += `&date=${formattedDate}`;
      }

      const response = await Api.get(url);

      const { content, totalElements, totalPages, number, size: pageSize } = response.data;

      const transformedData = content.map((visitor) => ({
        id: visitor.id.toString(),
        name: visitor.fullName,
        eta: visitor.appointmentDate,
        email: visitor.email,
        assignedUser: visitor.assignedUser,
        purpose: visitor.purpose,
        mobile: visitor.phoneNumber,
        status: visitor.status,
      }));

      setAppointmentData(transformedData);

      setPagination({
        pageIndex: number,
        pageSize,
        totalPages,
        totalElements,
      });

    } catch (err) {
      console.error("Error fetching visitor history:", err);
    }
  };
  

  useEffect(() => {
    if (!loading && companyId) {
      fetchVisitorAppointment();
    }
  }, [companyId, loading, selectedDate]);

  const handleApproveAppointment = (id) => {
    Modal.confirm({
      title: "Confirm Approval",
      content: "Are you sure you want to approve this appointment?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          const response = await Api.put(
            `/appointment/${id}/accept?companyId=${companyId}`
          );
          if (response.status === 200) {
            fetchVisitorAppointment();
            message.success("Appointment approved successfully!");
          } else {
            message.error("Failed to approve appointment");
          }
        } catch (err) {
          console.error(`Error approving appointment with ID ${id}:`, err);
          message.error("Failed to approve appointment");
        }
      },
    });
  };

  const handleDeclineAppointment = (id) => {
    Modal.confirm({
      title: "Confirm Decline",
      content: "Are you sure you want to decline this appointment?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          const response = await Api.put(
            `/appointment/${id}/reject?companyId=${companyId}`
          );
          if (response.status === 200) {
            fetchVisitorAppointment();
            message.success("Appointment declined successfully!");
          } else {
            message.error("Failed to decline appointment");
          }
        } catch (err) {
          console.error(`Error declining appointment with ID ${id}:`, err);
          message.error("Failed to decline appointment");
        }
      },
    });
  };

  const handleReschedule = async (id) => {
    if (!selectedDate) {
      message.error("Please select a new date for rescheduling");
      return;
    }

    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd'T'HH:mm:ss");
      const response = await Api.put(
        `/appointment/${id}/reschedule`,
        {},
        {
          params: {
            companyId: companyId,
            newDate: formattedDate,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        fetchVisitorAppointment();
        message.success("Appointment rescheduled successfully!");
        setSelectedDate(null); // Reset date after successful reschedule
      } else {
        message.error("Failed to reschedule appointment");
      }
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      message.error("Failed to reschedule appointment");
    } finally {
      setOpenRowIndex(null);
    }
  };

  const handleAssignUser = async () => {
    if (!selectedEmployee) {
      message.error("Please select an employee");
      return;
    }
    try {
      const response = await Api.patch(`/assign/${assignModal.appointmentId}?assignedToUserId=${selectedEmployee}`);
      if (response.status === 200) {
      message.success("Appointment assigned successfully!");
      fetchVisitorAppointment();
      setAssignModal({ visible: false, appointmentId: null });
      setSelectedEmployee(null);
      }
    } catch (err) {
      console.error("Error assigning appointment:", err);
      message.error("Failed to assign appointment");
    }
  };
 const fetchAllEmployees = async () => {
    try {
      const response = await Api.get(`appointment/${companyId}/users/${userId}`);
      setEmployees(response.data);
    } catch (err) {
      console.error("Error fetching employee data:", err);
    }
  };

  useEffect(() => {
    if (!loading && companyId && userId) {
      fetchAllEmployees();
    }
  }, [companyId]);


  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "Visitor ID",
        cell: (info) => info.getValue(),
        size: 100,
      }),
      columnHelper.accessor("eta", {
        header: "ETA",
        cell: (info) => info.getValue(),
        size: 150,
      }),
      columnHelper.accessor("name", {
        header: "Visitor Name",
        cell: (info) => info.getValue(),
        size: 150,
      }),
      columnHelper.accessor("assignedUser", {
        header: "Assigned User",
        cell: (info) => info.getValue(),
        size: 150,
      }),
      columnHelper.accessor("purpose", {
        header: "Visiting Purpose",
        cell: (info) => info.getValue(),
        size: 180,
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => info.getValue(),
        size: 250,
      }),
      columnHelper.accessor("mobile", {
        header: "Mobile Number",
        size: 160,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("actions", {
        header: "Actions",
        cell: (info) => {
          const rowIndex = info.row.index;
          const isModalOpen = openRowIndex === rowIndex;
          const rowData = info.row.original;

          const handleApprove = () => {
            handleApproveAppointment(rowData.id);
          };

          const handleDecline = () => {
            handleDeclineAppointment(rowData.id);
          };

          return (
            <>
              {roles.includes("ADMIN") ? (
                ["ACCEPTED", "REJECTED", "RESCHEDULED"].includes(rowData.status) ? (
                  <div
                    className={classNames(
                      `flex items-center gap-2 justify-center font-bold`,
                      {
                        "text-yellow-600 font-semibold": rowData.status === "PENDING",
                        "text-green-600 font-semibold": rowData.status === "ACCEPTED",
                        "text-blue-500 font-semibold": rowData.status === "RESCHEDULED",
                        "text-red-600 font-semibold": rowData.status === "REJECTED",
                      }
                    )}
                  >
                    {rowData.status === "ACCEPTED"
                      ? "Approved"
                      : rowData.status === "RESCHEDULED"
                      ? "Rescheduled"
                      : "Declined"}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={handleApprove}
                      className="flex items-center gap-1 px-4 py-2 border border-emerald-300 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-[45px] hover:bg-emerald-100 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={handleDecline}
                      className="flex items-center gap-1 px-4 py-2 border border-red-300 bg-red-50 text-red-700 text-sm font-medium rounded-[45px] hover:bg-red-100 transition"
                    >
                      Decline
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setOpenRowIndex(isModalOpen ? null : rowIndex)}
                        className="flex items-center justify-center w-10 h-10 rounded-full text-gray-700 text-lg hover:bg-gray-100 transition"
                      >
                        ⋮
                      </button>
                      {isModalOpen && (
                        <div className="absolute right-0 top-12 z-20 w-64 bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden p-2">
                          <div className="mb-2">
                            <label className="block text-sm text-gray-700 mb-1">
                              Select New Date:
                            </label>
                            <input
                              type="datetime-local"
                              value={
                                selectedDate
                                  ? format(selectedDate, "yyyy-MM-dd'T'HH:mm")
                                  : ""
                              }
                              onChange={(e) => setSelectedDate(new Date(e.target.value))}
                              className="w-full p-2 border rounded"
                            />
                          </div>
                          <button
                            className="flex items-center gap-2 px-4 py-2 w-full text-gray-700 text-sm hover:bg-gray-100 transition"
                            onClick={() => handleReschedule(rowData.id)}
                          >
                            Reschedule
                          </button>
                          <button
                            className="flex items-center gap-2 px-4 py-2 w-full text-gray-700 text-sm hover:bg-gray-100 transition"
                            onClick={() =>
                              setAssignModal({ visible: true, appointmentId: rowData.id })
                            }
                          >
                            Assign User
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              ) : ["ACCEPTED", "REJECTED", "ASSIGNED", "RESCHEDULED"].includes(rowData.status) ? (
                <div
                  className={classNames(
                    `flex items-center gap-2 justify-center font-bold`,
                    {
                      "text-yellow-600 font-semibold": rowData.status === "PENDING",
                      "text-green-600 font-semibold": rowData.status === "ACCEPTED",
                      "text-blue-500 font-semibold": rowData.status === "RESCHEDULED",
                      "text-purple-500 font-semibold": rowData.status === "ASSIGNED",
                      "text-red-600 font-semibold": rowData.status === "REJECTED",
                    }
                  )}
                >
                  {rowData.status === "ACCEPTED"
                    ? "Approved"
                    : rowData.status === "RESCHEDULED"
                    ? "Rescheduled"
                    : rowData.status === "ASSIGNED"
                    ? "Assigned"
                    : "Declined"}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={handleApprove}
                    className="flex items-center gap-1 px-4 py-2 border border-emerald-300 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-[45px] hover:bg-emerald-100 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={handleDecline}
                    className="flex items-center gap-1 px-4 py-2 border border-red-300 bg-red-50 text-red-700 text-sm font-medium rounded-[45px] hover:bg-red-100 transition"
                  >
                    Decline
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setOpenRowIndex(isModalOpen ? null : rowIndex)}
                      className="flex items-center justify-center w-10 h-10 rounded-full text-gray-700 text-lg hover:bg-gray-100 transition"
                    >
                      ⋮
                    </button>
                    {isModalOpen && (
                      <div className="absolute right-0 top-12 z-20 w-64 bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden p-2">
                        <div className="mb-2">
                          <label className="block text-sm text-gray-700 mb-1">
                            Select New Date:
                          </label>
                          <input
                            type="datetime-local"
                            value={
                              selectedDate
                                ? format(selectedDate, "yyyy-MM-dd'T'HH:mm")
                                : ""
                            }
                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <button
                          className="flex items-center gap-2 px-4 py-2 w-full text-gray-700 text-sm hover:bg-gray-100 transition"
                          onClick={() => handleReschedule(rowData.id)}
                        >
                          Reschedule
                        </button>
                        <button
                          className="flex items-center gap-2 px-4 py-2 w-full text-gray-700 text-sm hover:bg-gray-100 transition"
                          onClick={() =>
                            setAssignModal({ visible: true, appointmentId: rowData.id })
                          }
                        >
                          Assign User
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
          
              {/* Modal for Assigning User */}
              <Modal
                title="Assign User"
                open={assignModal.visible}
                onOk={handleAssignUser}
                onCancel={() => setAssignModal({ visible: false, appointmentId: null })}
                styles={{
                  mask: {
                    backdropFilter: "blur(3px)",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select Employee"
                  onChange={setSelectedEmployee}
                >
                  {employees.map((emp) => (
                    <Select.Option key={emp.id} value={emp.id}>
                      {emp.fullName}
                    </Select.Option>
                  ))}
                </Select>
              </Modal>
            </>
          );
          
        },
        size: 180,
      }),
    ],
    [openRowIndex, handleApproveAppointment, handleDeclineAppointment]
  );

  const table = useReactTable({
    data: appointmentData,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const renderPaginationControls = () => (
    <div className="flex justify-between items-center border-gray-200 bg-white px-4 sm:px-6 py-3 border-t">
      <div className="sm:flex sm:flex-1 sm:justify-between sm:items-center">
        <div>
          <p className="text-gray-700 text-sm">
            Showing{" "}
            <span className="font-medium">
              {pagination.pageIndex * pagination.pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(
                (pagination.pageIndex + 1) * pagination.pageSize,
                appointmentData.length
              )}
            </span>{" "}
            of <span className="font-medium">{appointmentData.length}</span>{" "}
            results
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="disabled:opacity-50 p-2"
          >
            <ChevronsLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="disabled:opacity-50 p-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm">
            Page{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="disabled:opacity-50 p-2"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="disabled:opacity-50 p-2"
          >
            <ChevronsRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full">
      <Paper className="shadow-md m-4 p-4">
        <div className="overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Appointments</h2>
          <DatePicker
            onChange={(date) => setSelectedDate(date)}
            format="YYYY-MM-DD"
            placeholder="Select Date"
          />
        </div>

          <table className="w-full">
            <thead className="border-gray-200 bg-gray-50 border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 font-medium text-center text-gray-500 text-xs uppercase tracking-wider"
                      style={{ width: header.getSize() }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() && (
                        <span>
                          {header.column.getIsSorted() === "asc" ? " ▲" : " ▼"}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-gray-200 hover:bg-gray-50 border-b"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 text-center text-gray-500 text-sm"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Paper>
      {renderPaginationControls()}
    </div>
  );
};

export default AppointmentTable;