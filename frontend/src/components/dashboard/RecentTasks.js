import { CheckCircle2, Circle } from "lucide-react";
import React from "react";

const RecentTasks = ({ tasks, loading }) => {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div>
          <h2>My Tasks</h2>
          <p>Recent Created Tasks</p>
        </div>
        {/* <button className="ciew-all-button">View all →</button> */}
      </div>
      <div className="recent-task-list">
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          tasks.map((task) => (
            <div className="recent-task" key={task._id}>
              <div className="task-check">
                {task.status === "completed" ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <Circle size={20} />
                )}
              </div>
              <div className="task-main">
                <h3>{task.title}</h3>
                <div className="task-meta">
                  <span className={`priority-badge ${task.priority}`}>
                    {task.priority}
                  </span>
                  <span>{task.category}</span>
                </div>
              </div>
              <div className="task-status">{task.status}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentTasks;
