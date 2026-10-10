import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecentTasks, fetchTaskStats } from "../features/tasks/taskSlice";
import { CheckSquare, CircleCheck, Clock, Plus } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import TaskOverview from "../components/dashboard/TaskOverview";
import RecentTasks from "../components/dashboard/RecentTasks";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, recentTasks, statsLoading, recentLoading } = useSelector(
    (state) => state.tasks,
  );

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTaskStats());
    dispatch(fetchRecentTasks(5));
  }, [dispatch]);

  return (
    <div className="dashboard-page">
      {/* page-header */}
      <div className="dashboard-header">
        <div>
          {/* <h1>Good Morning, User👋</h1> */}
          <h1>Good Morning, {user ? user?.name : "User" || "User"}!👋</h1>
          <p>Here's what's happening with your tasks today.</p>
        </div>
        {/* <button className="primary-button">
          <Plus size={18} />
          Add Task
        </button> */}
      </div>
      {/* stats cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          icon={<CheckSquare size={20} />}
          type="total"
          loading={statsLoading}
        />
        <StatCard
          title="Pending"
          value={stats.todo}
          icon={<Clock size={20} />}
          type="pending"
          loading={statsLoading}
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={<Clock size={20} />}
          type="progress"
          loading={statsLoading}
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={<CircleCheck size={20} />}
          type="completed"
          loading={statsLoading}
        />
      </div>
      {/* dashboard-content */}
      <div className="dashboard-grid">
        <TaskOverview stats={stats} />
        <RecentTasks tasks={recentTasks} loading={recentLoading} />
      </div>
    </div>
  );
};

export default Dashboard;
