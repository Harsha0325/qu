import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Tabs, Tab } from "@mui/material";
import { Person } from "@mui/icons-material";
import Api from "../api";
import Loading from "../../FixedComponents/Loading";
import { useNavigate } from "react-router-dom";
import {UserDetailsDashboardComponent} from "./UserDetailsDashbordComponent"
const TIME_RANGES = {
  "12months": "Current Year",
  "30days": "30 days",
  "24hours": "24 hours",
};

const MetricCard = React.memo(
  ({
    title,
    value,
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
    </div>
  )
);

const ChartBar = React.memo(({ data, maxValue, barWidth }) => (
  <div
    className="flex-1 group relative h-full rounded-t-xl max-w-[75px]"
    style={{ width: barWidth }}
  >
    <div
      className="absolute bottom-0 left-0 right-0 bg-cyan-500 rounded-t-xl transition-all group-hover:bg-cyan-600"
      style={{ height: `${(data.value / maxValue) * 100}%` }}
    >
      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-1 py-1 rounded text-xs">
        users : {data.value} in {data.label}
      </div>
      
    </div>
    <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 text-xs text-center">
      {data.label}
    </div>
  </div>
));

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("12months");

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setCurrentYear(new Date().getFullYear());
      // Fetch statistics
      const statsResponse = await Api.get("/total-user-count");
      setStats(statsResponse.data);

      // Fetch all chart data initially
      const [yearResponse, dailyResponse, hoursResponse] = await Promise.all([
        Api.get(`/user/count-by-year?year=${currentYear}`),
        Api.get("/monthly-user-count"),
        Api.get("/hourly-user-count"),
      ]);

      setAllChartData({
        "12months": yearResponse.data.map((item) => ({
          label: item.monthName,
          value: item.userCount,
          total: item.userCount + 1,
        })),
        "30days": dailyResponse.data.map((item) => ({
          label: `${item.day}`,
          value: item.userCount,
          total: item.userCount + 1,
        })),
        "24hours": hoursResponse.data.map((item) => ({
          label: `${item.hour}:00`,
          value: item.userCount,
          total: item.userCount + 1,
        })),
      });

      setChartData(
        yearResponse.data.map((item) => ({
          label: item.monthName,
          value: item.userCount,
          total: item.userCount + 1,
        }))
      );

      setError(null);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const [allChartData, setAllChartData] = useState({
    "12months": [],
    "30days": [],
    "24hours": [],
  });
  const [chartData, setChartData] = useState([]);

  const handleTimeRangeChange = useCallback(
    (event, newValue) => {
      setTimeRange(newValue);
      setChartData(allChartData[newValue]);
    },
    [allChartData]
  );

  const maxValue = useMemo(
    () => Math.max(...chartData.map((data) => data.total || 0)),
    [chartData]
  );
  const barWidth = useMemo(
    () => Math.min(50, 100 / (chartData.length || 1)) + "%",
    [chartData]
  );


  if (loading) {
    return <Loading message="Loading" />;
  }
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div style={{ marginLeft: isMobile ? "0px" : "250px", marginTop: "5px" }}>
     <div className="flex flex-col w-full font-semibold max-md:max-w-full mt-4 mb-4">
        <div className="flex flex-col w-full max-md:pr-0 max-md:max-w-full">
          <div className="flex flex-col w-full max-md:max-w-full">
            <div className="flex gap-4 items-start w-full max-md:max-w-full">
              <div className="flex flex-col flex-1 shrink justify-center w-full basis-0 min-w-[240px] max-md:max-w-full">
                <div className="flex flex-wrap gap-4 md:gap-10 items-center w-full max-w-[screen] max-md:max-w-full justify-between">
                  <div className="self-stretch my-auto text-2xl md:text-3xl leading-none text-gray-900">
                    Dashboard
                  </div>
                  <button
                    className="bg-[#035E7B] p-2 rounded-md text-white w-[120px] text-sm md:text-base"
                    onClick={() => navigate("/register-user")}
                  >
                    Register User
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-0 sm:p-6 bg-gray-50 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <MetricCard
            title="Total Users"
            value={stats?.totalUsers}
            icon={Person}
            bgColor="bg-cyan-600"
            textColor="text-white"
          />
          <MetricCard
            title="Current Year Users"
            value={stats?.currentYearUsers}
            icon={Person}
          />
          <MetricCard
            title="Current Month Users"
            value={stats?.currentMonthUsers}
            icon={Person}
          />
          <MetricCard
            title="Today Users"
            value={stats?.todayUsers}
            icon={Person}
          />
        </div>

        <div className="bg-white rounded-lg shadow-md mb-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Users Count</h2>
          <div className="border-b mb-4">
            <Tabs value={timeRange} onChange={handleTimeRangeChange}>
              {Object.entries(TIME_RANGES).map(([value, label]) => (
                <Tab key={value} label={label} value={value} />
              ))}
            </Tabs>
          </div>

          <div className="h-[300px] w-full flex justify-around items-end gap-2">
            {chartData.map((data, index) => (
              <ChartBar
                key={index}
                data={data}
                maxValue={maxValue}
                barWidth={barWidth}s
              />
            ))}
          </div>
        </div>
         <UserDetailsDashboardComponent />
        
      </div>
    </div>
  );
};

export default Dashboard;
