[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/YHSq4TPZ)
# To-Do App – Preliminary Assignment Submission

👀 Please Check ASSIGNMENT.md file in this repository for assignment requirements.

## 🚀 Project Setup & Usage
**How to install and run your project:**    
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/khanhduy2311/TODO-APP
    cd TODO-APP
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up Firebase Environment Variables:**
    - Create a `.env` file in the root directory of the project.
    - Add your Firebase project configuration to the `.env` file. **Important:** All variable names must start with `VITE_`.
      ```
      VITE_API_KEY="AIzaSy..."
      VITE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
      VITE_PROJECT_ID="your-project-id"
      VITE_STORAGE_BUCKET="your-project-id.appspot.com"
      VITE_MESSAGING_SENDER_ID="..."
      VITE_APP_ID="..."
      ```
4.  **Run the project:**
    ```bash
    npm run dev
    ```
The application will be running on `http://localhost:5173`.

## 🔗 Deployed Web URL or APK file
    https://naver-todo-app.vercel.app/


## 🎥 Demo Video
**Demo video link (≤ 2 minutes):**  
📌 **Video Upload Guideline:** when uploading your demo video to YouTube, please set the visibility to **Unlisted**.  
- “Unlisted” videos can only be viewed by users who have the link.  
- The video will not appear in search results or on your channel.  
- Share the link in your README so mentors can access it.  

✍️ [Your YouTube Demo Video Link Here]


## 💻 Project Introduction

### a. Overview

 This is a modern, dynamic To-Do web application designed to help users manage their daily tasks efficiently. Built with React and powered by Firebase, the app provides a seamless, real-time experience where users can sign up, log in, and manage their own personal task lists. The data is securely stored online, ensuring that a user's tasks are always synchronized across sessions.

### b. Key Features & Function Manual
*   **User Authentication:**
    *   **Sign Up:** Users can create a new account using their name, email, and password.
    *   **Sign In:** Registered users can log in to access their personal task list.
    *   **Persistent Login:** Users remain logged in even after closing the browser tab, ensuring a smooth return experience.

*   **Task Management:**
    *   **Add Task:** Users can add new tasks with a description and an optional due date.
    *   **Mark as Complete:** Tasks can be toggled between complete and incomplete with a single click. Completed tasks are visually distinguished with a strikethrough.
    *   **Edit Task:** Existing tasks can be easily edited to update their text or due date.
    *   **Delete Task:** Unwanted tasks can be permanently deleted.

*   **Interactive Calendar:**
    *   A full-month calendar view allows users to navigate between months.
    *   Days with scheduled tasks are marked with a dot, providing a quick overview of busy days.
    *   Clicking on a specific day filters the task list to show only the tasks due on that day.

*   **Real-time Experience:**
    *   All changes (add, edit, delete, complete) are reflected on the UI instantly without needing a page reload, thanks to Optimistic UI updates and Firebase's real-time listeners.
    *   Toast notifications provide immediate feedback for user actions.

### c. Unique Features (What’s special about this app?) 

*   **Fully User-Centric and Secure:** Unlike simple local storage apps, each user's data is tied to their account and stored securely in Firestore. This creates a truly personal and persistent experience.
*   **Integrated Calendar View:** The calendar is not just a date picker but a core part of the UI, providing an intuitive way for users to visualize and navigate their schedule.
*   **Optimistic UI for a "Snappy" Feel:** The application updates the user interface *immediately* upon user action (e.g., ticking a task) while simultaneously sending the update to the server. This eliminates perceived network lag and makes the app feel incredibly responsive.
*   **Modern Animated Authentication UI:** The login and registration process features a sleek, animated sliding panel, offering a polished and professional first impression.

### d. Technology Stack and Implementation Methods

*   **Frontend:**
    *   **React:** For building the dynamic and component-based user interface.
    *   **Vite:** As the build tool for a fast and modern development experience.
    *   **CSS:** Custom styling with CSS Variables for maintainability and future theming (e.g., Dark Mode).
*   **Backend (Backend-as-a-Service):**
    *   **Firebase Authentication:** To handle user registration, login, and session management.
    *   **Cloud Firestore:** A NoSQL, real-time database used to store and sync user-specific to-do items.
*   **Libraries:**
    *   `react-toastify`: For providing non-intrusive user feedback notifications.

### e. Service Architecture & Database structure (when used)

*   **Service Architecture:** The application follows a **serverless architecture** using Firebase's Backend-as-a-Service (BaaS) model. The React client communicates directly with Firebase services (Authentication and Firestore) without the need for a custom-managed backend server.

    ```
    Client (React App) <--> Firebase SDK <--> Firebase Services (Auth, Firestore)
    ```

*   **Database Structure (Firestore):**
    The database consists of a single top-level collection named `todos`. Each document within this collection represents a single to-do item and has the following structure:

    ```json
    {
      "uid": "string",          // User ID from Firebase Auth, links task to a user
      "text": "string",         // The content of the task
      "dueDate": "string",      // Due date in 'YYYY-MM-DD' format
      "completed": "boolean",   // True if the task is done, false otherwise
      "createdAt": "Timestamp"  // The server timestamp when the task was created
    }
    ```
    A composite index on `uid` (ascending) and `createdAt` (descending) is required for querying and sorting user-specific tasks.

## 🧠 Reflection

### a. If you had more time, what would you expand?
 If I had more time, I would focus on enhancing productivity and user experience with the following features:
*   **Task Prioritization:** Allow users to set a priority level (e.g., Low, Medium, High) for each task, visualized with different colors.
*   **Multiple Projects/Lists:** Enable users to create different lists (e.g., "Work," "Personal," "Shopping") to better organize their tasks.
*   **Dark/Light Mode:** Implement a theme toggle to improve usability in different lighting conditions.
*   **Recurring Tasks:** Add an option to create tasks that repeat daily, weekly, or monthly.
*   **Drag-and-Drop Reordering:** Allow users to manually reorder tasks within a list to reflect their priority.

### b. If you integrate AI APIs more for your app, what would you do?
 Integrating AI could transform this To-Do app into a smart assistant. I would explore:
*   **Smart Task Parsing (NLP):** Use an AI API like a Google Gemini or OpenAI model to allow users to add tasks using natural language. For example, typing "Submit report by Friday 5pm" would automatically create a task named "Submit report" with the correct due date and time.
*   **Automatic Task Categorization:** An AI could analyze the text of a new task and automatically suggest adding it to the correct project (e.g., "Buy milk" -> "Shopping" list).
*   **AI-Powered Task Breakdown:** For a large, complex task like "Plan team offsite," an AI could suggest a checklist of common sub-tasks (e.g., "Set a budget," "Find a venue," "Send invitations").

## ✅ Checklist
- [x] Code runs without errors  
- [x] All required features implemented (add/edit/delete/complete tasks)  
- [x] All ✍️ sections are filled
