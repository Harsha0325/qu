import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Tabs, Tab, Pagination } from "@mui/material";
import {
  ExitToApp,
  ArrowUpward,
  ArrowDownward,
  Person,
} from "@mui/icons-material";
import Api from "../api";
import useCompanyId from "./useCompanyId";

const TIME_RANGES = {
  last24Hours: "last24Hours",
  currentWeek: "currentWeek",
  currentMonth: "currentMonth",
  currentYear: "currentYear",
};

const MetricCard = React.memo(
  ({
    title,
    value,
    trend,
    percentage,
    icon: Icon,
    bgColor = "bg-white",
    textColor = "text-black",
  }) => (
    <div className={`rounded-lg shadow-md ${bgColor} p-4`}>
      <div className="flex justify-between items-center">
        <h3 className={`text-sm font-medium ${textColor}`}>{title}</h3>
        <Icon className={textColor} />
      </div>
      <p className={`text-3xl font-bold my-2 ${textColor}`}>{value}</p>
      {trend && (
        <div className="flex items-center text-sm">
          {trend === "increase" ? (
            <ArrowUpward className="w-4 h-4 text-green-500" />
          ) : (
            <ArrowDownward className="w-4 h-4 text-red-500" />
          )}
          <span
            className={trend === "increase" ? "text-green-500" : "text-red-500"}
          >
            {trend === "increase" ? `${percentage}%` : `${percentage}%`}
          </span>
        </div>
      )}
    </div>
  )
);

const ChartBar = ({ data, maxValue, barWidth, timeRange }) => {
  data.month =
    data.hour?.split(" ")[1] ||
    ((timeRange === "currentMonth" || timeRange === "currentWeek") &&
      data.date.replace(/-/g, "/").split("/")[1] +
        "/" +
        data.date.replace(/-/g, "/").split("/")[2]) ||
    data.monthName;
  data.value = data.visitorCount;
  data.total = data.visitorCount;

  return (
    <div
      className="group relative flex-1 rounded-t-xl max-w-[75px] h-full"
      style={{ width: barWidth }}
    >
      <div
        className="right-0 bottom-0 left-0 absolute bg-cyan-600 rounded-t-xl"
        style={{
          height: `${(data.total === 0 ? 0.01 : data.total / maxValue) * 100}%`,
        }}
      />
      <div
        className="group-hover:bg-cyan-600 rig ht-0 bottom-0 left-0 absolute bg-cyan-500 rounded-t-xl transition-all"
        style={{
          height: `${(data.value === 0 ? 0.01 : data.value / maxValue) * 100}%`,
        }}
      >
        <div className="-top-8 left-1/2 absolute bg-black opacity-0 group-hover:opacity-100 px-2 py-1 rounded text-white text-xs -translate-x-1/2">
          Active: {data.value}
          <br />
          Total: {data.total}
        </div>
      </div>
      <div className="bottom-[-24px] left-1/2 absolute text-center text-xs -translate-x-1/2">
        {data.month}
      </div>
    </div>
  );
};

