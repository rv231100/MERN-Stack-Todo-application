import React from "react";

const TaskOverview = ({ stats }) => {
  const total = stats.total || 1;
  const todoPercentage = Math.round((stats.todo / total) * 100);
  const progressPercentage = Math.round((stats.inProgress / total) * 100);
  const completedPercentage = Math.round((stats.completed / total) * 100);

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div>
          <h2>Task Overview</h2>
          <p>Current Task Distribution</p>
        </div>
      </div>

      <div className="overview-content">
        <div className="overview-circle">
          <strong>{stats.total}</strong>
          <span>Total Tasks</span>
        </div>
        <div className="overview-list">
          <div>
            <span className="overview-dot todo" />
            <span>To Do</span>
            <strong>
              {stats.todo} ({todoPercentage}%)
            </strong>
          </div>
          <div>
            <span className="overview-dot progress" />
            <span>In Progress</span>
            <strong>
              {stats.inProgress} ({progressPercentage}%)
            </strong>
          </div>
          <div>
            <span className="overview-dot completed" />
            <span>Completed</span>
            <strong>
              {stats.completed} ({completedPercentage}%)
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskOverview;
