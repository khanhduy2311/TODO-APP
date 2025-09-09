// src/components/TodoForm.jsx - PHIÊN BẢN ĐÃ CẬP NHẬT

import { useState, useEffect } from 'react'; // 1. Import thêm useEffect

// 2. Nhận thêm prop 'selectedDate'
function TodoForm({ addTodo, selectedDate }) {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState(''); // Khởi tạo là chuỗi rỗng

  // 3. Thêm useEffect để "lắng nghe" sự thay đổi của selectedDate
  useEffect(() => {
    // Mỗi khi selectedDate từ App.jsx thay đổi (do click lịch),
    // chúng ta sẽ cập nhật lại giá trị của ô input ngày.
    if (selectedDate) {
      // Format lại date thành chuỗi 'YYYY-MM-DD' mà input type="date" có thể hiểu
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDueDate(formattedDate);
    }
  }, [selectedDate]); // Mảng dependency: Chỉ chạy lại effect này khi selectedDate thay đổi

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text, dueDate);
      setText(''); 
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        id="todo-input"
        type="text"
        placeholder="Add new task..."
        autoComplete="off"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        type="date"
        id="due-date-input"
        title="Choose a deadline"
        value={dueDate}
        // Cho phép người dùng tự thay đổi ngày trên form
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button id="add-button" type="submit">Add</button>
    </form>
  );
}

export default TodoForm;