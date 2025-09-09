// src/App.jsx - PHIÊN BẢN CÓ DARK/LIGHT MODE

import { useState, useEffect, useRef } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Calendar from './components/Calendar';
import Auth from './components/Auth'; // Hoặc AuthPage
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  collection, query, where, onSnapshot, addDoc, 
  doc, updateDoc, deleteDoc 
} from 'firebase/firestore';

function App() {
  // Lấy theme đã lưu từ localStorage, nếu không có thì mặc định là 'light'
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); 

  // useEffect để áp dụng theme vào body và lưu vào localStorage
  useEffect(() => {
    // Thêm hoặc xóa class 'dark-theme' trên thẻ body
    document.body.classList.toggle('dark-theme', theme === 'dark');
    // Lưu lựa chọn theme vào localStorage
    localStorage.setItem('theme', theme);
  }, [theme]); // Chạy lại mỗi khi state 'theme' thay đổi

  // useEffect cho auth và click ngoài menu (giữ nguyên)
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

  // Logic xử lý todo (giữ nguyên y hệt như file bạn cung cấp)
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
  const deleteTodo = async (id) => { /* ... code của bạn ... */ };
  const toggleTodo = async (id) => { /* ... code của bạn ... */ };
  const handleLogout = () => { signOut(auth); };
  
  // Hàm để chuyển đổi theme
  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
    setIsMenuOpen(false); // Đóng menu sau khi chọn
  };

  const filteredTodos = todos.filter(todo => { /* ... code của bạn ... */ });

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
            <li><button>Tasks</button></li>
            {/* THÊM NÚT CHUYỂN ĐỔI THEME VÀO MENU */}
            <li>
              <button onClick={toggleTheme}>
                {theme === 'light' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
              </button>
            </li>
            <li><button onClick={handleLogout}>Sign Out</button></li>
          </ul>
        </div>
      </div>

      <h1>To-do app</h1>
      {/* ... (phần còn lại của JSX giữ nguyên y hệt) ... */}
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