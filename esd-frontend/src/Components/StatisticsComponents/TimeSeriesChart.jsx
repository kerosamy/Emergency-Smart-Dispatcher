import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReportService from '../../services/ReportService';

const TimeSeriesChart = ({ type = null, startDate = null, endDate = null }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (startDate && endDate) {
      fetchTimeSeriesData();
    }
  }, [type, startDate, endDate]);

  const fetchTimeSeriesData = async () => {
    if (!startDate || !endDate) return;

    try {
      setLoading(true);
      setError(null);
      
      const result = await ReportService.getTimeSeriesDaily(
        type || undefined,
        startDate,
        endDate
      );
      
      const chartData = result.map(point => ({
        date: new Date(point.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        avgResponseTime: point.avgResponseTime ? point.avgResponseTime / 60 : 0,
        incidentCount: point.incidentCount
      }));
      
      setData(chartData);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching time series:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-white/60 py-8">Loading chart...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400 py-8">Error: {error}</div>;
  }

  if (data.length === 0) {
    return (
      <div className="text-center text-white/60 py-8">
        Select a date range to view trends
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
          labelStyle={{ color: "#fff" }}
        />
        <Legend wrapperStyle={{ color: "#fff" }} />
        <Line
          type="monotone"
          dataKey="avgResponseTime"
          stroke="#3b82f6"
          strokeWidth={2}
          name="Avg Response Time (min)"
          dot={{ fill: "#3b82f6", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TimeSeriesChart;