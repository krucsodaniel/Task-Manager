const express = require("express");
const router = express.Router();

const listController = require("./list.controller");
const taskController = require("../task/task.controller");

router.post("/", (req, res, next) => {
  return listController.create(req, res, next);
});

router.get("/:ownerId", (req, res, next) => {
  return listController.findAll(req, res, next);
});

router.delete("/:listId", (req, res, next) => {
  return listController.deleteList(req, res, next);
});

router.get("/:listId/tasks", (req, res, next) => {
  return taskController.getAllTasksFromList(req, res, next);
});

router.post("/:listId/tasks", (req, res, next) => {
  return taskController.createTask(req, res, next);
});

router.put("/:listId/tasks/:taskId", (req, res, next) => {
  return taskController.updateTask(req, res, next);
});

router.delete("/:listId/tasks/:taskId", (req, res, next) => {
  return taskController.deleteTask(req, res, next);
});

module.exports = router;
