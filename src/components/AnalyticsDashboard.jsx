// src/components/AnalyticsDashboard.jsx
import { useMemo } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

function AnalyticsDashboard({ todos }) {
  // ✅ Thống kê productivity theo ngày
  const productivityData = useMemo(() => {
    const map = {};
    todos.forEach(t => {
      if (!t.dueDate) return;
      const d = new Date(t.dueDate).toLocaleDateString("vi-VN");
      if (!map[d]) map[d] = { date: d, completed: 0, total: 0 };
      map[d].total++;
      if (t.completed) map[d].completed++;
    });
    return Object.values(map);
  }, [todos]);

  // ✅ Habit streaks
  const habitStreak = useMemo(() => {
    const days = new Set(
      todos.filter(t => t.completed && t.dueDate).map(t => {
        const d = new Date(t.dueDate);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      })
    );
    let streak = 0;
    let today = new Date();
    today.setHours(0,0,0,0);
    while (days.has(today.getTime())) {
      streak++;
      today.setDate(today.getDate() - 1);
    }
    return streak;
  }, [todos]);

  // ✅ Performance trend (tỷ lệ hoàn thành theo ngày)
  const performanceData = useMemo(() => {
    return productivityData.map(d => ({
      date: d.date,
      completionRate: d.total > 0 ? Math.round((d.completed / d.total) * 100) : 0
    }));
  }, [productivityData]);

  return (
    <div className="analytics-dashboard">
      <h2>📊 Analytics & Insights</h2>

      {/* Productivity Dashboard */}
      <div className="chart-container">
        <h3>Productivity (Tasks per Day)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={productivityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date"/>
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" name="Total Tasks"/>
            <Bar dataKey="completed" fill="#82ca9d" name="Completed"/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Habit Streak */}
      <div className="chart-container">
        <h3>🔥 Habit Streak</h3>
        <p>You have completed tasks for <b>{habitStreak}</b> consecutive days!</p>
      </div>

      {/* Performance Trend */}
      <div className="chart-container">
        <h3>Performance Trend (%)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date"/>
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="completionRate" stroke="#ff7300" name="Completion %"/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
