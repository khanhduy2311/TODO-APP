// src/components/TodoList.jsx

import TodoItem from './TodoItem';

function TodoList({ todos, toggleTodo, deleteTodo }) {
  if (todos.length === 0) {
    return (
      <p style={{ color: 'var(--placeholder-color)', fontStyle: 'italic', marginTop: '15px' }}>
        Không có công việc nào cho ngày này.
      </p>
    );
  }

  return (
    <ul id="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={toggleTodo} // Đảm bảo bạn có dòng này
          deleteTodo={deleteTodo} // Và dòng này
        />
      ))}
    </ul>
  );
}

export default TodoList;