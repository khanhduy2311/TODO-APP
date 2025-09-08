import { useState } from 'react';

// Sử dụng lại các class CSS từ file gốc
function TodoForm({ addTodo }) {
  const [text, setText] = useState('');
  // Đặt ngày mặc định là ngày hôm nay
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text, dueDate);
      setText(''); // Reset input text
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        id="todo-input"
        type="text"
        placeholder="Thêm công việc mới..."
        autoComplete="off"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        type="date"
        id="due-date-input"
        title="Chọn ngày deadline"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button id="add-button" type="submit">Thêm</button>
    </form>
  );
}

export default TodoForm;