// src/components/TodoForm.jsx

import { useState } from 'react';

function TodoForm({ addTodo }) {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  // Thêm state cho priority, mặc định là Medium
  const [priority, setPriority] = useState(2); // 3: High, 2: Medium, 1: Low

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      // Truyền priority vào hàm addTodo
      addTodo(text, dueDate, priority);
      setText(''); 
      setPriority(2); // Reset về Medium
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        id="todo-input"
        type="text"
        placeholder="Add new task..."
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
        {/* Thêm ô chọn Priority */}
        <select 
          id="priority-select" 
          value={priority} 
          onChange={(e) => setPriority(Number(e.target.value))}
        >
          <option value={3}>High Priority</option>
          <option value={2}>Medium Priority</option>
          <option value={1}>Low Priority</option>
        </select>
      </div>
      <button id="add-button" type="submit">Add</button>
    </form>
  );
}

export default TodoForm;