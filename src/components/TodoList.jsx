// src/components/TodoList.jsx

import TodoItem from './TodoItem';

function TodoList({ todos, toggleTodo, deleteTodo, editTodo }) { // NHẬN EDIT TODO
  if (todos.length === 0) {
    return (
      <p style={{ color: 'var(--placeholder-color)', fontStyle: 'italic', marginTop: '15px' }}>
        No tasks for this day.
      </p>
    );
  }

  return (
    <ul id="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={toggleTodo} 
          deleteTodo={deleteTodo} 
          editTodo={editTodo} // TRUYỀN EDIT TODO XUỐNG
        />
      ))}
    </ul>
  );
}

export default TodoList;