import { Search, RotateCcw } from "lucide-react";

const TaskFilters = ({ filters, onChange, onReset }) => {
  return (
    <div className="task-filters">
      {/* Search */}
      <div className="task-search">
        <Search size={18} />

        <input
          type="search"
          placeholder="Search by title or description..."
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
        />
      </div>

      {/* Status */}
      <select
        aria-label="Filter by status"
        value={filters.status}
        onChange={(event) => onChange("status", event.target.value)}>
        <option value="">All statuses</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      {/* Priority */}
      <select
        aria-label="Filter by priority"
        value={filters.priority}
        onChange={(event) => onChange("priority", event.target.value)}>
        <option value="">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {/* Category */}
      <input
        type="text"
        placeholder="Category"
        aria-label="Filter by category"
        value={filters.category}
        onChange={(event) => onChange("category", event.target.value)}
      />

      {/* Sorting */}
      <select
        aria-label="Sort tasks by"
        value={filters.sortBy}
        onChange={(event) => onChange("sortBy", event.target.value)}>
        <option value="createdAt">Date created</option>
        <option value="updatedAt">Recently updated</option>
        <option value="dueDate">Due date</option>
        <option value="title">Title</option>
        <option value="priority">Priority</option>
      </select>

      <select
        aria-label="Sort direction"
        value={filters.order}
        onChange={(event) => onChange("order", event.target.value)}>
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>

      <button type="button" className="reset-filters-button" onClick={onReset}>
        <RotateCcw size={16} />
        Reset
      </button>
    </div>
  );
};

export default TaskFilters;
