// src/App.jsx - PHIÊN BẢN CÓ PRIORITY

import { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Calendar from './components/Calendar';
import Auth from './components/Auth';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  collection, query, where, onSnapshot, addDoc, 
  doc, updateDoc, deleteDoc, orderBy
} from 'firebase/firestore';

function App() {
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // SỬA LẠI useEffect ĐỂ SẮP XẾP THEO PRIORITY
  useEffect(() => {
    if (user) {
      // Query này cần một INDEX MỚI trong Firestore
      const q = query(
        collection(db, 'todos'), 
        where('uid', '==', user.uid),
        orderBy('priority', 'desc'), // Sắp xếp theo priority cao nhất (3)
        orderBy('createdAt', 'desc')  // Sau đó mới theo ngày tạo
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const todosData = [];
        querySnapshot.forEach((doc) => {
          todosData.push({ ...doc.data(), id: doc.id });
        });
        setTodos(todosData);
      }, (error) => {
        console.error("Lỗi khi truy vấn Firestore (bạn có cần tạo Index không?):", error);
      });

      return () => unsubscribe();
    } else {
      setTodos([]);
    }
  }, [user]); 

  // SỬA LẠI HÀM addTodo ĐỂ THÊM PRIORITY
  const addTodo = async (text, dueDate, priority) => {
    if (!user) return;
    await addDoc(collection(db, 'todos'), {
      uid: user.uid, 
      text,
      dueDate,
      priority, // Thêm trường priority
      completed: false,
      createdAt: new Date(),
    });
  };

  // Các hàm delete và toggle giữ nguyên
  const deleteTodo = async (id) => {
    if (!user || !window.confirm('Do you want to delete this task?')) return;
    await deleteDoc(doc(db, 'todos', id));
  };

  const toggleTodo = async (id) => {
    if (!user) return;
    const todoToToggle = todos.find(todo => todo.id === id);
    if (todoToToggle) {
      const todoRef = doc(db, 'todos', id);
      await updateDoc(todoRef, { completed: !todoToToggle.completed });
    }
  };
  
  const handleLogout = () => { signOut(auth); };
  
  const filteredTodos = todos.filter(todo => {
    if (!todo.dueDate) return false;
    const todoDate = new Date(todo.dueDate);
    const localTodoDate = new Date(todoDate.getUTCFullYear(), todoDate.getUTCMonth(), todoDate.getUTCDate());
    return localTodoDate.toDateString() === selectedDate.toDateString();
  });

  if (loading) { return <div>Loading...</div>; }
  if (!user) { return <Auth />; }

  return (
    <>
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <span>Hi, {user.displayName || user.email}</span>
        <button onClick={handleLogout} id="add-button" style={{ marginLeft: '12px' }}>Sign Out</button>
      </div>
      <h1>To-do app</h1>
      <div className="main-container">
        <div className="wrapper">
          <TodoForm addTodo={addTodo} />
          <TodoList
            todos={filteredTodos}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
          />
        </div>
        <Calendar
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          todos={todos}
        />
      </div>
    </>
  );
}

export default App;