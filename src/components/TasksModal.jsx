import { useMemo } from 'react';
import TodoItem from './TodoItem';

function TasksModal({ isOpen, onClose, todos, toggleTodo, deleteTodo }) {
  // Sắp xếp tasks theo deadline (gần đến xa)
  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => {
      // Tasks không có deadline sẽ xuống cuối
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      
      // So sánh deadline
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }, [todos]);

  // Nhóm tasks theo trạng thái
  const groupedTodos = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return sortedTodos.reduce((groups, todo) => {
      if (todo.completed) {
        groups.completed.push(todo);
      } else if (!todo.dueDate) {
        groups.noDeadline.push(todo);
      } else {
        const dueDate = new Date(todo.dueDate);
        const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
        
        if (dueDateOnly < today) {
          groups.overdue.push(todo);
        } else if (dueDateOnly.getTime() === today.getTime()) {
          groups.today.push(todo);
        } else {
          // Tính số ngày còn lại
          const diffTime = dueDateOnly - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays <= 7) {
            groups.thisWeek.push(todo);
          } else {
            groups.later.push(todo);
          }
        }
      }
      return groups;
    }, {
      overdue: [],
      today: [],
      thisWeek: [],
      later: [],
      noDeadline: [],
      completed: []
    });
  }, [sortedTodos]);

  if (!isOpen) return null;

  const TaskGroup = ({ title, tasks, className = "" }) => {
    if (tasks.length === 0) return null;
    
    return (
      <div className={`task-group ${className}`}>
        <h3 className="task-group-title">
          {title} ({tasks.length})
        </h3>
        <ul className="task-group-list">
          {tasks.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
            />
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content tasks-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📋 Tất cả công việc</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="modal-body">
          {sortedTodos.length === 0 ? (
            <div className="empty-state">
              <p>🎉 Bạn chưa có công việc nào!</p>
              <p>Hãy thêm công việc mới để bắt đầu.</p>
            </div>
          ) : (
            <div className="tasks-container">
              <TaskGroup 
                title="🚨 Quá hạn" 
                tasks={groupedTodos.overdue} 
                className="overdue-group"
              />
              
              <TaskGroup 
                title="📅 Hôm nay" 
                tasks={groupedTodos.today} 
                className="today-group"
              />
              
              <TaskGroup 
                title="📆 Tuần này" 
                tasks={groupedTodos.thisWeek} 
                className="thisweek-group"
              />
              
              <TaskGroup 
                title="📋 Sau này" 
                tasks={groupedTodos.later} 
                className="later-group"
              />
              
              <TaskGroup 
                title="⏰ Không có deadline" 
                tasks={groupedTodos.noDeadline} 
                className="no-deadline-group"
              />
              
              <TaskGroup 
                title="✅ Đã hoàn thành" 
                tasks={groupedTodos.completed} 
                className="completed-group"
              />
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <div className="tasks-summary">
            Tổng cộng: <strong>{todos.length}</strong> công việc |
            Hoàn thành: <strong>{groupedTodos.completed.length}</strong> |
            Còn lại: <strong>{todos.length - groupedTodos.completed.length}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TasksModal;