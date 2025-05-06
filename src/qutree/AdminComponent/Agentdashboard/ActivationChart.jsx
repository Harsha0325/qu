import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../api';

const ActivationChart = ({userId}) => {
  const [data, setData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
       

        const response = await api.get(
          `/user-card-ids/activations/${userId}`
        );

        setData(response.data);
        // Set the first available year as default
        const years = Object.keys(response.data.yearlyStats || {});
        setSelectedYear(years[0]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!data || !data.yearlyStats || Object.keys(data.yearlyStats).length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-lg text-gray-600">No activation data available</div>
      </div>
    );
  }

  const years = Object.keys(data.yearlyStats);

  const transformDataForChart = (year) => {
    const monthlyData = data.yearlyStats[year]?.monthlyActivations || {};
    return Object.entries(monthlyData).map(([month, value]) => ({
      month: month.slice(0, 3), 
      activations: value
    }));
  };

  const chartData = transformDataForChart(selectedYear);

  return (
    <div className="w-full p-6 space-y-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Monthly Card Activations</h2>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {years.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
              formatter={(value) => [`${value} activations`, 'Activations']}
            />
            <Legend />
            <Bar 
              dataKey="activations" 
              fill="#066882" 
              name="Card Activations"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivationChart;