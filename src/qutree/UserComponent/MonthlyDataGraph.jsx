import React, { useContext, useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Api from "../api";
import { message, Modal, Select } from "antd";
import { RolesContext } from "../../context/RoleContext";
const { Option } = Select;

const MonthlyDataGraph = () => {
  const [graphData, setGraphData] = useState([]);
  const date = new Date();
  const [selectYear, setSelectYear] = useState(date.getUTCFullYear());
 const { userId } = useContext(RolesContext);
  const fetchGraphData = async () => {
    try {
      const response = await Api.get("/card-reach-count", {
        params: { userId: userId, year: selectYear },
      });

      // Transform the data for the graph
      const transformedData = response.data.map((item) => ({
        name: item.month,
        CardReach: item.count,
      }));

      setGraphData(transformedData);
    } catch (err) {
      console.error("Error fetching graph data:", err);

      if (err.response?.status === 404) {
        message.destroy();
        Modal.confirm({
          content: `No card reach were found for ${selectYear}. Display previous year's data?`,
          okText: "Yes",
          cancelText: "No",
          onOk: () => setSelectYear(selectYear - 1),
          onCancel: () => {
            message.destroy();
            message.info("Year selection remains unchanged.");
          },
        });
      }
    }
  };

  useEffect(() => {
    fetchGraphData();
  }, [selectYear]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2024 + 1 }, (_, i) => 2024 + i);

  return (
    <div className="flex flex-col items-center w-full border border-[#ccc] p-4 rounded-lg font-inter">
      <div className="mb-2 w-[100%] flex justify-between">
        <p className="font-bold">Total Card Reach</p>

        <Select
          id="yearSelector"
          className="w-[120px]"
          value={selectYear}
          onChange={(value) => setSelectYear(value)}
        >
          {years.map((year) => (
            <Option key={year} value={year}>
              {year}
            </Option>
          ))}
        </Select>
      </div>

      <div className="w-full h-[410px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={graphData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} interval={0} tick={{ fill: "#999" }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="CardReach"
              stroke="#066882"
              fill="#D9F7FF"
              fillOpacity={1}
            />
          </AreaChart>   
        </ResponsiveContainer>    
      </div>
    </div>
  );
};

export default MonthlyDataGraph;
