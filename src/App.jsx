// src/App.jsx - PHIÊN BẢN HOÀN CHỈNH (SẮP XẾP THEO DEADLINE)

import { useState, useEffect, useRef } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Calendar from './components/Calendar';
import Auth from './components/Auth'; // Hoặc AuthPage nếu bạn đã đổi tên
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

  // SỬA LẠI: useEffect để lấy dữ liệu được sắp xếp theo DEADLINE
  useEffect(() => {
    if (user) {
      // Query này sẽ cần một INDEX MỚI trong Firestore.
      const q = query(
        collection(db, 'todos'), 
        where('uid', '==', user.uid),
        orderBy('dueDate', 'asc') // Sắp xếp theo dueDate tăng dần (gần nhất lên trước)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const todosData = [];
        querySnapshot.forEach((doc) => {
          todosData.push({ ...doc.data(), id: doc.id });
        });
        setTodos(todosData);
      }, (error) => console.error("Lỗi Firestore (Cần tạo Index?):", error));

      return () => unsubscribe();
    } else {
      setTodos([]);
    }
  }, [user]); 
  
  // Giữ nguyên các hàm xử lý todo từ file gốc của bạn
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
  
  // THÊM MỚI: Các hàm quản lý chế độ xem
  const showAllTasks = () => {
    setCurrentView('allTasks');
    setIsMenuOpen(false); // Đóng menu
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setCurrentView('calendar'); // Chuyển về chế độ xem theo ngày
  };

  // Logic lọc và hiển thị
  const filteredTodos = todos.filter(todo => {
    if (!todo.dueDate) return false;
    const todoDate = new Date(todo.dueDate);
    const localTodoDate = new Date(todoDate.getUTCFullYear(), todoDate.getUTCMonth(), todoDate.getUTCDate());
    return localTodoDate.toDateString() === selectedDate.toDateString();
  });
  
  const todosToDisplay = currentView === 'allTasks' ? todos : filteredTodos;

  const listTitle = currentView === 'allTasks' 
    ? 'All Tasks by Deadline' 
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
            <li><button onClick={handleLogout}>Sign Out</button></li>
          </ul>
        </div>
      </div>

      <h1>To-do app</h1>
      <div className="main-container">
        <div className="wrapper">
          <TodoForm addTodo={addTodo} />
          <h2 className="list-title">{listTitle}</h2>
          <TodoList
            todos={todosToDisplay}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
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