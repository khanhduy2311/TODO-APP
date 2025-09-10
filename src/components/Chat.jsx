import { useState, useEffect, useRef } from "react";
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

function Chat({ currentUser, otherUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  // Lắng nghe tin nhắn realtime
  useEffect(() => {
    if (!currentUser || !otherUser) return;

    const q = query(
      collection(db, "messages"),
      where("participants", "array-contains", currentUser.uid),
      orderBy("createdAt")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = [];
      snap.forEach((doc) => {
        const msg = doc.data();
        // Chỉ lấy tin nhắn giữa 2 người
        if (
          (msg.from === currentUser.uid && msg.to === otherUser.uid) ||
          (msg.from === otherUser.uid && msg.to === currentUser.uid)
        ) {
          data.push({ id: doc.id, ...msg });
        }
      });
      setMessages(data);
    });

    return () => unsub();
  }, [currentUser, otherUser]);

  // Gửi tin nhắn
  const sendMessage = async () => {
    if (!text.trim()) return;
    await addDoc(collection(db, "messages"), {
      from: currentUser.uid,
      to: otherUser.uid,
      participants: [currentUser.uid, otherUser.uid],
      text,
      createdAt: serverTimestamp()
    });
    setText("");
  };

  // Auto scroll khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <span>Chat với {otherUser.email}</span>
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
        <button onClick={sendMessage}>Gửi</button>
      </div>
    </div>
  );
}

export default Chat;
