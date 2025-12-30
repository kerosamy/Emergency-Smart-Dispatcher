import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ReportService from '../../services/ReportService';

const HourlyDistributionChart = ({ date, type }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (date) {
      fetchData();
    }
  }, [date, type]);

  const fetchData = async () => {
    if (!date) return;

    setLoading(true);
    try {
      const result = await ReportService.getHourlyDistribution(
        date,
        type || undefined
      );
      
      const chartData = result.map(point => ({
        hour: `${point.date.toString().padStart(2, "0")}:00`,
        avgResponseTime: point.avgResponseTime ? point.avgResponseTime / 60 : 0,
        incidentCount: point.incidentCount
      }));
      
      setData(chartData);
    } catch (err) {
      console.error("Error fetching hourly distribution:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-white/60 py-8">Loading...</div>;
  }

  if (data.length === 0) {
    return (
      <div className="text-center text-white/60 py-8">
        Select a specific date to view hourly distribution
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="hour" stroke="#fff" style={{ fontSize: "12px" }} />
        <YAxis
          stroke="#fff"
          style={{ fontSize: "12px" }}
          label={{
            value: "Avg Response Time (min)",
            angle: -90,
            position: "insideLeft",
            style: { fill: "#fff" },
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #8b5cf6",
            borderRadius: "8px",
          }}
        />
        <Area
          type="monotone"
          dataKey="avgResponseTime"
          stroke="#8b5cf6"
          fill="#8b5cf6"
          fillOpacity={0.6}
          name="Avg Response Time (min)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default HourlyDistributionChart;