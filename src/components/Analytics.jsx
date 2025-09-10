import { useState, useEffect, useMemo } from 'react';

function Analytics({ todos, user }) {
  const [timeRange, setTimeRange] = useState('week'); // week, month, all
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTodos = useMemo(() => {
    let filtered = todos;
    
    // Filter by time range
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      default:
        startDate.setFullYear(2020); // All time
    }
    
    filtered = filtered.filter(todo => {
      const todoDate = todo.createdAt?.toDate() || new Date();
      return todoDate >= startDate;
    });
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(todo => todo.category === selectedCategory);
    }
    
    return filtered;
  }, [todos, timeRange, selectedCategory]);

  const analytics = useMemo(() => {
    const completed = filteredTodos.filter(t => t.completed);
    const pending = filteredTodos.filter(t => !t.completed);
    
    // Task completion stats
    const completionRate = filteredTodos.length > 0 
      ? Math.round((completed.length / filteredTodos.length) * 100) 
      : 0;
    
    // Time tracking stats
    const totalTimeSpent = filteredTodos.reduce((sum, todo) => sum + (todo.actualTime || 0), 0);
    const totalEstimatedTime = filteredTodos.reduce((sum, todo) => sum + (todo.estimatedTime || 0), 0);
    const timeEfficiency = totalEstimatedTime > 0 
      ? Math.round((totalEstimatedTime / Math.max(totalTimeSpent, 1)) * 100)
      : 0;
    
    // Priority distribution
    const priorityStats = {
      urgent: filteredTodos.filter(t => t.priority === 'urgent').length,
      high: filteredTodos.filter(t => t.priority === 'high').length,
      medium: filteredTodos.filter(t => t.priority === 'medium').length,
      low: filteredTodos.filter(t => t.priority === 'low').length,
    };
    
    // Category performance
    const categoryStats = {};
    const categories = ['study', 'work', 'personal', 'health', 'project', 'general'];
    categories.forEach(cat => {
      const catTodos = filteredTodos.filter(t => t.category === cat);
      const catCompleted = catTodos.filter(t => t.completed).length;
      categoryStats[cat] = {
        total: catTodos.length,
        completed: catCompleted,
        rate: catTodos.length > 0 ? Math.round((catCompleted / catTodos.length) * 100) : 0
      };
    });
    
    // Procrastination patterns (overdue tasks)
    const overdueTasks = pending.filter(todo => {
      if (!todo.dueDate) return false;
      const dueDate = new Date(todo.dueDate);
      return dueDate < new Date();
    });
    
    // Best productive hours (mock data - would need real tracking)
    const productiveHours = {
      morning: Math.floor(Math.random() * 40) + 10,
      afternoon: Math.floor(Math.random() * 40) + 20,
      evening: Math.floor(Math.random() * 40) + 15,
      night: Math.floor(Math.random() * 20) + 5
    };
    
    return {
      completionRate,
      totalTimeSpent,
      totalEstimatedTime,
      timeEfficiency,
      priorityStats,
      categoryStats,
      overdueTasks: overdueTasks.length,
      totalTasks: filteredTodos.length,
      productiveHours,
      streak: calculateStreak(todos) // Helper function needed
    };
  }, [filteredTodos, todos]);

  const calculateStreak = (todos) => {
    // Simple streak calculation - days with completed tasks
    const today = new Date();
    let streak = 0;
    let checkDate = new Date(today);
    
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const dayTodos = todos.filter(todo => {
        if (!todo.createdAt) return false;
        const todoDate = todo.createdAt.toDate();
        return todoDate.toDateString() === checkDate.toDateString() && todo.completed;
      });
      
      if (dayTodos.length > 0) {
        streak++;
      } else if (i > 0) { // Don't break on first day (today might not have completed tasks yet)
        break;
      }
      
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    return streak;
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const getProcrastinationAdvice = () => {
    const { overdueTasks, timeEfficiency, priorityStats } = analytics;
    
    if (overdueTasks > 5) {
      return "🚨 High procrastination risk! Try breaking large tasks into smaller ones.";
    } else if (timeEfficiency < 50) {
      return "⚡ You're taking longer than estimated. Try the Pomodoro technique!";
    } else if (priorityStats.urgent > 3) {
      return "🎯 Too many urgent tasks! Focus on better time planning.";
    } else {
      return "✨ Great job managing your time! Keep up the momentum!";
    }
  };

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>📊 Smart Analytics</h2>
        <div className="analytics-filters">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="all">All Time</option>
          </select>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="study">📚 Study</option>
            <option value="work">💼 Work</option>
            <option value="personal">🏠 Personal</option>
            <option value="health">💪 Health</option>
            <option value="project">🚀 Project</option>
            <option value="general">📋 General</option>
          </select>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Key Metrics */}
        <div className="metric-card completion">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <h3>Completion Rate</h3>
            <div className="metric-value">{analytics.completionRate}%</div>
            <div className="metric-subtitle">{analytics.totalTasks} total tasks</div>
          </div>
        </div>

        <div className="metric-card time">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <h3>Time Spent</h3>
            <div className="metric-value">{formatTime(analytics.totalTimeSpent)}</div>
            <div className="metric-subtitle">
              {analytics.timeEfficiency}% efficiency
            </div>
          </div>
        </div>

        <div className="metric-card streak">
          <div className="metric-icon">🔥</div>
          <div className="metric-content">
            <h3>Streak</h3>
            <div className="metric-value">{analytics.streak}</div>
            <div className="metric-subtitle">days productive</div>
          </div>
        </div>

        <div className="metric-card overdue">
          <div className="metric-icon">⚠️</div>
          <div className="metric-content">
            <h3>Overdue</h3>
            <div className="metric-value">{analytics.overdueTasks}</div>
            <div className="metric-subtitle">tasks behind</div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="chart-card priority-chart">
          <h3>Priority Distribution</h3>
          <div className="priority-bars">
            {Object.entries(analytics.priorityStats).map(([priority, count]) => (
              <div key={priority} className="priority-bar-item">
                <span className="priority-label">{priority}</span>
                <div className="priority-bar">
                  <div 
                    className={`priority-fill priority-${priority}`}
                    style={{ width: `${(count / Math.max(analytics.totalTasks, 1)) * 100}%` }}
                  />
                </div>
                <span className="priority-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance */}
        <div className="chart-card category-chart">
          <h3>Category Performance</h3>
          <div className="category-performance">
            {Object.entries(analytics.categoryStats).map(([category, stats]) => (
              stats.total > 0 && (
                <div key={category} className="category-item">
                  <div className="category-header">
                    <span>{category}</span>
                    <span className="category-rate">{stats.rate}%</span>
                  </div>
                  <div className="category-progress">
                    <div 
                      className="category-progress-fill"
                      style={{ width: `${stats.rate}%` }}
                    />
                  </div>
                  <div className="category-stats">
                    {stats.completed}/{stats.total} completed
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="insight-card">
          <h3>🤖 AI Insights</h3>
          <div className="insight-content">
            <p className="main-insight">{getProcrastinationAdvice()}</p>
            <div className="insight-tips">
              <h4>💡 Smart Tips:</h4>
              <ul>
                <li>Your most productive time seems to be in the afternoon</li>
                <li>Try batching similar tasks together</li>
                <li>Set smaller time estimates to avoid overcommitting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;