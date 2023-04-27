const taskService = jest.mock("./task.service.js");

let mockData;

taskService.getAllTasksFromList = jest.fn((listId) =>
  Promise.resolve(mockData.find((data) => (data._listId = listId)))
);

taskService.createTask = jest.fn((listId, taskData) => {
  const savedTask = {
    title: taskData,
    id: mockData[mockData.length - 1].id + 1,
    _listId: listId,
    completed: false,
  };
  mockData.push(savedTask);
  return Promise.resolve(savedTask);
});

taskService.deleteTask = jest.fn((taskId, listId) => {
  const taskIndex = mockData.findIndex((task) => task.id === taskId);
  if (taskIndex === -1) {
    return Promise.reject(new Error("Task could not deleted!"));
  }
  mockData.splice(taskIndex, 1);
  return Promise.resolve();
});

taskService.updateTask = jest.fn((listId, taskId, title, completed) => {
  const taskIndex = mockData.findIndex((task) => task.id === taskId);
  if (taskIndex === -1) {
    return Promise.reject(new Error("Task could not updated!"));
  }
  mockData[taskIndex].completed = completed;
  return Promise.resolve();
});

taskService.__setMockData = (data) => (mockData = data);

module.exports = taskService;
