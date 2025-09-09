const { initializeApp } = require("firebase/app");
const { getFirestore, collection, query, where, getDocs } = require("firebase/firestore");
const { getAuth, getUser } = require("firebase/auth");
const { Resend } = require("resend");

// Lấy thông tin cấu hình từ "Secrets" của GitHub Actions
const firebaseConfig = {
  apiKey: process.env.VITE_API_KEY,
  authDomain: process.env.VITE_AUTH_DOMAIN,
  projectId: process.env.VITE_PROJECT_ID,
  storageBucket: process.env.VITE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_APP_ID,
};

const resend = new Resend(process.env.RESEND_API_KEY);

// Hàm chính để chạy
async function sendReminders() {
  console.log("Initializing Firebase...");
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  console.log("Firebase initialized. Starting deadline check...");

  // Lấy ngày mai
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");
  const tomorrowISO = `${year}-${month}-${day}`;

  // 1. Tìm các công việc đến hạn vào ngày mai
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

  // 2. Gom công việc theo từng người dùng
  const tasksByUser = {};
  snapshot.forEach((doc) => {
    const task = doc.data();
    if (!tasksByUser[task.uid]) {
      tasksByUser[task.uid] = [];
    }
    tasksByUser[task.uid].push(task);
  });

  console.log(`Found tasks for ${Object.keys(tasksByUser).length} user(s).`);

  // 3. Gửi email cho từng người
  for (const uid in tasksByUser) {
    try {
      // Lấy thông tin người dùng từ UID
      const userRecord = await getUser(auth, uid);
      const userEmail = userRecord.email;
      const tasks = tasksByUser[uid];

      console.log(`Sending email to ${userEmail}...`);
      
      // Soạn và gửi email bằng Resend
      await resend.emails.send({
        from: 'Todo App <onboarding@resend.dev>', // Resend yêu cầu dùng domain này cho gói miễn phí
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
      console.error(`Failed to send email for UID: ${uid}`, error);
    }
  }
}

// Chạy hàm
sendReminders();