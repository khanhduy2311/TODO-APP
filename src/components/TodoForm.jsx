// src/components/TodoForm.jsx - PHIÊN BẢN ĐÃ SỬA LỖI MÚI GIỜ

import { useState, useEffect } from 'react';

function TodoForm({ addTodo, selectedDate }) {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');

  // SỬA LẠI: useEffect để xử lý ngày tháng theo múi giờ địa phương
  useEffect(() => {
    if (selectedDate) {
      // --- BẮT ĐẦU PHẦN SỬA LỖI ---
      // Thay vì dùng .toISOString() (gây lỗi -1 ngày do chuyển về UTC),
      // chúng ta sẽ tự xây dựng chuỗi YYYY-MM-DD từ các thành phần ngày địa phương.

      const year = selectedDate.getFullYear();
      
      // getMonth() trả về 0-11, nên cần +1. Sau đó padStart để đảm bảo có 2 chữ số (VD: 09)
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      
      // getDate() trả về ngày trong tháng. padStart để đảm bảo có 2 chữ số (VD: 09)
      const day = String(selectedDate.getDate()).padStart(2, '0');

      // Kết hợp lại thành định dạng đúng
      const formattedDate = `${year}-${month}-${day}`;
      // --- KẾT THÚC PHẦN SỬA LỖI ---

      setDueDate(formattedDate);
    }
  }, [selectedDate]); // Chỉ chạy lại khi selectedDate thay đổi

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
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button id="add-button" type="submit">Add</button>
    </form>
  );
}

export default TodoForm;