// send-reminders.js - PHIÊN BẢN SỬA LỖI IMPORT

import { initializeApp as initializeClientApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
// SỬA LẠI CÁC DÒNG IMPORT CỦA FIREBASE ADMIN
import { initializeApp as initializeAdminApp, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { Resend } from "resend";

const firebaseConfig = {
  apiKey: process.env.VITE_API_KEY,
  authDomain: process.env.VITE_AUTH_DOMAIN,
  projectId: process.env.VITE_PROJECT_ID,
  storageBucket: process.env.VITE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_APP_ID,
};

// Khởi tạo Admin SDK một cách an toàn để tránh lỗi "already exists"
let adminApp;
if (!getApps().length) {
    adminApp = initializeAdminApp();
} else {
    adminApp = getApp();
}

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendReminders() {
  console.log("Initializing Firebase Client...");
  const clientApp = initializeClientApp(firebaseConfig);
  const db = getFirestore(clientApp);
  const authAdmin = getAuth(adminApp);
  console.log("Firebase initialized. Starting deadline check...");

  const tomorrow = new Date();
  tomorrow.setDate(new Date().getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");
  const tomorrowISO = `${year}-${month}-${day}`;

  const q = query(
    collection(db, "todos"),
    where("dueDate", "==", tomorrowISO),
    where("completed", "==", false)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    console.log("No tasks due tomorrow. Exiting.");
    return;
  }

  const tasksByUser = {};
  snapshot.forEach((doc) => {
    const task = doc.data();
    if (!tasksByUser[task.uid]) {
      tasksByUser[task.uid] = [];
    }
    tasksByUser[task.uid].push(task);
  });

  console.log(`Found tasks for ${Object.keys(tasksByUser).length} user(s).`);

  for (const uid in tasksByUser) {
    try {
      const userRecord = await authAdmin.getUser(uid);
      const userEmail = userRecord.email;
      const tasks = tasksByUser[uid];

      console.log(`Sending email to ${userEmail}...`);
      
      await resend.emails.send({
        from: 'Todo App Reminders <onboarding@resend.dev>',
        to: userEmail,
        subject: `🔔 Nhắc nhở: Bạn có ${tasks.length} công việc sắp đến hạn!`,
        html: `
          <h1>Xin chào ${userRecord.displayName || ''},</h1>
          <p>Đây là lời nhắc cho các công việc sẽ hết hạn vào ngày mai:</p>
          <ul>
            ${tasks.map((t) => `<li>${t.text}</li>`).join('')}
          </ul>
          <p>Hãy hoàn thành chúng sớm nhé!</p>
        `,
      });
      console.log(`Email sent successfully to ${userEmail}`);
    } catch (error) {
      console.error(`Failed to send email for UID: ${uid}`, error.message);
    }
  }
}

sendReminders();