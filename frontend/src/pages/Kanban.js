import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, RefreshCw } from "lucide-react";

import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../features/tasks/taskSlice";

import TaskModal from "../features/tasks/TaskModal";
import KanbanCard from "../features/tasks/KanbanCard";

const columns = [
  {
    id: "todo",
    title: "To Do",
    description: "Tasks waiting to start",
  },
  {
    id: "in-progress",
    title: "In Progress",
    description: "Tasks being worked on",
  },
  {
    id: "completed",
    title: "Completed",
    description: "Finished tasks",
  },
];

const Kanban = () => {
  const dispatch = useDispatch();

  const { tasks, loading, error, totalTasks } = useSelector(
    (state) => state.tasks,
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [movingTaskId, setMovingTaskId] = useState(null);
  const [actionError, setActionError] = useState("");

  // Fetch up to 100 tasks for this board.
  const loadBoard = useCallback(() => {
    return dispatch(
      fetchTasks({
        page: 1,
        limit: 100,
        sortBy: "createdAt",
        order: "desc",
      }),
    ).unwrap();
  }, [dispatch]);

  useEffect(() => {
    loadBoard().catch(() => {
      // The Redux slice stores the fetch error.
    });
  }, [loadBoard]);

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

  // Create a new task or update an existing one.
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

      await loadBoard();
    } catch (error) {
      setActionError(typeof error === "string" ? error : "Unable to save task");

      throw error;
    } finally {
      setSaving(false);
    }
  };

  // Move a task to another status.
  const handleMoveTask = async (task, newStatus) => {
    setMovingTaskId(task._id);
    setActionError("");

    try {
      await dispatch(
        updateTask({
          id: task._id,
          updates: { status: newStatus },
        }),
      ).unwrap();

      await loadBoard();
    } catch (error) {
      setActionError(typeof error === "string" ? error : "Unable to move task");
    } finally {
      setMovingTaskId(null);
    }
  };

  // Delete a task after confirmation.
  const handleDeleteTask = async (task) => {
    const confirmed = window.confirm(`Delete "${task.title}" permanently?`);

    if (!confirmed) return;

    setActionError("");

    try {
      await dispatch(deleteTask(task._id)).unwrap();
      await loadBoard();
    } catch (error) {
      setActionError(
        typeof error === "string" ? error : "Unable to delete task",
      );
    }
  };

  // Put each task into its matching column.
  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <section className="kanban-page">
      <div className="kanban-page-header">
        <div>
          <h1>Kanban Board</h1>
          <p>Track your tasks from start to completion.</p>
        </div>

        <div className="kanban-header-actions">
          <button
            type="button"
            className="button-secondary"
            onClick={() => loadBoard().catch(() => {})}
            disabled={loading}>
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            type="button"
            className="button-primary"
            onClick={openCreateModal}>
            <Plus size={18} />
            Add Task
          </button>
        </div>
      </div>

      {actionError && (
        <p className="task-error" role="alert">
          {actionError}
        </p>
      )}

      {error && (
        <p className="task-error" role="alert">
          {error}
        </p>
      )}

      {loading && tasks.length === 0 ? (
        <div className="tasks-message">Loading board...</div>
      ) : (
        <div className="kanban-board">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.id);

            return (
              <section className={`kanban-column ${column.id}`} key={column.id}>
                <div className="kanban-column-header">
                  <div>
                    <h2>{column.title}</h2>
                    <p>{column.description}</p>
                  </div>

                  <span className="kanban-count">{columnTasks.length}</span>
                </div>

                <div className="kanban-column-content">
                  {columnTasks.length === 0 ? (
                    <div className="kanban-empty">No tasks here yet.</div>
                  ) : (
                    columnTasks.map((task) => (
                      <KanbanCard
                        key={task._id}
                        task={task}
                        onEdit={openEditModal}
                        onDelete={handleDeleteTask}
                        onMove={handleMoveTask}
                        moving={movingTaskId === task._id}
                      />
                    ))
                  )}
                </div>

                <button
                  type="button"
                  className="kanban-add-button"
                  onClick={openCreateModal}>
                  <Plus size={16} />
                  Add Task
                </button>
              </section>
            );
          })}
        </div>
      )}

      {totalTasks > tasks.length && (
        <p className="kanban-limit-notice">
          Showing {tasks.length} tasks out of {totalTasks}. The board currently
          loads up to 100 tasks; pagination can be added for larger task
          collections.
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

export default Kanban;
