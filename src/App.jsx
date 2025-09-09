// src/App.jsx - PHIÊN BẢN HOÀN CHỈNH + DARK/LIGHT MODE

import { useState, useEffect, useRef } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Calendar from './components/Calendar';
import Auth from './components/Auth'; // Hoặc AuthPage
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  collection, query, where, onSnapshot, addDoc, 
  doc, updateDoc, deleteDoc, orderBy
} from 'firebase/firestore';

function App() {
  // Lấy theme đã lưu, mặc định là 'light'
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [currentView, setCurrentView] = useState('calendar');

  // useEffect để áp dụng theme và lưu vào localStorage
  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]); // Chạy lại mỗi khi 'theme' thay đổi

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

  // useEffect để lấy dữ liệu Firestore (giữ nguyên)
  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'todos'), where('uid', '==', user.uid), orderBy('priority', 'desc'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const todosData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setTodos(todosData);
      });
      return () => unsubscribe();
    } else {
      setTodos([]);
    }
  }, [user]); 

  // Các hàm xử lý todo (giữ nguyên)
  const addTodo = async (text, dueDate, priority) => { /* ... code đầy đủ của bạn ... */ };
  const deleteTodo = async (id) => { /* ... code đầy đủ của bạn ... */ };
  const toggleTodo = async (id) => { /* ... code đầy đủ của bạn ... */ };
  const editTodo = async (id, newText, newDueDate, newPriority) => { /* ... code đầy đủ của bạn ... */ };
  
  const handleLogout = () => { signOut(auth); };

  // Các hàm quản lý view (giữ nguyên)
  const showAllTasks = () => {
    setCurrentView('allTasks');
    setIsMenuOpen(false);
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setCurrentView('calendar');
  };

  // Hàm để chuyển đổi theme
  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
    setIsMenuOpen(false);
  };

  // Logic lọc và hiển thị (giữ nguyên)
  const filteredTodos = todos.filter(todo => { /* ... code của bạn ... */ });
  const todosToDisplay = currentView === 'allTasks' ? todos : filteredTodos;
  const listTitle = currentView === 'allTasks' 
    ? 'All Tasks' 
    : `Tasks for ${selectedDate.toLocaleDateString('en-GB')}`;

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
            <li><button onClick={showAllTasks}>Tasks</button></li>
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

      <h1>TO-DO APP</h1>
      <div className="main-container">
        <div className="wrapper">
          <TodoForm addTodo={addTodo} />
          <h2 className="list-title">{listTitle}</h2>
          <TodoList
            todos={todosToDisplay}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
          />
        </div>
        <Calendar
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          todos={todos}
        />
      </div>
    </>
  );
}

export default App;
