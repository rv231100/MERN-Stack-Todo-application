//====================
//create task
// post /api/tasks
//protected route

import { taskModel } from "../models/Task.js";

//=====================
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, category, dueDate } =
      req.body;
    //validate required field
    if (!title) {
      return res.status(400).json({
        msg: "Task title is required",
      });
    }
    const task = await taskModel.create({
      title,
      description,
      status,
      priority,
      category,
      dueDate,
      user: req.user._id,
    });
    res.status(201).json({
      msg: "Task created successfully",
      task,
    });
  } catch (err) {
    console.error("create task error: ", err);
    res.status(500).json({
      msg: "Server error",
    });
  }
};

// GET /api/tasks
// Search, filter, sort and paginate the logged-in user's tasks

const getTasks = async (req, res) => {
  try {
    // 1. Read query parameters from the URL.
    const {
      search = "",
      status,
      priority,
      category,
      sortBy = "createdAt",
      order = "desc",
      page = "1",
      limit = "10",
    } = req.query;

    // 2. Validate pagination values.
    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));

    // 3. Always restrict the query to the logged-in user.
    const filter = {
      user: req.user._id,
    };

    // 4. Filter by status, if provided.
    const allowedStatuses = ["todo", "in-progress", "completed"];

    if (status && allowedStatuses.includes(status)) {
      filter.status = status;
    } else if (status) {
      return res.status(400).json({
        message: "Invalid status filter",
      });
    }

    // 5. Filter by priority, if provided.
    const allowedPriorities = ["low", "medium", "high"];

    if (priority && allowedPriorities.includes(priority)) {
      filter.priority = priority;
    } else if (priority) {
      return res.status(400).json({
        message: "Invalid priority filter",
      });
    }

    // 6. Filter by category, if provided.
    if (category && category.trim()) {
      filter.category = category.trim();
    }

    // 7. Search title and description.
    if (search.trim()) {
      // Escape regex characters so user input is treated literally.
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        { title: { $regex: escapedSearch, $options: "i" } },
        {
          description: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      ];
    }

    // 8. Allow only supported sort fields.
    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "dueDate",
      "title",
      "priority",
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const safeOrder = order === "asc" ? 1 : -1;

    // 9. Calculate how many documents to skip.
    const skip = (currentPage - 1) * pageSize;

    // 10. Count all matching tasks before pagination.
    const totalTasks = await taskModel.countDocuments(filter);

    // 11. Sort tasks.
    let tasks;

    if (safeSortBy === "priority") {
      // MongoDB needs a custom rank for priority values.
      tasks = await taskModel.aggregate([
        { $match: filter },
        {
          $addFields: {
            priorityRank: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ["$priority", "high"] },
                    then: 3,
                  },
                  {
                    case: { $eq: ["$priority", "medium"] },
                    then: 2,
                  },
                  {
                    case: { $eq: ["$priority", "low"] },
                    then: 1,
                  },
                ],
                default: 0,
              },
            },
          },
        },
        {
          $sort: {
            priorityRank: safeOrder,
            createdAt: -1,
            _id: 1,
          },
        },
        { $skip: skip },
        { $limit: pageSize },
        { $project: { priorityRank: 0 } },
      ]);
    } else {
      const sortOptions = {
        [safeSortBy]: safeOrder,
        _id: 1,
      };

      tasks = await taskModel
        .find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize)
        .lean();
    }

    // 12. Return the tasks and pagination metadata.
    res.status(200).json({
      tasks,
      totalTasks,
      currentPage,
      totalPages: Math.ceil(totalTasks / pageSize),
      pageSize,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
};

//=======
//get task statistics
//get api/tasks/stats
//protected route
//=================
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const [
      total,
      todo,
      inProgress,
      completed,
      highPriority,
      mediumPriority,
      lowPriority,
    ] = await Promise.all([
      taskModel.countDocuments({
        user: userId,
      }),
      taskModel.countDocuments({
        user: userId,
        status: "todo",
      }),
      taskModel.countDocuments({
        user: userId,
        status: "in-progress",
      }),
      taskModel.countDocuments({
        user: userId,
        status: "completed",
      }),
      taskModel.countDocuments({
        user: userId,
        status: "high",
      }),
      taskModel.countDocuments({
        user: userId,
        status: "medium",
      }),
      taskModel.countDocuments({
        user: userId,
        status: "low",
      }),
    ]);

    return res.status(200).json({
      stats: {
        total,
        todo,
        inProgress,
        completed,
        highPriority,
        mediumPriority,
        lowPriority,
      },
    });
  } catch (err) {
    console.error("get tasks stats error: ", err);

    return res.status(500).json({
      msg: "Server Error",
    });
  }
};

//=========================
//get recent tasks
//get api/tasks/recent
//protected route
//===================

const getRecentTasks = async (req, res) => {
  try {
    const requestedLimit = Number(req.query.limit) || 5;
    const limit = Math.min(Math.max(requestedLimit, 1), 20);

    const tasks = await taskModel
      .find({
        user: req.user._id,
      })
      .sort({
        createdAt: -1,
      })
      .limit(limit);

    return res.status(200).json({
      count: tasks.length,
      tasks,
    });
  } catch (err) {
    console.error("get recent tasks error: ", err);
    return res.status(500).json({
      msg: "server error",
    });
  }
};

//==========================
//get single task
//get /api/tasks/:id
//protected route
//================

const getTaskById = async (req, res) => {
  try {
    const task = await taskModel.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        msg: "Task not found or unauthorized",
      });
    }

    return res.status(200).json({
      task,
    });
  } catch (err) {
    console.error("get task by id error: ", err);
    //invalid mongodb objectId
    if (err.name === "CastError") {
      res.status(404).json({
        msg: "Task not found or unauthorized",
      });
    }
    res.status(500).json({
      msg: "Server error",
    });
  }
};

//================
//update task
//put /api/tasks/:id
//protected route

//================
const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, category, dueDate } =
      req.body;

    const task = await taskModel.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        msg: "Task not found or unauthorized",
      });
    }
    //update only allowed fields
    if (title !== undefined) {
      task.title = title;
    }
    if (description !== undefined) {
      task.description = description;
    }
    if (status !== undefined) {
      task.status = status;
    }
    if (priority !== undefined) {
      task.priority = priority;
    }
    if (category !== undefined) {
      task.category = category;
    }
    if (dueDate !== undefined) {
      task.dueDate = dueDate;
    }

    const updateTask = await task.save();

    return res.status(200).json({
      msg: "Task updated successfully ",
      task: updateTask,
    });
  } catch (err) {
    console.error("update task error: ", err);
    //invalid mongodb objectId
    if (err.name === "CastError") {
      return res.status(404).json({
        msg: "Task not found or unauthorized",
      });
    }

    //mongoose validation error
    if (err.name === "ValidationError") {
      res.status(500).json({
        msg: err.message,
      });
    }

    res.status(500).json({
      msg: "Server error",
    });
  }
};

//delete task
//delete /api/tasks/:id
//protected route
const deleteTask = async (req, res) => {
  try {
    const task = await taskModel.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!task) {
      return res.status(404).json({
        msg: "Task not found or unauthorized",
      });
    }
    res.status(200).json({
      msg: "Task deleted successfully",
      task,
    });
  } catch (err) {
    console.error("delete task error: ", err);
    //invalid mongodb objectId
    if (err.name === "CastError") {
      return res.status(404).json({
        msg: "Task not found or unauthorized",
      });
    }
    res.status(500).json({
      msg: "Server error",
    });
  }
};

export {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
  getRecentTasks,
};
