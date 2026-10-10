import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/axios";

//get dashboard statistics
export const fetchTaskStats = createAsyncThunk(
  "tasks/fetchTaskStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/tasks/stats");
      console.log("fetch-tasks-stats: ", response.data.stats);

      return response?.data?.stats;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "failed to fetch tasts statistics",
      );
    }
  },
);

//============
//get recent tasks
//================
export const fetchRecentTasks = createAsyncThunk(
  "tasks/fetchRecentTasks",
  async (limit = 5, { rejectWithValue }) => {
    try {
      const response = await api.get(`/tasks/recent?limit=${limit}`);

      return response?.data?.tasks;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "failed to fetch recent tasks",
      );
    }
  },
);

//===============
//get all tasks
//================

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/tasks", {
        params,
      });
      console.log("fetch-task: ", response?.data);

      return response?.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "failed to fetch tasks",
      );
    }
  },
);

// CREATE
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await api.post("/tasks", taskData);
      return response.data.task;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create task",
      );
    }
  },
);
// UPDATE
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/tasks/${id}`, updates);
      return response?.data?.task;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task",
      );
    }
  },
);

// DELETE
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete task",
      );
    }
  },
);

const initialState = {
  tasks: [],
  recentTasks: [],
  stats: {
    total: 0,
    todo: 0,
    inProgress: 0,
    completed: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
  },
  totalTasks: 0,
  currentPage: 1,
  totalPages: 0,
  loading: false,
  statsLoading: false,
  recentLoading: false,
  pageSize: 9,
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    //===
    //Statistics
    //====
    builder
      .addCase(fetchTaskStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchTaskStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action?.payload;
      })
      .addCase(fetchTaskStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action?.payload;
      });
    //=======
    //recent tasks
    //=========

    builder
      .addCase(fetchRecentTasks.pending, (state, action) => {
        state.recentLoading = true;
      })
      .addCase(fetchRecentTasks.fulfilled, (state, action) => {
        state.recentLoading = false;
        state.recentTasks = action?.payload;
      })
      .addCase(fetchRecentTasks.rejected, (state, action) => {
        state.recentLoading = false;
        state.error = action?.payload;
      });

    //====
    //all tasks
    //========
    builder
      .addCase(fetchTasks.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.tasks = action?.payload?.tasks;
        state.totalTasks = action?.payload?.totalTasks;
        state.currentPage = action?.payload?.currentPage;
        state.totalPages = action?.payload?.totalPages;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      // CREATE
      .addCase(createTask.pending, (state) => {
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.error = null;

        // The next fetch will populate the correct sorted/filtered page.
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateTask.pending, (state) => {
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.error = null;

        const updatedTask = action.payload;
        const index = state.tasks.findIndex(
          (task) => task._id === updatedTask._id,
        );

        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteTask.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.error = null;

        state.tasks = state.tasks.filter((task) => task._id !== action.payload);

        state.totalTasks = Math.max(0, state.totalTasks - 1);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
