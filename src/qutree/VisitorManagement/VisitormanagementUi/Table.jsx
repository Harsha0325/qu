import React, { useMemo, useState } from "react";
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
import VisitorDashboard from "../VisitorDashboard";
import CreateVisitingPurpose from "../CreateVisitingPurpose";
import { Paper } from "@mui/material";
import AppointmentTable from "./AppointmentsTable";
import EmployeeTable from "./EmployeeTable";

const VisitorTable = ({
  visitorData = [],
  visitorDatapp = [],
  handleCheckout,
}) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [overviewSorting, setOverviewSorting] = useState([]);
  const [configurationSorting, setConfigurationSorting] = useState([]);;
 
  const [overviewPagination, setOverviewPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [configurationPagination, setConfigurationPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
   
  const columnHelper = createColumnHelper();

  const activeVisitorsColumns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "Visitor ID",
        cell: (info) => info.getValue(),
        size: 100,
      }),
      columnHelper.accessor("name", {
        header: "Visitor Name",
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
      columnHelper.accessor((row) => ({ checkIn: row.checkIn }), {
        id: "checkIn",
        header: "Check In",
        cell: (info) => {
          const { checkIn } = info.getValue();
          return (
            <div className="flex justify-center items-center gap-1">
              <div className="flex items-center gap-1 border-emerald-200 bg-emerald-50 py-0.5 pr-2 pl-1.5 border border-solid rounded-2xl font-medium text-center text-emerald-700 text-xs mix-blend-multiply">
                <span className="bg-emerald-500 rounded-full w-2 h-2"></span>
                <div>{checkIn}</div>
              </div>
            </div>
          );
        },
        size: 180,
      }),
      columnHelper.accessor((row) => ({ id: row.id }), {
        id: "checkOut",
        header: "Check Out",
        cell: (info) => {
          const { id } = info.getValue();
          return (
            <button
              className="bg-[#035E7B] p-2 rounded-md w-[100px] text-white"
              onClick={() => handleCheckout(id)}
            >
              Check-out
            </button>
          );
        },
        size: 180,
      }),
    ],
    [handleCheckout]
  );

  const visitorsAppointmentColumns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "Visitors ID",
        cell: (info) => info.getValue(),
        size: 100,
      }),
      columnHelper.accessor("name", {
        header: "Visitor Name",
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
      columnHelper.accessor(
        (row) => ({ checkIn: row.checkIn, checkOut: row.checkOut }),
        {
          id: "checkInOut",
          header: "Check In/Check Out",
          cell: (info) => {
            const { checkIn, checkOut } = info.getValue();
            return (
              <div className="flex items-center justify-center gap-6">
                {/* Check-In */}
                <div className="relative flex items-center gap-3 px-2 py-1 bg-gradient-to-r from-green-100 to-green-200 border border-green-300 text-green-800 text-sm font-semibold rounded-[45px] shadow-md transition-all hover:scale-105">
                  <span className="font-bold text-base">{checkIn}</span>
                </div>

                {/* Check-Out */}
                <div className="relative flex items-center gap-3 px-2 py-1 bg-gradient-to-r from-red-100 to-red-200 border border-red-300 text-red-800 text-sm font-semibold rounded-[45px] shadow-md transition-all hover:scale-105">
                  <span className="font-bold text-base">{checkOut}</span>
                </div>
              </div>
            );
          },
          size: 240,
        }
      ),
    ],
    []
  );

  const table1 = useReactTable({
    data: visitorDatapp || [],
    columns: activeVisitorsColumns,
    state: {
      sorting: overviewSorting,
      pagination: overviewPagination,
    },
    onSortingChange: setOverviewSorting,
    onPaginationChange: setOverviewPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const table3 = useReactTable({
    data: visitorData || [],
    columns: visitorsAppointmentColumns,
    state: {
      sorting: configurationSorting,
      pagination: configurationPagination,
    },
    onSortingChange: setConfigurationSorting,
    onPaginationChange: setConfigurationPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const tabs = [
    { key: "dashboard", label: "Dashboard" },
    { key: "overview", label: "Active Visitors" },
    { key: "visitorLog", label: "Visitor Log" },
    { key: "appointments", label: "Appointments" },
    { key: "visitingPurposes", label: "Visiting Purposes" },
    { key: "employee", label: "Employee" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <VisitorDashboard
            visitorData={visitorData}
            currenttab={activeTab}
            setActiveTab={setActiveTab}
          />
        );
      case "overview":
        return (
          <Paper className="shadow-md m-4 p-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-gray-200 bg-red border-b">
                  {table1.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-6 py-3 font-medium text-center text-gray-500 text-xs uppercase tracking-wider"
                          style={{ width: header.getSize() }}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {header.column.getIsSorted() && (
                            <span>
                              {header.column.getIsSorted() === "asc"
                                ? " ▲"
                                : " ▼"}
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table1.getRowModel().rows.map((row) => (
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
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Paper>
        );
      case "appointments":
        return (
          <AppointmentTable/>
        );
      case "visitorLog":
        return (
          <Paper className="shadow-md m-4 p-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-gray-200 bg-gray-50 border-b">
                  {table3.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-6 py-3 font-medium text-center text-gray-500 text-xs uppercase tracking-wider"
                          style={{ width: header.getSize() }}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {header.column.getIsSorted() && (
                            <span>
                              {header.column.getIsSorted() === "asc"
                                ? " ▲"
                                : " ▼"}
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table3.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={table3.getAllColumns().length}
                        className="px-6 py-4 text-center text-gray-500 text-sm"
                      >
                        No visitor log data available
                      </td>
                    </tr>
                  ) : (
                    table3.getRowModel().rows.map((row) => (
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
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Paper>
        );
      case "visitingPurposes":
        return (
          <Paper className="shadow-md m-4 p-4">
            <CreateVisitingPurpose />
          </Paper>
        );
        case "employee":
        return (
          <Paper className="shadow-md m-4 p-4">
            <EmployeeTable />
          </Paper>
        );
      default:
        return null;
    }
  };

  const renderPaginationControls = () => {
    let currentTable, currentData;

    switch (activeTab) {
      case "overview":
        currentTable = table1;
        currentData = visitorDatapp || [];
        break;
      case "visitorLog":
        currentTable = table3;
        currentData = visitorData || [];
        break;
      default:
        currentTable = table1;
        currentData = visitorDatapp || [];
    }

    const pagination = currentTable.getState().pagination;

    return (
      <div className="flex justify-between items-center border-gray-200 bg-white px-4 sm:px-6 py-3 border-t">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => currentTable.previousPage()}
            disabled={!currentTable.getCanPreviousPage()}
            className="inline-flex relative items-center border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 border rounded-md font-medium text-gray-700 text-sm"
          >
            Previous
          </button>
          <button
            onClick={() => currentTable.nextPage()}
            disabled={!currentTable.getCanNextPage()}
            className="inline-flex relative items-center border-gray-300 bg-white hover:bg-gray-50 ml-3 px-4 py-2 border rounded-md font-medium text-gray-700 text-sm"
          >
            Next
          </button>
        </div>
        <div className="sm:flex sm:flex-1 sm:justify-between sm:items-center hidden">
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
                  currentData.length
                )}
              </span>{" "}
              of <span className="font-medium">{currentData.length}</span>{" "}
              results
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => currentTable.setPageIndex(0)}
              disabled={!currentTable.getCanPreviousPage()}
              className="disabled:opacity-50 p-2"
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => currentTable.previousPage()}
              disabled={!currentTable.getCanPreviousPage()}
              className="disabled:opacity-50 p-2"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm">
              Page{" "}
              <strong>
                {currentTable.getState().pagination.pageIndex + 1} of{" "}
                {currentTable.getPageCount()}
              </strong>
            </span>
            <button
              onClick={() => currentTable.nextPage()}
              disabled={!currentTable.getCanNextPage()}
              className="disabled:opacity-50 p-2"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                currentTable.setPageIndex(currentTable.getPageCount() - 1)
              }
              disabled={!currentTable.getCanNextPage()}
              className="disabled:opacity-50 p-2"
            >
              <ChevronsRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center px-6 py-4 w-full">
        <div className="flex items-center gap-4 font-bold">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 px-1 ${
                activeTab === tab.key
                  ? "text-sky-800 border-b-2 border-sky-800"
                  : "text-gray-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-gray-200 shadow-sm border rounded-xl">
        {renderTabContent()}
        {activeTab !== "dashboard" &&
          activeTab !== "visitingPurposes" &&
          activeTab !== "appointments" &&
          renderPaginationControls()}
      </div>
    </div>
  );
};

export default VisitorTable;
