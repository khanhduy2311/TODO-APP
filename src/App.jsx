// src/App.jsx - PHIÊN BẢN CÓ CHẾ ĐỘ XEM "ALL TASKS"

import { useState, useEffect, useRef } from 'react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // THÊM MỚI: State để quản lý chế độ xem (view)
  const [currentView, setCurrentView] = useState('calendar'); // 'calendar' hoặc 'allTasks'

  // useEffect cho auth và click ngoài menu (giữ nguyên)
  useEffect(() => { /* ... code của bạn ... */ }, []);
  useEffect(() => { /* ... code của bạn ... */ }, [menuRef]);

  // useEffect để lấy dữ liệu (giữ nguyên, vì nó đã sắp xếp theo priority rồi)
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

  // Các hàm xử lý todo (add, delete, toggle, edit) giữ nguyên
  const addTodo = async (text, dueDate, priority) => { /* ... code của bạn ... */ };
  const deleteTodo = async (id) => { /* ... code của bạn ... */ };
  const toggleTodo = async (id) => { /* ... code của bạn ... */ };
  const editTodo = async (id, newText, newDueDate, newPriority) => { /* ... code của bạn ... */ };
  
  const handleLogout = () => { signOut(auth); };

  // THÊM MỚI: Hàm để chuyển sang chế độ xem "All Tasks"
  const showAllTasks = () => {
    setCurrentView('allTasks');
    setIsMenuOpen(false); // Tự động đóng menu sau khi chọn
  };

  // SỬA ĐỔI: Hàm xử lý khi chọn ngày trên lịch
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setCurrentView('calendar'); // Luôn chuyển về chế độ xem theo ngày khi click lịch
  };

  // Lọc todos theo ngày (chỉ dùng cho chế độ 'calendar')
  const filteredTodos = todos.filter(todo => {
    if (!todo.dueDate) return false;
    const todoDate = new Date(todo.dueDate);
    const localTodoDate = new Date(todoDate.getUTCFullYear(), todoDate.getUTCMonth(), todoDate.getUTCDate());
    return localTodoDate.toDateString() === selectedDate.toDateString();
  });
  
  // THÊM MỚI: Quyết định danh sách nào sẽ được hiển thị
  const todosToDisplay = currentView === 'allTasks' ? todos : filteredTodos;

  // THÊM MỚI: Tạo tiêu đề động cho danh sách
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
            {/* SỬA ĐỔI: Thêm onClick cho nút Tasks */}
            <li><button onClick={showAllTasks}>Tasks</button></li>
            <li><button onClick={handleLogout}>Sign Out</button></li>
          </ul>
        </div>
      </div>

      <h1>TO-DO APP</h1>
      <div className="main-container">
        <div className="wrapper">
          <TodoForm addTodo={addTodo} />
          {/* THÊM MỚI: Hiển thị tiêu đề động */}
          <h2 className="list-title">{listTitle}</h2>
          <TodoList
            // SỬA ĐỔI: Luôn truyền danh sách đã được quyết định
            todos={todosToDisplay}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
          />
        </div>
        <Calendar
          selectedDate={selectedDate}
          // SỬA ĐỔI: Truyền hàm mới vào Calendar
          onDateChange={handleDateChange}
          todos={todos}
        />
      </div>
    </>
  );
}

export default App;