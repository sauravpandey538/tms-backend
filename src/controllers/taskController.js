const db = require("../../db");
const { use } = require("../app");
const bcrypt = require("bcryptjs");

// adding
const addTask = async (req, res) => {
  const { title, description, dueDate, doNotify } = req.body;
  const { user } = req;

  if (!user) {
    return res.status(404).json({ message: "No user found" });
  }

  try {
    const task = await db("tasks").insert({
      title,
      description,
      dueDate,
      doNotify,
      author_id: user.id,
    });
    return res.status(201).json({ message: "Task added successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to add task", error: error.message });
  }
};

// fetching
const fetchTask = async (req, res) => {
  const { user } = req;
  console.log("user, :", user);
  try {
    const userDetails = await db("tasks").where("author_id", user.id);

    if (userDetails.length > 0) {
      return res
        .status(200)
        .json({ message: "Tasks fetched successfully", tasks: userDetails });
    } else {
      return res.status(200).json({ message: "No tasks found for this user" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch tasks", error: error.message });
  }
};

// deleting
const deleteTask = async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await db("tasks").where("id", taskId).first();

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await db("tasks").where("id", taskId).del(); // Delete the task

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete task", error: error.message });
  }
};

// updating
const updateTaskDetails = async (req, res) => {
  const { title, description, dueDate, doNotify, id } = req.body;

  try {
    const task = await db("tasks").where("id", id).first();

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = await db("tasks").where("id", id).update({
      title,
      description,
      dueDate,
      doNotify,
    });

    return res
      .status(200)
      .json({ message: "Task updated successfully", updatedTask });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update task", error: error.message });
  }
};

const changeSetting = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email, old password, and new password are required" });
  }

  try {
    const user = await db("users").where({ email }).first();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db("users").where({ email }).update({ password: hashedPassword });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error.message);
    return res.status(500).json({ message: "Failed to update password" });
  }
};

module.exports = {
  addTask,
  fetchTask,
  deleteTask,
  updateTaskDetails,
  changeSetting,
};
