// src/App.jsx
import { useState, useEffect, useRef } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Calendar from './components/Calendar';
import Auth from './components/Auth';
import Chat from './components/Chat';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  collection, query, where, onSnapshot, addDoc, 
  doc, updateDoc, deleteDoc, getDocs, arrayUnion, serverTimestamp
} from 'firebase/firestore';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false); 
  const [tasksPopupType, setTasksPopupType] = useState(null); 

  // Chat states
  const [chatUser, setChatUser] = useState(null);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [chatEmail, setChatEmail] = useState("");

  // Friends states
  const [friendsList, setFriendsList] = useState([]);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendEmail, setFriendEmail] = useState("");

  const menuRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        try {
          await updateDoc(userRef, {
            online: true,
            lastSeen: serverTimestamp()
          });
        } catch (err) {
          console.warn("⚠️ User doc chưa tồn tại, cần tạo khi đăng ký");
        }

        const unsubUser = onSnapshot(userRef, async (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            if (data.friends && data.friends.length > 0) {
              const friendsSnap = await getDocs(collection(db, "users"));
              const list = [];
              friendsSnap.forEach((d) => {
                if (data.friends.includes(d.id)) {
                  list.push({ uid: d.id, ...d.data() });
                }
              });
              setFriendsList(list);
            } else {
              setFriendsList([]);
            }
          }
        });
        return () => unsubUser();
      }
    });
    return () => unsubscribe();
  }, []);

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

  const handleLogout = async () => { 
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        online: false,
        lastSeen: serverTimestamp()
      });
    }
    signOut(auth); 
  };

  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
    setIsMenuOpen(false);
  };

  const filteredTodos = todos.filter(todo => {
    if (!todo.dueDate) return false;
    const todoDate = new Date(todo.dueDate);
    const localTodoDate = new Date(todoDate.getUTCFullYear(), todoDate.getUTCMonth(), todoDate.getUTCDate());
    return localTodoDate.toDateString() === selectedDate.toDateString();
  });

  const getTasksByType = (type) => {
    const today = new Date();
    if (type === "all") {
      return [...todos].filter(t => t.dueDate).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
    if (type === "upcoming") {
      return todos.filter(t => {
        if (!t.dueDate) return false;
        const due = new Date(t.dueDate);
        return due >= today && due <= new Date(today.getTime() + 7*24*60*60*1000);
      }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
    if (type === "completed") {
      return todos.filter(t => t.completed).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
    if (type === "overdue") {
      return todos.filter(t => {
        if (!t.dueDate) return false;
        const due = new Date(t.dueDate);
        return due < today && !t.completed;
      }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
    return [];
  };

  const startChat = async () => {
    if (!chatEmail) return;
    const snap = await getDocs(collection(db, "users"));
    let found = null;
    snap.forEach(doc => {
      const u = doc.data();
      if (u.email === chatEmail) found = { uid: doc.id, ...u };
    });
    if (found) {
      setChatUser(found);
      setShowChatPopup(false);
      setChatEmail("");
    } else {
      alert("Không tìm thấy user!");
    }
  };

  const addFriend = async () => {
    if (!friendEmail) return;
    const snap = await getDocs(collection(db, "users"));
    let found = null;
    snap.forEach((docSnap) => {
      const u = docSnap.data();
      if (u.email === friendEmail) found = { uid: docSnap.id, ...u };
    });
    if (found) {
      const userRef = doc(db, "users", user.uid);
      const friendRef = doc(db, "users", found.uid);
      await updateDoc(userRef, { friends: arrayUnion(found.uid) });
      await updateDoc(friendRef, { friends: arrayUnion(user.uid) });
      alert("Đã kết bạn với " + (found.displayName || found.email));
      setFriendEmail("");
      setShowAddFriend(false);
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
            <li className="submenu">
              <button onClick={() => setIsTasksOpen(!isTasksOpen)}>
                Tasks {isTasksOpen ? "▾" : "▸"}
              </button>
              <ul className={`submenu-items ${isTasksOpen ? 'active' : ''}`}>
                <li><button onClick={() => { setTasksPopupType("all"); setIsMenuOpen(false); setIsTasksOpen(false); }}>All</button></li>
                <li><button onClick={() => { setTasksPopupType("upcoming"); setIsMenuOpen(false); setIsTasksOpen(false); }}>Upcoming</button></li>
                <li><button onClick={() => { setTasksPopupType("completed"); setIsMenuOpen(false); setIsTasksOpen(false); }}>Completed</button></li>
                <li><button onClick={() => { setTasksPopupType("overdue"); setIsMenuOpen(false); setIsTasksOpen(false); }}>Overdue</button></li>
              </ul>
            </li>
            <li><button onClick={() => { setShowChatPopup(true); setIsMenuOpen(false); }}>Chat 💬</button></li>
            <li><button onClick={() => { setShowAddFriend(true); setIsMenuOpen(false); }}>Add Friend 🤝</button></li>
            <li><button onClick={handleLogout}>Sign Out</button></li>
          </ul>
        </div>
      </div>

      {/* Popup hiển thị danh sách task */}
      {tasksPopupType && (
        <div className="tasks-popup-overlay" onClick={() => setTasksPopupType(null)}>
          <div className="tasks-popup" onClick={e => e.stopPropagation()}>
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
                  <small>{todo.dueDate ? new Date(todo.dueDate).toLocaleDateString('vi-VN') : ''}</small>
                </li>
              ))}
            </ul>
            <button onClick={() => setTasksPopupType(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Popup nhập email để chat */}
      {showChatPopup && (
        <div className="tasks-popup-overlay" onClick={() => setShowChatPopup(false)}>
          <div className="tasks-popup" onClick={e => e.stopPropagation()}>
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

      {/* Popup thêm bạn */}
      {showAddFriend && (
        <div className="tasks-popup-overlay" onClick={() => setShowAddFriend(false)}>
          <div className="tasks-popup" onClick={e => e.stopPropagation()}>
            <h3>Thêm bạn bè</h3>
            <input
              type="email"
              placeholder="Nhập email..."
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
            />
            <button onClick={addFriend}>Kết bạn</button>
          </div>
        </div>
      )}

      {/* Hiển thị cửa sổ chat */}
      {chatUser && (
        <Chat
          currentUser={user}
          otherUser={chatUser}
          onClose={() => setChatUser(null)}
        />
      )}

      {/* Danh sách bạn bè */}
      {user && (
        <div className="friends-list">
          <h3>Bạn bè</h3>
          <ul>
            {friendsList.map((f) => (
              <li key={f.uid} onClick={() => setChatUser(f)}>
                {f.displayName || f.email}
                <span className={`status ${f.online ? "online" : "offline"}`}></span>
              </li>
            ))}
          </ul>
        </div>
      )}

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