const VisitorDashboard = ({ visitorData, setActiveTab }) => {
  const [timeRange, setTimeRange] = useState("last24Hours");
  const [metrics, setMetrics] = useState({});
  const [page, setPage] = useState(1);
  const { companyId, loading } = useCompanyId();
  const rowsPerPage = 5;

  const [allChartData, setAllChartData] = useState({
    last24Hours: [],
    currentWeek: [],
    currentMonth: [],
    currentYear: [],
  });
  const [chartData, setChartData] = useState([]);

  const fetchMetrics = async () => {
    try {
      const response = await Api.get(
        `/visitor/count?companyId=${companyId}&date=${
          new Date().toISOString().split("T")[0]
        }`
      );
      const data = await response.data;
      setMetrics(data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  const fetchAllChartData = async () => {
    try {
      const response = await Api.get(`/visitor/stats?companyId=${companyId}`);
      const data = await response.data;
      setAllChartData(data);
      setChartData(data["last24Hours"]);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  // Combined API calls in single useEffect
  useEffect(() => {
    if (!loading && companyId) {
      fetchMetrics();
      fetchAllChartData();
    }
  }, [companyId, loading]); // Removed fetchAllChartData from dependencies since it's defined in scope

  const handleTimeRangeChange = useCallback(
    (event, newValue) => {
      setTimeRange(newValue);
      setChartData(allChartData[newValue]);
    },
    [allChartData]
  );

  const maxValue = useMemo(
    () => Math.max(...(chartData || []).map((data) => data.visitorCount || 0)),
    [chartData]
  );
  const barWidth = useMemo(
    () => Math.min(50, 100 / ((chartData || []).length || 1)) + "%",
    [chartData]
  );

  const totalPages = Math.ceil(visitorData.length / rowsPerPage);
  const paginatedData = visitorData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="gap-6 grid grid-cols-1 md:grid-cols-3 mb-6">
        <MetricCard
          title="Total Visitors"
          value={metrics.totalVisitors || 0}
          trend={
            metrics.totalVisitorsPercentage?.toString().includes("-")
              ? "decrease"
              : "increase"
          }
          percentage={metrics.totalVisitorsPercentage || 0}
          icon={ExitToApp}
          bgColor="bg-cyan-600"
          textColor="text-white"
        />
        <MetricCard
          title="Total Visitors Out"
          value={metrics.checkedOutVisitors || 0}
          trend={
            metrics.checkedOutVisitorsPercentage?.toString().includes("-")
              ? "decrease"
              : "increase"
          }
          percentage={metrics.checkedOutVisitorsPercentage || 0}
          icon={ExitToApp}
        />
        <MetricCard
          title="Current Visitors"
          value={metrics.currentVisitors || 0}
          trend={
            metrics.currentVisitorsPercentage?.toString().includes("-")
              ? "decrease"
              : "increase"
          }
          percentage={metrics.currentVisitorsPercentage || 0}
          icon={Person}
        />
      </div>

      <div className="bg-white shadow-md mb-6 p-6 rounded-lg">
        <h2 className="mb-4 font-semibold text-xl">Visitors Count</h2>
        <div className="mb-4 border-b">
          <Tabs value={timeRange} onChange={handleTimeRangeChange}>
            {Object.entries(TIME_RANGES).map(([value, label]) => (
              <Tab key={value} label={label} value={value} />
            ))}
          </Tabs>
        </div>
        <div className="flex justify-around items-end gap-2 w-full h-[300px]">
          {loading ? (
            <p className="text-center text-gray-500 w-full">
              Loading chart data...
            </p>
          ) : chartData.length > 0 ? (
            chartData.map((data, index) => (
              <ChartBar
                key={index}
                data={data}
                maxValue={maxValue}
                barWidth={barWidth}
                timeRange={timeRange}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 w-full">
              No data available
            </p>
          )}
        </div>
      </div>

      <div className="bg-white shadow-md p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-xl">Visitors Log</h2>
          <button
            onClick={() => setActiveTab("visitorLog")}
            className="border-gray-300 hover:bg-gray-50 px-4 py-2 border rounded-md text-sm"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="divide-y divide-gray-200 min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-500 text-left text-xs uppercase tracking-wider">
                  Visitor Id
                </th>
                <th className="px-6 py-3 font-medium text-gray-500 text-left text-xs uppercase tracking-wider">
                  Visitor Name
                </th>
                <th className="px-6 py-3 font-medium text-gray-500 text-left text-xs uppercase tracking-wider">
                  Visiting Purpose
                </th>
                <th className="px-6 py-3 font-medium text-gray-500 text-left text-xs uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 font-medium text-gray-500 text-left text-xs uppercase tracking-wider">
                  Mobile Number
                </th>
                <th className="px-6 py-3 font-medium text-gray-500 text-left text-xs uppercase tracking-wider">
                  Check In/Check Out
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{log.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.purpose}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.mobile}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-x-2">
                      <span className="inline-flex border-green-500 bg-green-100 px-3 py-1 border rounded-full font-semibold text-green-800 text-xs">
                        {log.checkIn}
                      </span>
                      <span className="inline-flex bg-red-100 px-3 py-1 border border-red-500 rounded-full font-semibold text-red-800 text-xs">
                        {log.checkOut}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorDashboard;
