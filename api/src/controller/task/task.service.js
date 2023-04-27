const Task = require("../../models/task.model");
const List = require("../../models/list.model");

exports.getAllTasksFromList = (listId) => {
  return Task.find({ _listId: listId });
};

exports.createTask = async (listId, taskData) => {
  const task = new Task({ title: taskData, _listId: listId });
  const savedTask = await task.save();

  await List.findByIdAndUpdate(
    listId,
    { $push: { tasks: savedTask._id } },
    { new: true }
  );
  return savedTask;
};

exports.updateTask = async (listId, taskId, title, completed) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, _listId: listId },
      { title, completed },
      { new: true }
    );
    return task;
  } catch (error) {
    throw error;
  }
};

exports.deleteTask = async (listId, taskId) => {
  try {
    await List.findByIdAndUpdate(listId, { $pull: { tasks: taskId } });
    await Task.findByIdAndDelete(taskId);
  } catch (error) {
    throw new Error(error);
  }
};
