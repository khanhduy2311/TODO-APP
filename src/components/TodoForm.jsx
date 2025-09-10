import { useState, useEffect } from 'react';

function TodoForm({ addTodo, selectedDate }) {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [category, setCategory] = useState('general');

  useEffect(() => {
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setDueDate(formattedDate);
    }
  }, [selectedDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text, dueDate, {
        priority,
        estimatedTime: parseInt(estimatedTime) || 0,
        category,
        actualTime: 0,
        isActive: false,
        startTime: null
      });
      setText(''); 
      setEstimatedTime('');
    }
  };

  const categories = [
    { value: 'general', label: 'General', emoji: '📋' },
    { value: 'study', label: 'Study', emoji: '📚' },
    { value: 'work', label: 'Work', emoji: '💼' },
    { value: 'personal', label: 'Personal', emoji: '🏠' },
    { value: 'health', label: 'Health', emoji: '💪' },
    { value: 'project', label: 'Project', emoji: '🚀' }
  ];

  return (
    <form onSubmit={handleSubmit} className="enhanced-form">
      <input
        id="todo-input"
        type="text"
        placeholder="Add new task... (e.g., 'Study Math chapter 5')"
        autoComplete="off"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      
      <div className="form-row">
        <input
          type="date"
          id="due-date-input"
          title="Choose a deadline"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        
        <select 
          value={priority} 
          onChange={(e) => setPriority(e.target.value)}
          className="priority-select"
        >
          <option value="low">🟢 Low Priority</option>
          <option value="medium">🟡 Medium Priority</option>
          <option value="high">🔴 High Priority</option>
          <option value="urgent">⚡ Urgent</option>
        </select>
      </div>

      <div className="form-row">
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.emoji} {cat.label}
            </option>
          ))}
        </select>
        
        <div className="time-input-group">
          <input
            type="number"
            placeholder="Est. minutes"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            min="1"
            max="480"
            className="time-input"
          />
          <span className="time-label">min</span>
        </div>
      </div>

      <button id="add-button" type="submit">Add Smart Task</button>
    </form>
  );
}

export default TodoForm;