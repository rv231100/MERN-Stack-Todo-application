import {
  CalendarDays,
  MoreVertical,
  Pencil,
  Trash2,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No due date";

  return (
    <article className="task-card">
      <div className="task-card-top">
        <span className={`task-status-badge ${task.status}`}>
          {task.status === "todo"
            ? "To Do"
            : task.status === "in-progress"
              ? "In Progress"
              : "Completed"}
        </span>

        <div className="task-actions">
          <button
            type="button"
            aria-label={`Edit ${task.title}`}
            title="Edit task"
            onClick={() => onEdit(task)}>
            <Pencil size={16} />
          </button>

          <button
            type="button"
            aria-label={`Delete ${task.title}`}
            title="Delete task"
            onClick={() => onDelete(task)}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h3 className={task.status === "completed" ? "task-done" : ""}>
        {task.title}
      </h3>

      <p className="task-description">
        {task.description || "No description provided."}
      </p>

      <div className="task-card-meta">
        <span className={`priority-badge ${task.priority}`}>
          {task.priority}
        </span>

        <span className="task-category">{task.category || "General"}</span>
      </div>

      <div className="task-card-footer">
        <span>
          <CalendarDays size={15} />
          {dueDate}
        </span>

        <button
          type="button"
          className="task-complete-button"
          onClick={() => onToggleComplete(task)}>
          {task.status === "completed" ? (
            <>
              <RotateCcw size={15} />
              Reopen
            </>
          ) : (
            <>
              <CheckCircle2 size={15} />
              Complete
            </>
          )}
        </button>
      </div>
    </article>
  );
};

export default TaskCard;
