import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import StatCard from "./StatCard";

const CommunityStats = ({userId}) => {
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(`/${userId}/stats`);
        const { cardStats } = response.data;

        const transformedStats = [
          {
            title: "Total Cards",
            value: `${cardStats.totalCardsAssigned}`,
            icon: "https://cdn.builder.io/api/v1/image/assets/c05d74a19b6141a5b508f3a8e82dbb0e/8ce4b0a91dad411a00e98853226de7e2fc7bcadbdc3bc5d14252ac3b3bae39cd?apiKey=c05d74a19b6141a5b508f3a8e82dbb0e&",
            percentage: "10%",
            trend: "up",
            trendIcon:
              "https://cdn.builder.io/api/v1/image/assets/c05d74a19b6141a5b508f3a8e82dbb0e/961754b51ba1e3a72b61f1bba81972767698d2f2812f3a7161e5e215f68d8081?apiKey=c05d74a19b6141a5b508f3a8e82dbb0e&",
            isGradient: true,
          },
          {
            title: "Available Cards",
            value: `${cardStats.totalCardsAssigned-cardStats.activeCards}`,
            icon: "https://cdn.builder.io/api/v1/image/assets/c05d74a19b6141a5b508f3a8e82dbb0e/bea14243736ecbc9f6fcefbb2a2b1abbfae109bbc2fc543b195052e7c82bef66?apiKey=c05d74a19b6141a5b508f3a8e82dbb0e&",
            percentage: "10%",
            trend: "up",
            trendIcon: "https://cdn.builder.io/api/v1/image/assets/c05d74a19b6141a5b508f3a8e82dbb0e/961754b51ba1e3a72b61f1bba81972767698d2f2812f3a7161e5e215f68d8081?apiKey=c05d74a19b6141a5b508f3a8e82dbb0e&",
            isGradient: false,
          },
          {
            title: "Active Cards",
            value: `${cardStats.activeCards}`,
            icon: "https://cdn.builder.io/api/v1/image/assets/c05d74a19b6141a5b508f3a8e82dbb0e/0d9f674afc2a31e1449a39a470e35d19ed55c18d154131cb201d8f5f38fa1811?apiKey=c05d74a19b6141a5b508f3a8e82dbb0e&",
            percentage: "10%",
            trend: "up",
            trendIcon: "https://cdn.builder.io/api/v1/image/assets/c05d74a19b6141a5b508f3a8e82dbb0e/224e664a0732b47f648558a071de530bfc81849a34443a4b85b54dada043e1b3?apiKey=c05d74a19b6141a5b508f3a8e82dbb0e&",
            isGradient: false,
          }
        ];

        setStatsData(transformedStats);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  if (loading) {
    return <div className="flex justify-center items-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-wrap gap-6 items-start">
      {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default CommunityStats;
