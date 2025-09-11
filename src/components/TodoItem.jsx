function TodoItem({ todo, toggleTodo, deleteTodo, onEditNote }) {
  const formattedDueDate = todo.dueDate
    ? new Date(todo.dueDate).toLocaleDateString('vi-VN', {
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
      
      <div className="todo-content" onClick={() => onEditNote(todo)}>
        <div className="todo-text-container">
          <span className="todo-text">{todo.text}</span>
          {todo.note && (
            <div className="todo-note-preview">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14,2 14,8 20,8"/>
              </svg>
              <span>{todo.note.substring(0, 30)}{todo.note.length > 30 ? '...' : ''}</span>
            </div>
          )}
        </div>
        {formattedDueDate && (
          <span className="deadline-date">{formattedDueDate}</span>
        )}
      </div>

      <button className="delete-button" onClick={() => deleteTodo(todo.id)}>
        <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
      </button>
    </li>
  );
}

export default TodoItem;