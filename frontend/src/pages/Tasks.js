import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchTasks } from "../features/tasks/taskSlice";
import TaskFilters from "../components/tasks/TaskFilters";
import TaskCard from "../components/tasks/TaskCard";
import { Plus } from "lucide-react";

import {
  createTask,
  updateTask,
  deleteTask,
} from "../features/tasks/taskSlice";

import TaskModal from "../features/tasks/TaskModal";
const initialFilters = {
  search: "",
  status: "",
  priority: "",
  category: "",
  sortBy: "createdAt",
  order: "desc",
};

const Tasks = () => {
  // ==========================
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  const openCreateModal = () => {
    setSelectedTask(null);
    setActionError("");
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setActionError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setSelectedTask(null);
  };

  const handleSaveTask = async (payload) => {
    setSaving(true);
    setActionError("");

    try {
      if (selectedTask) {
        await dispatch(
          updateTask({
            id: selectedTask._id,
            updates: payload,
          }),
        ).unwrap();
      } else {
        await dispatch(createTask(payload)).unwrap();
      }

      setModalOpen(false);
      setSelectedTask(null);
      setPage(1);

      // Refresh the correct filtered, sorted list.
      await dispatch(
        fetchTasks({
          ...filters,
          page: 1,
          limit: pageSize,
        }),
      ).unwrap();
    } catch (error) {
      setActionError(typeof error === "string" ? error : "Unable to save task");
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async (task) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`,
    );

    if (!confirmed) return;

    setActionError("");

    try {
      await dispatch(deleteTask(task._id)).unwrap();

      // Refresh because the current page might now be empty.
      await dispatch(
        fetchTasks({
          ...filters,
          page,
          limit: pageSize,
        }),
      ).unwrap();
    } catch (error) {
      setActionError(
        typeof error === "string" ? error : "Unable to delete task",
      );
    }
  };

  const handleToggleComplete = async (task) => {
    const newStatus = task.status === "completed" ? "todo" : "completed";

    setActionError("");

    try {
      await dispatch(
        updateTask({
          id: task._id,
          updates: { status: newStatus },
        }),
      ).unwrap();

      await dispatch(
        fetchTasks({
          ...filters,
          page,
          limit: pageSize,
        }),
      ).unwrap();
    } catch (error) {
      setActionError(
        typeof error === "string" ? error : "Unable to update task",
      );
    }
  };

  // =============================

  const dispatch = useDispatch();

  const { tasks, loading, error, totalTasks, currentPage, totalPages } =
    useSelector((state) => state.tasks);

  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const pageSize = 9;

  // Update one filter and return to page 1.
  const handleFilterChange = (name, value) => {
    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPage(1);
  };

  // Reset all filters.
  const handleReset = () => {
    setFilters(initialFilters);
    setPage(1);
  };

  // Request tasks whenever the filters or page change.
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        fetchTasks({
          ...filters,
          page,
          limit: pageSize,
        }),
      );
    }, 300);

    // Debounce search and cancel outdated scheduled requests.
    return () => clearTimeout(timer);
  }, [dispatch, filters, page]);

  return (
    <section className="tasks-page">
      <div className="tasks-page-header">
        <div>
          <h1>All Tasks</h1>
          <p>Manage, search and organize your tasks.</p>
        </div>

        <button
          type="button"
          className="button-primary"
          onClick={openCreateModal}>
          <Plus size={18} />
          Add Task
        </button>
      </div>

      <TaskFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      <div className="tasks-results-header">
        <h2>Your Tasks</h2>

        <span>
          {totalTasks} {totalTasks === 1 ? "task" : "tasks"}
        </span>
      </div>

      {error && (
        <p className="task-error" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <div className="tasks-message">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="tasks-empty">
          <h3>No tasks found</h3>
          <p>Try changing your search or filters.</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={openEditModal}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </div>
      )}

      {!loading && totalPages > 0 && (
        <div className="pagination">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setPage((previous) => previous - 1)}>
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((previous) => previous + 1)}>
            Next
          </button>
        </div>
      )}

      {actionError && (
        <p className="task-error" role="alert">
          {actionError}
        </p>
      )}

      <TaskModal
        isOpen={modalOpen}
        task={selectedTask}
        onClose={closeModal}
        onSubmit={handleSaveTask}
        saving={saving}
      />
    </section>
  );
};

export default Tasks;
