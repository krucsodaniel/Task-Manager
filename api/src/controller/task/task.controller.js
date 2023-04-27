const createError = require("http-errors");
const taskService = require("./task.service");
const logger = require("../../config/logger");

exports.getAllTasksFromList = async (req, res, next) => {
  const _listId = req.params.listId;

  try {
    const tasks = await taskService.getAllTasksFromList(_listId);
    res.status(200).send(tasks);
    logger.debug(
      `${new Date().toUTCString()}, METHOD: ${req.method}, path:${
        req.originalUrl
      }` + " Get all Tasks"
    );
  } catch (error) {
    logger.error(error);
    return next(new createError.InternalServerError("Can't get Tasks!"));
  }
};

exports.createTask = async (req, res, next) => {
  const _listId = req.params.listId;
  const title = req.body["title"];

  try {
    const task = await taskService.createTask(_listId, title);
    res.status(201).send(task);
    logger.debug(
      `${new Date().toUTCString()}, METHOD: ${req.method}, path:${
        req.originalUrl
      }` + " Task created successfully"
    );
  } catch (error) {
    logger.error(error);
    return next(
      new createError.InternalServerError("Task could not be created!")
    );
  }
};

exports.updateTask = async (req, res, next) => {
  const taskId = req.params.listId;
  const listId = req.params.taskId;

  const title = req.body["title"];
  const completed = req.body["completed"];

  try {
    const task = await taskService.updateTask(taskId, listId, title, completed);
    if (!task) {
      return next(new createError.NotFound("Task not found"));
    }
    res.send(task);
    logger.debug(
      `${new Date().toUTCString()}, METHOD: ${req.method}, path:${
        req.originalUrl
      }` + " Task updated successfully"
    );
  } catch (error) {
    logger.error(error);
    return next(new createError.InternalServerError("Task could not updated!"));
  }
};

exports.deleteTask = async (req, res, next) => {
  const taskId = req.params.taskId;
  const listId = req.params.listId;

  try {
    const task = await taskService.deleteTask(listId, taskId);
    res.sendStatus(204);
    logger.debug(
      `${new Date().toUTCString()}, METHOD: ${req.method}, path:${
        req.originalUrl
      }` + " Task deleted successfully"
    );
  } catch (error) {
    logger.error(error);
    return next(new createError.InternalServerError("Task could not deleted!"));
  }
};
