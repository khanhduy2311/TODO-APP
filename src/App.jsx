// src/App.jsx
import { useState, useEffect, useRef } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import Calendar from "./components/Calendar";
import Auth from "./components/Auth";
import Chat from "./components/Chat";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs
} from "firebase/firestore";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [tasksPopupType, setTasksPopupType] = useState(null);

  // Chat
  const [chatUser, setChatUser] = useState(null);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [chatEmail, setChatEmail] = useState("");

  const menuRef = useRef(null);

  // Theme
  useEffect(() => {
    document.body.classList.toggle("dark-theme", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Click outside menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setIsTasksOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  // Load tasks
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "tasks"), where("uid", "==", user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
        setTodos(data);
      });
      return () => unsubscribe();
    } else {
      setTodos([]);
    }
  }, [user]);

  // CRUD tasks
  const addTodo = async (text, dueDate) => {
    if (!user) return;
    await addDoc(collection(db, "tasks"), {
      uid: user.uid,
      text,
      dueDate,
      completed: false,
      createdAt: new Date(),
    });
  };

  const deleteTodo = async (id) => {
    if (!user || !window.confirm("Do you want to delete this task?")) return;
    await deleteDoc(doc(db, "tasks", id));
  };

  const toggleTodo = async (id) => {
    if (!user) return;
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      await updateDoc(doc(db, "tasks", id), { completed: !todo.completed });
    }
  };

  // Logout
  const handleLogout = () => signOut(auth);

  // Theme toggle
  const toggleTheme = () =>
    setTheme((cur) => (cur === "light" ? "dark" : "light"));

  // Filter tasks theo ngày
  const filteredTodos = todos.filter((todo) => {
    if (!todo.dueDate) return false;
    const d = new Date(todo.dueDate);
    const localDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    return localDate.toDateString() === selectedDate.toDateString();
  });

  // Tasks by type
  const getTasksByType = (type) => {
    const today = new Date();
    if (type === "all")
      return [...todos].filter(t => t.dueDate)
        .sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate));
    if (type === "upcoming")
      return todos.filter(t=>{
        if (!t.dueDate) return false;
        const due = new Date(t.dueDate);
        return due>=today && due<=new Date(today.getTime()+7*24*60*60*1000);
      }).sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate));
    if (type === "completed")
      return todos.filter(t=>t.completed)
        .sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate));
    if (type === "overdue")
      return todos.filter(t=>{
        if (!t.dueDate) return false;
        const due = new Date(t.dueDate);
        return due<today && !t.completed;
      }).sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate));
    return [];
  };

  // Start chat
  const startChat = async () => {
    if (!chatEmail.trim()) return;
    const snap = await getDocs(collection(db, "users"));
    let found = null;
    snap.forEach((doc) => {
      const u = doc.data();
      if (u.email === chatEmail) found = { uid: doc.id, ...u };
    });
    if (found) {
      setChatUser(found);
      setShowChatPopup(false);
    } else {
      alert("Không tìm thấy user!");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <Auth />;

  return (
    <>
      <div className="user-menu-container" ref={menuRef}>
        <span>Hi, {user.displayName || user.email}</span>
        <button className="menu-toggle-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>
        <div className={`dropdown-menu ${isMenuOpen ? "active" : ""}`}>
          <ul>
            <li>
              <button onClick={toggleTheme}>
                {theme === "light" ? "Dark Mode 🌙" : "Light Mode ☀️"}
              </button>
            </li>
            <li className="submenu">
              <button onClick={() => setIsTasksOpen(!isTasksOpen)}>
                Tasks {isTasksOpen ? "▾" : "▸"}
              </button>
              <ul className={`submenu-items ${isTasksOpen ? "active" : ""}`}>
                <li><button onClick={() => {setTasksPopupType("all");setIsMenuOpen(false);}}>All</button></li>
                <li><button onClick={() => {setTasksPopupType("upcoming");setIsMenuOpen(false);}}>Upcoming</button></li>
                <li><button onClick={() => {setTasksPopupType("completed");setIsMenuOpen(false);}}>Completed</button></li>
                <li><button onClick={() => {setTasksPopupType("overdue");setIsMenuOpen(false);}}>Overdue</button></li>
              </ul>
            </li>
            <li><button onClick={() => setShowChatPopup(true)}>Chat</button></li>
            <li><button onClick={handleLogout}>Sign Out</button></li>
          </ul>
        </div>
      </div>

      {/* Popup chọn email để chat */}
      {showChatPopup && (
        <div className="tasks-popup-overlay" onClick={() => setShowChatPopup(false)}>
          <div className="tasks-popup" onClick={(e)=>e.stopPropagation()}>
            <h3>Bắt đầu chat</h3>
            <input
              type="email"
              placeholder="Nhập email người dùng..."
              value={chatEmail}
              onChange={(e) => setChatEmail(e.target.value)}
            />
            <button onClick={startChat}>Chat</button>
          </div>
        </div>
      )}

      {/* Cửa sổ chat */}
      {chatUser && (
        <Chat currentUser={user} otherUser={chatUser} onClose={() => setChatUser(null)} />
      )}

      {/* Popup hiển thị task */}
      {tasksPopupType && (
        <div className="tasks-popup-overlay" onClick={() => setTasksPopupType(null)}>
          <div className="tasks-popup" onClick={(e) => e.stopPropagation()}>
            <h3>
              {tasksPopupType === "all" && "All Tasks"}
              {tasksPopupType === "upcoming" && "Upcoming Tasks (7 days)"}
              {tasksPopupType === "completed" && "Completed Tasks"}
              {tasksPopupType === "overdue" && "Overdue Tasks"}
            </h3>
            <ul>
              {getTasksByType(tasksPopupType).map(todo => (
                <li key={todo.id}>
                  <span>{todo.text}</span>
                  <small>{todo.dueDate ? new Date(todo.dueDate).toLocaleDateString("vi-VN") : ""}</small>
                </li>
              ))}
            </ul>
            <button onClick={() => setTasksPopupType(null)}>Close</button>
          </div>
        </div>
      )}

      <h1>To-do app</h1>
      <div className="main-container">
        <div className="wrapper">
          <TodoForm addTodo={addTodo} selectedDate={selectedDate}/>
          <TodoList todos={filteredTodos} toggleTodo={toggleTodo} deleteTodo={deleteTodo}/>
        </div>
        <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} todos={todos}/>
      </div>
    </>
  );
}

export default App;
