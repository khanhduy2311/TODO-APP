// src/App.jsx - PHIÊN BẢN HOÀN CHỈNH

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

  useEffect(() => {
    if (!user) { setTodos([]); return; }
    const q = query(
      collection(db, 'todos'), 
      where('uid', '==', user.uid), 
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todosData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setTodos(todosData);
    });
    return () => unsubscribe();
  }, [user]); 

  const addTodo = async (text, dueDate) => {
    if (!user) return;
    const optimisticTodo = { id: Date.now(), uid: user.uid, text, dueDate, completed: false, createdAt: new Date() };
    setTodos(current => [optimisticTodo, ...current]);
    await addDoc(collection(db, 'todos'), { uid: user.uid, text, dueDate, completed: false, createdAt: optimisticTodo.createdAt });
  };

  const deleteTodo = async (id) => {
    if (!user || !window.confirm('Do you want to delete this task?')) return;
    setTodos(current => current.filter(todo => todo.id !== id));
    await deleteDoc(doc(db, 'todos', id));
  };

  const toggleTodo = async (id) => {
    if (!user) return;
    const originalTodos = todos;
    setTodos(current => current.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    try {
      const todoToUpdate = originalTodos.find(todo => todo.id === id);
      if (todoToUpdate) {
        await updateDoc(doc(db, 'todos', id), { completed: !todoToUpdate.completed });
      }
    } catch (error) {
      setTodos(originalTodos);
    }
  };

  // ***** HÀM EDIT TODO ĐƯỢC THÊM VÀO ĐÂY *****
  const editTodo = async (id, newText, newDueDate) => {
    if (!user) return;
    const originalTodos = todos;
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === id ? { ...todo, text: newText, dueDate: newDueDate } : todo
      )
    );
    try {
      const todoRef = doc(db, 'todos', id);
      await updateDoc(todoRef, {
        text: newText,
        dueDate: newDueDate
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      setTodos(originalTodos); 
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
            editTodo={editTodo} // TRUYỀN HÀM EDIT XUỐNG ĐÂY
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