const List = require("../../models/list.model");
const User = require("../../models/user.model");
const Task = require("../../models/task.model");

exports.create = async (list, ownerId) => {
  const newList = new List({
    title: list["title"],
    owner: ownerId,
  });
  const savedList = await newList.save();

  const user = await User.findById(ownerId);
  user.lists.push(savedList._id);
  user.save();
  return savedList;
};

exports.findAll = (ownerId) => List.find({ owner: ownerId });

exports.findById = (id) => List.find({ _id: id });

exports.update = (id, listData) =>
  List.findByIdAndUpdate(id, listData, { new: true });

exports.delete = async (id) => {
  try {
    const list = await List.findById(id);

    await Task.deleteMany({ _listId: list._id });

    const user = await User.findByIdAndUpdate(list.owner, {
      $pull: { lists: list._id },
    });

    await list.remove();

    return { user, list };
  } catch (error) {
    throw new Error(error);
  }
};
