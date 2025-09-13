[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/YHSq4TPZ)
# To-Do App – Preliminary Assignment Submission

👀 Please Check ASSIGNMENT.md file in this repository for assignment requirements.

## 🚀 Project Setup & Usage
**How to install and run your project:**    
1.  **Clone the repository:**
    ```bash
    https://github.com/NAVER-Vietnam-AI-Hackathon/web-track-naver-vietnam-ai-hackathon-kduyonehitoneAC
    cd web-track-naver-vietnam-ai-hackathon-kduyonehitoneAC

    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up Firebase Environment Variables:**
    - Create a `.env` file in the root directory of the project.
    - Add your Firebase project configuration to the `.env` file. **Important:** All variable names must start with `VITE_`.
      ```
      VITE_API_KEY="your-api-key"
      VITE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
      VITE_PROJECT_ID="your-project-id"
      VITE_STORAGE_BUCKET="your-project-id.appspot.com"
      VITE_MESSAGING_SENDER_ID="your-messaging-sender-id"
      VITE_APP_ID="your-app-id"
      VITE_MEASUREMENT_ID="your-measurement-id"
      ```
4.  **Run the project:**
    ```bash
    npx vercel --prod 
    ```
    After run this code the application will be updating on `https://naver-to-do-app.vercel.app`.

## 🔗 Deployed Web URL or APK file
    https://naver-to-do-app.vercel.app


## 🎥 Demo Video
**Demo video link (≤ 2 minutes):**  
📌 **Video Upload Guideline:** when uploading your demo video to YouTube, please set the visibility to **Unlisted**.  
- “Unlisted” videos can only be viewed by users who have the link.  
- The video will not appear in search results or on your channel.  
- Share the link in your README so mentors can access it.  

✍️ [Your YouTube Demo Video Link Here]


## 💻 Project Introduction

### a. Overview

This is a comprehensive, social-enabled To-Do web application designed to revolutionize personal productivity management. Built with React and powered by Firebase's real-time infrastructure, the app provides a seamless experience where users can not only manage their personal tasks but also connect with friends, chat in real-time, and gain insights into their productivity patterns through advanced analytics. Unlike traditional to-do apps, this platform combines task management with social features and data-driven insights, creating a truly modern productivity ecosystem that keeps users engaged and motivated.

### b. Key Features & Function Manual

**🔐 Advanced Authentication System:**
- **User Registration & Login:** Secure email/password authentication with animated sliding panel UI
- **Persistent Sessions:** Users remain logged in across browser sessions for seamless experience
- **Real-time Presence:** Online/offline status tracking for all users

**✅ Smart Task Management:**
- **Create Tasks:** Add new tasks with descriptions and optional due dates using the intuitive form
- **Interactive Calendar:** Click on any calendar date to filter and view tasks for that specific day
- **Task Completion:** Toggle tasks between complete/incomplete with visual checkbox animations
- **Advanced Notes:** Click on any task to add or edit detailed notes in a popup interface
- **Smart Organization:** Access different task views through the menu (All, Upcoming 7 days, Completed, Overdue)
- **Real-time Synchronization:** All changes instantly reflected across all sessions and devices
- **Automatic Reminders:** All unfinished tasks the next day will be automatically alerted by sending an email to users the night before that day.

**📅 Visual Calendar Integration:**
- **Month Navigation:** Browse through different months with arrow controls
- **Task Indicators:** Visual dots on calendar days (red for pending tasks, green for completed)
- **Date Selection:** Click any date to instantly filter tasks for that day
- **Current Day Highlighting:** Today's date is prominently highlighted for easy reference

**👥 Social & Collaboration Features:**
- **Friend System:** Add friends by email address and build your productivity network
- **Real-time Chat:** Built-in messaging system for communication between friends
- **Online Status Indicators:** See which friends are currently active with visual status dots
- **Friends List:** Convenient sidebar showing all friends with their online/offline status

**📊 Analytics & Insights Dashboard:**
- **Productivity Charts:** Visual bar charts showing daily task completion statistics
- **Habit Streaks:** Track consecutive days of task completion to build momentum
- **Performance Trends:** Line charts displaying completion rate percentages over time
- **Interactive Data:** Click and explore your productivity patterns through Recharts visualizations

