import { useState, useEffect, useRef } from "react";
import { 
  collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase";

function Chat({ currentUser, otherUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  const chatId = [currentUser.uid, otherUser.uid].sort().join("_");

  // Lắng nghe tin nhắn realtime
  useEffect(() => {
    if (!currentUser || !otherUser) return;

    const q = query(
      collection(db, "messages"),
      where("chatId", "==", chatId),
      orderBy("createdAt")
    );

    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(m => !!m.createdAt); // bỏ tin chưa có timestamp
      setMessages(msgs);
    });

    return () => unsub();
  }, [currentUser, otherUser, chatId]);

  // Gửi tin nhắn
  const sendMessage = async () => {
    if (!text.trim()) return;

    const newMsg = {
      from: currentUser.uid,
      to: otherUser.uid,
      participants: [currentUser.uid, otherUser.uid],
      chatId,
      text,
      createdAt: serverTimestamp()
    };

    // Hiển thị local ngay (tránh delay do serverTimestamp)
    setMessages(prev => [...prev, { ...newMsg, id: Date.now() }]);

    await addDoc(collection(db, "messages"), newMsg);
    setText("");
  };

  // Auto scroll xuống cuối
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <span>Chat với {otherUser.displayName || otherUser.email}</span>
        <button onClick={onClose}>×</button>
      </div>

      <div className="chat-messages">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`chat-message ${m.from === currentUser.uid ? "me" : "them"}`}
          >
            {m.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nhập tin nhắn..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
}

export default Chat;
