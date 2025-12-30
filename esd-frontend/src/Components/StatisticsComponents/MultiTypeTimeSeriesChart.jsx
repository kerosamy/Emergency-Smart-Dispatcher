import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReportService from '../../services/ReportService';

const MultiTypeTimeSeriesChart = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  const fetchData = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    try {
      const result = await ReportService.getTimeSeriesByType(startDate, endDate);
      
      const grouped = result.reduce((acc, point) => {
        const date = new Date(point.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        if (!acc[date]) {
          acc[date] = { date };
        }
        acc[date][point.type] = point.avgResponseTime ? point.avgResponseTime / 60 : 0;
        return acc;
      }, {});
      
      setData(Object.values(grouped));
    } catch (err) {
      console.error("Error fetching multi-type time series:", err);
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
        Select a date range to compare emergency types
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="date" stroke="#fff" style={{ fontSize: "12px" }} />
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
            border: "1px solid #ef4444",
            borderRadius: "8px",
          }}
        />
        <Legend wrapperStyle={{ color: "#fff" }} />
        <Line
          type="monotone"
          dataKey="MEDICAL"
          stroke="#10b981"
          strokeWidth={2}
          name="Medical"
          dot={{ fill: "#10b981" }}
        />
        <Line
          type="monotone"
          dataKey="FIRE"
          stroke="#f59e0b"
          strokeWidth={2}
          name="Fire"
          dot={{ fill: "#f59e0b" }}
        />
        <Line
          type="monotone"
          dataKey="CRIME"
          stroke="#3b82f6"
          strokeWidth={2}
          name="Crime"
          dot={{ fill: "#3b82f6" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MultiTypeTimeSeriesChart;