**🎨 Premium User Experience:**
- **Dark/Light Mode:** Full theme toggle with smooth transitions and consistent styling
- **Responsive Design:** Seamless experience across desktop, tablet, and mobile devices
- **Optimistic UI:** Instant visual feedback while changes sync to the server
- **Toast Notifications:** Non-intrusive feedback for all user actions

### c. Unique Features (What’s special about this app?) 

**🌟 Social Productivity Platform:** Unlike traditional solo to-do apps, this creates a social ecosystem where users can connect with friends, see their online status, and communicate in real-time, turning productivity into a shared, motivating experience.

**📈 Built-in Analytics Engine:** The integrated analytics dashboard provides users with comprehensive insights into their productivity patterns, habit streaks, and performance trends through beautiful, interactive charts - a feature typically found only in premium productivity suites.

**⚡ Real-time Everything:** Every interaction - from task updates to friend status changes to chat messages - happens in real-time across all devices, creating an incredibly responsive and engaging user experience.

**🎨 Premium Design System:** Features a complete dark/light theme system with smooth animations, optimistic UI updates, and polished interactions that rival commercial applications, all built with custom CSS and modern design principles.

**🔄 Optimistic UI Architecture:** The application updates the user interface immediately upon user actions while simultaneously syncing to the server, eliminating perceived lag and creating an incredibly snappy, desktop-app-like experience in the browser.

**📱 Calendar-Centric Design:** The calendar isn't just a date picker but a core navigation tool, allowing users to visualize their schedule at a glance and click through different days to manage tasks contextually.

### d. Technology Stack and Implementation Methods

**Frontend Technologies:**
- **React 18:** Modern functional components with hooks for dynamic, component-based UI architecture
- **Vite:** Lightning-fast build tool providing optimized development experience and production builds
- **CSS Custom Properties:** Advanced theming system enabling seamless dark/light mode switching
- **Recharts:** Professional data visualization library for interactive analytics charts
- **Responsive CSS Grid/Flexbox:** Modern layout systems ensuring perfect display across all screen sizes

**Backend-as-a-Service (Firebase):**
- **Firebase Authentication:** Comprehensive user management with email/password authentication and session handling
- **Cloud Firestore:** Real-time NoSQL database providing instant data synchronization across all clients
- **Real-time Listeners:** WebSocket-like functionality for live updates without page refreshes
- **Serverless Architecture:** Scalable infrastructure that handles thousands of concurrent users without backend maintenance

**Development Tools & Libraries:**
- **react-toastify:** Elegant, non-intrusive notification system for user feedback
- **Firebase SDK:** Complete integration with Firebase services for authentication, database, and real-time features
- **CSS Modules & Variables:** Maintainable styling architecture with theme support
- **Vite Hot Module Replacement:** Instant development feedback for rapid iteration

**Architecture Patterns:**
- **Real-time State Management:** Complex state synchronization between local UI and remote Firebase data
- **Optimistic UI Updates:** Immediate visual feedback while background sync ensures data consistency
- **Component Composition:** Modular React architecture with reusable, testable components
- **Responsive-First Design:** Mobile-first CSS approach with progressive enhancement for larger screens

### e. Service Architecture & Database structure (when used)
**Service Architecture:**
The application follows a **serverless, real-time architecture** using Firebase's Backend-as-a-Service (BaaS) model. The React client communicates directly with Firebase services through the Firebase SDK, eliminating the need for custom backend servers while providing enterprise-level scalability and real-time capabilities.

```
Client (React App) ↔ Firebase SDK ↔ Firebase Services (Auth, Firestore, Real-time Listeners)
```

**Database Structure (Cloud Firestore):**

**Users Collection** (`users/{userId}`):
```javascript
{
  uid: "firebase-user-id",
  email: "user@example.com",
  displayName: "User Display Name",
  friends: ["friend-uid-1", "friend-uid-2"], // Array of friend user IDs
  online: true, // Real-time presence status
  lastSeen: Timestamp // Server timestamp of last activity
}
```

**Todos Collection** (`todos/{todoId}`):
```javascript
{
  uid: "owner-user-id", // Links task to specific user
  text: "Task description",
  dueDate: "2024-12-25", // Due date in YYYY-MM-DD format
  completed: false, // Task completion status
  note: "Detailed task notes and descriptions",
  createdAt: Timestamp // Server timestamp for sorting and analytics
}
```

