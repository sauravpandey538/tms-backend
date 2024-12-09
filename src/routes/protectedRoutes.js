const express = require("express");
const authController = require("../controllers/authController");
const taskController = require("../controllers/taskController");
const auth = require("../middlewares/auth-middleware").protect;

const router = express.Router();
router.use(auth);
router.post("/add-task", taskController.addTask);
router.put("/edit-task", taskController.updateTaskDetails);
router.delete("/delete-task/:id", taskController.deleteTask);
router.get("/get-tasks", taskController.fetchTask);
router.put("/change-details", taskController.changeSetting);

// router.get('/protected', protect, (req, res) => {
module.exports = router;
