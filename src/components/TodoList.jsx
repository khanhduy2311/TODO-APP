import TodoItem from './TodoItem';

function TodoList({ todos, toggleTodo, deleteTodo }) {
  if (todos.length === 0) {
    return (
      <p style={{ color: 'var(--placeholder-color)', fontStyle: 'italic', marginTop: '15px', fontSize: '0.8rem' }}>
        No tasks available.
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
        />
      ))}
    </ul>
  );
}

export default TodoList;