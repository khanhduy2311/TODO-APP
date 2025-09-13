import { useState, useEffect, useRef } from "react";
import { 
  collection, query, where, onSnapshot, addDoc, serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase";

function Chat({ currentUser, otherUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  const chatId = [currentUser.uid, otherUser.uid].sort().join("_");

  useEffect(() => {
    if (!currentUser || !otherUser) return;

    const q = query(
      collection(db, "messages"),
      where("chatId", "==", chatId)
    );

    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      msgs.sort((a, b) => {
        if (!a.createdAt) return -1;
        if (!b.createdAt) return 1;
        return a.createdAt.toMillis() - b.createdAt.toMillis();
      });
      setMessages(msgs);
    });

    return () => unsub();
  }, [currentUser, otherUser, chatId]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await addDoc(collection(db, "messages"), {
      from: currentUser.uid,
      to: otherUser.uid,
      participants: [currentUser.uid, otherUser.uid],
      chatId,
      text,
      createdAt: serverTimestamp()
    });

    setText("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <span>{otherUser.displayName || otherUser.email}</span>
        <button className="chat-close-btn" onClick={onClose}>×</button>
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
          placeholder="Type messages..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
}

export default Chat;
