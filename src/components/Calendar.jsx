import { useState, useEffect } from 'react';

function Calendar({ selectedDate, onDateChange, todos }) {
  const [displayDate, setDisplayDate] = useState(new Date());

  useEffect(() => {
    setDisplayDate(selectedDate);
  }, [selectedDate]);

  const changeMonth = (offset) => {
    const newDisplayDate = new Date(displayDate);
    newDisplayDate.setMonth(displayDate.getMonth() + offset, 1); 
    setDisplayDate(newDisplayDate);
  };
  
  const renderCalendarGrid = () => {
    const month = displayDate.getMonth();
    const year = displayDate.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const grid = [];

    dayNames.forEach(name => {
      grid.push(<div key={name} className="day-name">{name}</div>);
    });
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      grid.push(<div key={`empty-${i}`} className="inactive"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = new Date(year, month, day);
      
      const isToday = fullDate.toDateString() === new Date().toDateString();
      const isSelected = fullDate.toDateString() === selectedDate.toDateString();

      const todosForThisDay = todos.filter(todo => {
        if (!todo.dueDate) return false;
        const todoDate = new Date(todo.dueDate);
        const localTodoDate = new Date(todoDate.getUTCFullYear(), todoDate.getUTCMonth(), todoDate.getUTCDate());
        return localTodoDate.toDateString() === fullDate.toDateString();
      });

      const hasTasks = todosForThisDay.length > 0;
      const allCompleted = hasTasks && todosForThisDay.every(t => t.completed);
      const someOutstanding = hasTasks && todosForThisDay.some(t => !t.completed);

      grid.push(
        <div 
          key={day} 
          className={`day ${isToday ? 'current-day' : ''} ${isSelected ? 'selected-calendar-day' : ''}`}
          onClick={() => onDateChange(fullDate)}
        >
          {day}
          {hasTasks && (
            <div className={`task-dot ${allCompleted ? 'completed-dot' : ''} ${someOutstanding ? 'has-tasks-dot' : ''}`}></div>
          )}
        </div>
      );
    }
    
    return grid;
  };
  
  return (
    <div className="calendar-widget">
      <div className="calendar-header">
        <button id="prevMonthBtn" onClick={() => changeMonth(-1)}>&lt;</button>
        <h2 id="monthYearDisplay">
          {displayDate.toLocaleString('vi-VN', { month: 'long', year: 'numeric' })}
        </h2>
        <button id="nextMonthBtn" onClick={() => changeMonth(1)}>&gt;</button>
      </div>
      <div className="calendar-grid">
        {renderCalendarGrid()}
      </div>
    </div>
  );
}

export default Calendar;