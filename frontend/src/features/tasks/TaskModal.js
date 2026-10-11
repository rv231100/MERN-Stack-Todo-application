import { useEffect, useState } from "react";
import { Calendar, CalendarCheck2Icon, TimerIcon, X } from "lucide-react";

const emptyForm = {
  title: "",
  description: "",
  priority: "medium",
  category: "General",
  dueDate: "",
  status: "todo",
};

const TaskModal = ({ isOpen, task, onClose, onSubmit, saving }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const isEditing = Boolean(task);

  useEffect(() => {
    if (!isOpen) return;

    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        category: task.category || "General",
        status: task.status || "todo",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().slice(0, 10)
          : "",
      });
    } else {
      setFormData(emptyForm);
    }

    setFormError("");
  }, [isOpen, task]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      setFormError("Please enter a task title.");
      return;
    }

    setFormError("");

    const payload = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category.trim() || "General",
      dueDate: formData.dueDate || null,
    };

    try {
      await onSubmit(payload);
    } catch {
      // The parent displays the API error.
    }
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}>
      <section
        className="task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title">
        <div className="task-modal-header">
          <h2 id="task-modal-title">
            {isEditing ? "Edit Task" : "Add New Task"}
          </h2>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            disabled={saving}
            aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="task-title">Title *</label>
          <input
            id="task-title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            maxLength={150}
            required
          />

          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description (optional)"
            rows={3}
            maxLength={2000}
          />

          <div className="task-modal-row">
            <div>
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="task-due-date">Due date</label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}>
                <input
                  id="task-due-date"
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                />

                <div
                  style={{
                    position: "absolute",
                    right: "1rem",
                  }}>
                  <CalendarCheck2Icon size={19} />
                  <span>→</span>
                </div>
              </div>
            </div>
          </div>

          <label htmlFor="task-category">Category</label>
          <input
            id="task-category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g. Work, Personal, Study"
            maxLength={50}
          />

          <label htmlFor="task-status">Status</label>
          <select
            id="task-status"
            name="status"
            value={formData.status}
            onChange={handleChange}>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {formError && (
            <p className="task-error" role="alert">
              {formError}
            </p>
          )}

          <div className="task-modal-actions">
            <button
              type="button"
              className="button-secondary"
              onClick={onClose}
              disabled={saving}>
              Cancel
            </button>

            <button type="submit" className="button-primary" disabled={saving}>
              {saving ? "Saving..." : isEditing ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default TaskModal;
