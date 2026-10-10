import { CalendarDays, Pencil, Trash2, ArrowRight } from "lucide-react";

const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const KanbanCard = ({ task, onEdit, onDelete, onMove, moving }) => {
  const nextStatuses = statusOptions.filter(
    (option) => option.value !== task.status,
  );

  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No due date";

  return (
    <article className="kanban-card">
      <div className="kanban-card-top">
        <span className={`priority-badge ${task.priority}`}>
          {task.priority}
        </span>

        <div className="kanban-card-actions">
          <button
            type="button"
            title="Edit task"
            aria-label={`Edit ${task.title}`}
            onClick={() => onEdit(task)}>
            <Pencil size={15} />
          </button>

          <button
            type="button"
            title="Delete task"
            aria-label={`Delete ${task.title}`}
            onClick={() => onDelete(task)}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <h3>{task.title}</h3>

      {task.description && (
        <p className="kanban-card-description">{task.description}</p>
      )}

      <div className="kanban-card-category">{task.category || "General"}</div>

      <div className="kanban-card-footer">
        <span>
          <CalendarDays size={14} />
          {dueDate}
        </span>
      </div>

      <div className="kanban-move">
        <label htmlFor={`move-${task._id}`}>Move to</label>

        <select
          id={`move-${task._id}`}
          value=""
          disabled={moving}
          onChange={(event) => {
            const newStatus = event.target.value;

            if (newStatus) {
              onMove(task, newStatus);
            }
          }}>
          <option value="">Choose status...</option>

          {nextStatuses.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ArrowRight size={15} />
      </div>
    </article>
  );
};

export default KanbanCard;
