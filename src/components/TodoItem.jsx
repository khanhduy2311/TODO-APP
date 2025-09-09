// src/components/TodoItem.jsx

function TodoItem({ todo, toggleTodo, deleteTodo }) {
  const formattedDueDate = todo.dueDate
    ? new Date(todo.dueDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  // Helper để lấy class CSS dựa trên priority
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 3: return 'priority-high';
      case 2: return 'priority-medium';
      case 1: return 'priority-low';
      default: return 'priority-medium'; // Mặc định là Medium
    }
  };

  return (
    // Thêm class priority vào li
    <li className={`todo ${getPriorityClass(todo.priority)}`}>
      {/* Thêm vạch màu chỉ thị priority */}
      <div className="priority-indicator"></div>
      
      <input
        type="checkbox"
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)} 
      />
      
      <label className="custom-checkbox" htmlFor={`todo-${todo.id}`}>
        <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
      </label>
      
      <label htmlFor={`todo-${todo.id}`} className="todo-text">
        {todo.text}
      </label>
      
      {/* Mở lại phần hiển thị deadline */}
      {todo.dueDate && (
        <span className="deadline-date">Deadline: {formattedDueDate}</span>
      )}

      <button className="delete-button" onClick={() => deleteTodo(todo.id)}>
        <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
      </button>
    </li>
  );
}

export default TodoItem;