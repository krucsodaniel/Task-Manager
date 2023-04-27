const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    mingLength: 1,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

const List = mongoose.model("List", ListSchema);

module.exports = List;
