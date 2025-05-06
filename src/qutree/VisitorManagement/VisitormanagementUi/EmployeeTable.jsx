  import React, { useState, useMemo, useEffect } from "react"; 
  import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    createColumnHelper,
  } from "@tanstack/react-table";
  import { Button, Modal, TextField } from "@mui/material";
  import Api from "../../api";
  import useCompanyId from "../useCompanyId";
  import { RiDeleteBin5Line } from "react-icons/ri";
  import Loading from "../../../FixedComponents/Loading";
  import { message } from "antd";

  const EmployeeTable = () => {
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [employeeData, setEmployeeData] = useState([]);
    const { companyId, loading, userId } = useCompanyId();
    const columnHelper = createColumnHelper();

    // Modal States
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [userToRemove, setUserToRemove] = useState(null); // For storing the user to be removed
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleConfirmOpen = (userId) => {
      setUserToRemove(userId);
      setConfirmOpen(true);
    };
    const handleConfirmClose = () => {
      setUserToRemove(null);
      setConfirmOpen(false);
    };

    const fetchAllEmployees = async () => {
      try {
        const response = await Api.get(`appointment/${companyId}/users/${userId}`);
        setEmployeeData(response.data);
      } catch (err) {
        console.error("Error fetching employee data:", err);
      }
    };

    useEffect(() => {
      if (!loading && companyId && userId) {
        fetchAllEmployees();
      }
    }, [companyId]);

    const handleAddEmployee = async () => {
      if (!email) return;
      try {
        const response = await Api.post(`/${companyId}/add-user/${email}`);
        
        if (response.status === 200) {
          message.success("Employee added successfully!"); 
          fetchAllEmployees();
          setEmail("");
          handleClose();
        }
      } catch (err) {
        if (err.response) {
          const { status, data } = err.response;
          
          if (status === 404) {
            message.error(data.message || "User not found.");
          } else if (status === 500) {
            message.error(data.message || "User is already assigned to another company");
          } else {
            message.error("An unexpected error occurred.");
          }
        } else {
          console.error("Error adding employee:", err);
          message.error("Failed to add employee. Please try again later.");
        }
      }
    };
    

    // New method to handle removing employee
    const handleRemoveEmployee = async () => {
      if (!userToRemove) return;
      try {
        await Api.post(`/${companyId}/remove-user/${userToRemove}`);
        message.success("Employee removed successfully!"); 
        fetchAllEmployees();
        setConfirmOpen(false); // Close the confirmation modal
        setUserToRemove(null); // Clear the user to be removed
      } catch (err) {
        console.error("Error removing employee:", err);
      }
    };

    const columns = useMemo(
      () => [
        columnHelper.accessor("id", {
          header: "User ID",
          cell: (info) => info.getValue(),
          size: 100,
        }),
        columnHelper.accessor("fullName", {
          header: "Full Name",
          cell: (info) => info.getValue(),
          size: 200,
        }),
        columnHelper.accessor("userName", {
          header: "Username",
          cell: (info) => info.getValue(),
          size: 250,
        }),
        // Action column
        columnHelper.accessor("action", {
          header: "Action",
          cell: (info) => (
            <Button 
              color="secondary"
              onClick={() => handleConfirmOpen(info.row.original.id)} // Pass user ID to the modal
              startIcon={<RiDeleteBin5Line className="text-[#aca8a8]"/>}
            >
            </Button>
          ),
          size: 150,
        }),
      ],
      []
    );
    

    const table = useReactTable({
      data: employeeData,
      columns,
      state: { sorting, pagination },
      onSortingChange: setSorting,
      onPaginationChange: setPagination,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
    });

    if (loading) {
        return (
          <div>
            <Loading />
          </div>
        );
      }
    return (
      <div className="flex flex-col w-full">
        <div className="p-4">
          <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Employees</h2>
            <Button 
              variant="contained" color="primary"
              onClick={handleOpen}
              sx={{
                backgroundColor: "#035E7B", 
                "&:hover": {
                  backgroundColor: "#035E7B",
                },
              }}>
              Add Employee
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-gray-200 bg-gray-50 border-b">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 font-medium text-start text-gray-500 text-xs uppercase tracking-wider"
                        style={{ width: header.getSize() }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() && (
                          <span>{header.column.getIsSorted() === "asc" ? " ▲" : " ▼"}</span>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-gray-200 hover:bg-gray-50 border-b">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 text-start text-gray-500 text-sm"
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
        </div>

        {/* Add Employee Modal */}
        <Modal open={open} onClose={handleClose}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add Employee</h3>
            <TextField
              label="Email ID *"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="mt-4 flex justify-end space-x-2">
              <Button onClick={handleClose} variant="outlined">Cancel</Button>
              <Button 
                onClick={handleAddEmployee}
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: "#035E7B", 
                  "&:hover": {
                    backgroundColor: "#035E7B",
                  },
                }}>
                Add
              </Button>
            </div>
          </div>
        </Modal>

        {/* Confirmation Modal for Removing Employee */}
        <Modal open={confirmOpen} onClose={handleConfirmClose}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
            <p>Are you sure you want to remove this employee from the company?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <Button onClick={handleConfirmClose} variant="outlined">Cancel</Button>
              <Button 
                onClick={handleRemoveEmployee}
                variant="contained"
                color="secondary"
                sx={{
                  backgroundColor: "#D32F2F", 
                  "&:hover": {
                    backgroundColor: "#D32F2F",
                  },
                }}>
                Remove
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  };

  export default EmployeeTable;
