import { useState, useEffect } from 'react';

function TodoItem({ todo, toggleTodo, deleteTodo, updateTodo }) {
  const [timeSpent, setTimeSpent] = useState(todo.actualTime || 0);
  const [isTimerActive, setIsTimerActive] = useState(todo.isActive || false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerActive && !todo.completed) {
      interval = setInterval(() => {
        setTimeSpent(prevTime => {
          const newTime = prevTime + 1;
          // Auto-save every minute
          if (newTime % 60 === 0) {
            updateTodo(todo.id, { actualTime: newTime });
          }
          return newTime;
        });
      }, 60000); // Update every minute
    } else if (!isTimerActive) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, todo.completed, todo.id, updateTodo]);

  const handleTimerToggle = () => {
    const newActiveState = !isTimerActive;
    setIsTimerActive(newActiveState);
    
    const updateData = {
      isActive: newActiveState,
      actualTime: timeSpent
    };
    
    if (newActiveState) {
      updateData.startTime = new Date().toISOString();
    }
    
    updateTodo(todo.id, updateData);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#ff4757';
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffa502';
      case 'low': return '#26de81';
      default: return 'var(--secondary-color)';
    }
  };

  const getCategoryEmoji = (category) => {
    const categoryMap = {
      general: '📋',
      study: '📚',
      work: '💼',
      personal: '🏠',
      health: '💪',
      project: '🚀'
    };
    return categoryMap[category] || '📋';
  };

  const getProgressPercentage = () => {
    if (!todo.estimatedTime || todo.estimatedTime === 0) return 0;
    return Math.min((timeSpent / todo.estimatedTime) * 100, 100);
  };

  const isOvertime = timeSpent > (todo.estimatedTime || 0) && todo.estimatedTime > 0;

  const formattedDueDate = todo.dueDate
    ? new Date(todo.dueDate).toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <li className={`todo enhanced-todo ${todo.completed ? 'completed' : ''} priority-${todo.priority}`}>
      {/* Priority indicator */}
      <div 
        className="priority-indicator" 
        style={{ backgroundColor: getPriorityColor(todo.priority) }}
      />
      
      {/* Checkbox */}
      <input
        type="checkbox"
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)} 
      />
      
      <label className="custom-checkbox" htmlFor={`todo-${todo.id}`}>
        <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
          <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
        </svg>
      </label>
      
      {/* Main content */}
      <div className="todo-content">
        <div className="todo-main-row">
          <span className="category-emoji">{getCategoryEmoji(todo.category)}</span>
          <label htmlFor={`todo-${todo.id}`} className="todo-text">
            {todo.text}
          </label>
          <span className="todo-meta">
            {formattedDueDate && <span className="due-date">{formattedDueDate}</span>}
          </span>
        </div>
        
        {/* Progress and time info */}
        <div className="todo-details">
          <div className="time-info">
            <span className={`actual-time ${isOvertime ? 'overtime' : ''}`}>
              ⏱️ {formatTime(timeSpent)}
            </span>
            {todo.estimatedTime > 0 && (
              <span className="estimated-time">
                / {formatTime(todo.estimatedTime)} est.
              </span>
            )}
            {todo.estimatedTime > 0 && (
              <div className="progress-bar">
                <div 
                  className={`progress-fill ${isOvertime ? 'overtime' : ''}`}
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="todo-controls">
        {!todo.completed && (
          <button 
            className={`timer-btn ${isTimerActive ? 'active' : ''}`}
            onClick={handleTimerToggle}
            title={isTimerActive ? 'Stop timer' : 'Start timer'}
          >
            {isTimerActive ? '⏸️' : '▶️'}
          </button>
        )}
        
        <button 
          className="details-btn"
          onClick={() => setShowDetails(!showDetails)}
          title="View details"
        >
          ℹ️
        </button>
        
        <button className="delete-button" onClick={() => deleteTodo(todo.id)}>
          <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
          </svg>
        </button>
      </div>

      {/* Detailed view */}
      {showDetails && (
        <div className="todo-expanded-details">
          <div className="detail-row">
            <strong>Category:</strong> {getCategoryEmoji(todo.category)} {todo.category}
          </div>
          <div className="detail-row">
            <strong>Priority:</strong> <span style={{color: getPriorityColor(todo.priority)}}>{todo.priority}</span>
          </div>
          {todo.estimatedTime > 0 && (
            <div className="detail-row">
              <strong>Efficiency:</strong> 
              {timeSpent > 0 ? (
                <span className={timeSpent <= todo.estimatedTime ? 'good-efficiency' : 'poor-efficiency'}>
                  {Math.round((todo.estimatedTime / Math.max(timeSpent, 1)) * 100)}%
                </span>
              ) : 'Not started'}
            </div>
          )}
          <div className="detail-row">
            <strong>Created:</strong> {new Date(todo.createdAt.toDate()).toLocaleDateString('vi-VN')}
          </div>
        </div>
      )}
    </li>
  );
}

export default TodoItem;