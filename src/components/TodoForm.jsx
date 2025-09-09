
import { useState, useEffect } from 'react';

function TodoForm({ addTodo, selectedDate }) {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  useEffect(() => {
    if (selectedDate) {

      const year = selectedDate.getFullYear();
      
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      
      const day = String(selectedDate.getDate()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`;

      setDueDate(formattedDate);
    }
  }, [selectedDate]); 

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