**Messages Collection** (`messages/{messageId}`):
```javascript
{
  from: "sender-user-id",
  to: "recipient-user-id",
  chatId: "sorted-uid-combination", // Deterministic chat room ID
  text: "Message content",
  participants: ["user1-id", "user2-id"], // For efficient querying
  createdAt: Timestamp // Message ordering and real-time sync
}
```

**Database Indexes:**
- **Todos:** Composite index on `uid` (ascending) + `createdAt` (descending) for efficient user-specific queries
- **Messages:** Composite index on `chatId` (ascending) + `createdAt` (ascending) for real-time chat ordering
- **Users:** Single field indexes on `email` for friend lookup functionality

This architecture supports real-time data synchronization, offline capability, and can scale to support thousands of concurrent users with sub-second latency.

## 🧠 Reflection

### a. If you had more time, what would you expand?

**Enhanced Productivity Features:**
- **Task Prioritization System:** Implement priority levels (High/Medium/Low) with color-coded visual indicators and smart sorting algorithms to help users focus on what matters most
- **Multi-Project Organization:** Enable users to create separate lists/projects (Work, Personal, Shopping, Learning) with project-specific theming and organization
- **Recurring Task Engine:** Build a sophisticated system for daily, weekly, monthly, and custom recurring tasks with intelligent scheduling
- **Task Dependencies & Subtasks:** Allow users to break down complex projects into manageable subtasks and create dependency chains
- **Time Tracking & Pomodoro:** Integrate built-in time tracking with pomodoro timer functionality for enhanced productivity measurement

**Advanced Social Features:**
- **Collaborative Projects:** Enable shared task lists between friends with real-time collaboration, assignment capabilities, and progress tracking
- **Team Productivity Insights:** Group analytics showing team productivity patterns, workload distribution, and collaborative efficiency metrics
- **Task Assignment & Delegation:** Allow users to assign tasks to friends/team members with notification systems and progress tracking
- **Social Challenges:** Gamification features like productivity challenges between friends, streak competitions, and achievement badges

**Enhanced Analytics & Intelligence:**
- **Advanced Data Visualization:** Productivity heatmaps (GitHub-style), weekly/monthly trend analysis, goal-setting dashboards, and custom report generation
- **Predictive Analytics:** Machine learning models to predict task completion likelihood, optimal scheduling suggestions, and burnout prevention alerts
- **Export & Integration:** PDF report generation, calendar app synchronization (Google Calendar, Outlook), and third-party productivity tool integrations

### b. If you integrate AI APIs more for your app, what would you do?

**Intelligent Task Processing:**
- **Natural Language Understanding:** Integrate OpenAI GPT or Google Gemini to parse natural language inputs like "Submit quarterly report by Friday 5pm" and automatically extract task names, due dates, priorities, and suggested subtasks
- **Smart Task Categorization:** Use AI to analyze task content and automatically suggest appropriate projects/categories, reducing manual organization overhead
- **Intelligent Task Breakdown:** For complex tasks like "Plan team offsite," AI would suggest comprehensive subtask checklists (budget planning, venue research, invitation management, etc.)

**Productivity Intelligence:**
- **Personalized Productivity Coaching:** AI analysis of user patterns to provide personalized recommendations like optimal work schedules, task sequencing, and break timing based on individual productivity rhythms
- **Workload Optimization:** Intelligent daily task allocation based on historical completion rates, estimated effort, and calendar availability to prevent overcommitment
- **Burnout Prevention System:** AI monitoring of work patterns to detect stress indicators and proactively suggest schedule adjustments, break reminders, or task redistributions

**Conversational Interface:**
- **Voice-Activated Task Management:** Integration with speech-to-text APIs for hands-free task creation, updates, and queries ("Add buy groceries to my shopping list," "What are my tasks for tomorrow?")
- **AI Chat Assistant:** Smart chatbot interface that understands context and can help with task planning, deadline management, and productivity advice using conversational AI
- **Smart Notifications:** AI-powered notification timing that learns user preferences and sends reminders at optimal moments when users are most likely to act on them

**Advanced Analytics & Insights:**
- **Predictive Task Management:** AI models that predict task completion likelihood based on historical patterns, helping users make realistic commitments and identify potential delays before they happen
- **Habit Formation Intelligence:** AI analysis of user behavior to suggest habit stacking opportunities, optimal routine timing, and personalized motivation strategies based on behavioral psychology principles


## ✅ Checklist
- [x] Code runs without errors  
- [x] All required features implemented (add/edit/delete/complete tasks)  
- [x] All ✍️ sections are filled  
