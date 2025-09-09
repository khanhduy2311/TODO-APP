// src/components/TodoItem.jsx

import { useState } from 'react';

function TodoItem({ todo, toggleTodo, deleteTodo, editTodo }) { // NHẬN EDIT TODO
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);
  const [newDueDate, setNewDueDate] = useState(todo.dueDate || '');

  const handleSave = () => {
    if (newText.trim()) {
      editTodo(todo.id, newText, newDueDate);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <li className="todo editing">
        <input 
            type="text" 
            value={newText} 
            onChange={(e) => setNewText(e.target.value)} 
            className="edit-input"
            autoFocus
        />
        <input 
            type="date" 
            value={newDueDate} 
            onChange={(e) => setNewDueDate(e.target.value)}
            className="edit-date"
        />
        <div className="editing-actions">
            <button onClick={handleSave} className="save-btn">Save</button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
        </div>
      </li>
    );
  }

  const formattedDueDate = todo.dueDate
    ? new Date(todo.dueDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <li className="todo">
      <input
        type="checkbox"
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
      />
      <label className="custom-checkbox" htmlFor={`todo-${todo.id}`}>
        <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
      </label>
      
      <div className="todo-content">
        <span className="todo-text">{todo.text}</span>
        {todo.dueDate && (<span className="deadline-date">Deadline: {formattedDueDate}</span>)}
      </div>
      
      <div className="todo-actions">
        <button className="action-btn edit-btn" onClick={() => setIsEditing(true)}>✏️</button>
        <button className="action-btn delete-btn" onClick={() => deleteTodo(todo.id)}>🗑️</button>
      </div>
    </li>
  );
}

export default TodoItem;