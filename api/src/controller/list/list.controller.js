const createError = require("http-errors");
const listService = require("./list.service");
const logger = require("../../config/logger");

exports.create = async (req, res, next) => {
  const ownerId = req.body.ownerId;

  const newList = {
    title: req.body["title"],
  };

  try {
    const savedList = await listService.create(newList, ownerId);
    logger.info(`New list saved`);
    res.status(201).send(savedList);
  } catch (error) {
    logger.error(error);
    return next(new createError.InternalServerError("List could not saved!"));
  }
};

exports.findAll = async (req, res, next) => {
  const ownerId = req.params.ownerId;

  try {
    const lists = await listService.findAll(ownerId);
    res.send(lists);
    logger.debug(
      `${new Date().toUTCString()}, METHOD: ${req.method}, path:${
        req.originalUrl
      }` + " Get all Lists"
    );
  } catch (error) {
    logger.error(error);
    return next(new createError.InternalServerError("Can't get Lists!"));
  }
};

exports.deleteList = async (req, res, next) => {
  const listId = req.params.listId;

  try {
    const deletedList = await listService.delete(listId);
    res.sendStatus(204);
  } catch (error) {
    logger.error(error);
    return next(new createError.InternalServerError("List could not deleted!"));
  }
};
