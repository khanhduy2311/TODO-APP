// src/App.jsx - PHIÊN BẢN GỐC + DARK/LIGHT MODE

import { useState, useEffect, useRef } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Calendar from './components/Calendar';
import Auth from './components/Auth';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';


function App() {
  // Lấy theme đã lưu, nếu không có thì mặc định là 'light'
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); 

  // useEffect để áp dụng theme và lưu vào localStorage
  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Các useEffect và hàm gốc của bạn được giữ nguyên
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'todos'), where('uid', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const todosData = [];
        querySnapshot.forEach((doc) => {
          todosData.push({ ...doc.data(), id: doc.id });
        });
        setTodos(todosData);
      });

      return () => unsubscribe();
    } else {
      setTodos([]);
    }
  }, [user]); 
  
  const addTodo = async (text, dueDate) => {
    if (!user) return;
    await addDoc(collection(db, 'todos'), {
      uid: user.uid, text, dueDate, completed: false, createdAt: new Date(),
    });
  };

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

  // Hàm để chuyển đổi theme
  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
    setIsMenuOpen(false); // Đóng menu sau khi chọn
  };
  
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
      <div className="user-menu-container" ref={menuRef}>
        <span>Hi, {user.displayName || user.email}</span>
        <button className="menu-toggle-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <div className={`dropdown-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            <li>
              <button onClick={toggleTheme}>
                {theme === 'light' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
              </button>
            </li>
            <li><button>Tasks</button></li>
            {/* THÊM NÚT CHUYỂN ĐỔI THEME VÀO MENU */}
            <li><button onClick={handleLogout}>Sign Out</button></li>
          </ul>
        </div>
      </div>

      <h1>To-do app</h1>
      <div className="main-container">
        <div className="wrapper">
          <TodoForm addTodo={addTodo} selectedDate={selectedDate}/>
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