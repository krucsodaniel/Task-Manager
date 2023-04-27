const { mockRequest, mockResponse } = require("jest-mock-req-res");
const createError = require("http-errors");

const taskController = require("./task.controller");
const taskService = require("./task.service");

jest.mock("./task.service");

describe("Task controller - GET", () => {
  const mockData = [
    {
      id: 1,
      title: "Some todo",
      _listId: "63fa6448b68206bbbb739751",
      completed: false,
    },
    {
      id: 2,
      title: "Some other todo",
      _listId: "63fa6448b68206bbbb739751",
      completed: false,
    },
    {
      id: 3,
      title: "Another todo",
      _listId: "63fa6448b68206bbbb739751",
      completed: false,
    },
  ];

  let response;
  const nextFunction = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    taskService.__setMockData(mockData);
    response = mockResponse();
  });

  test("Find all Task by a List ID", async () => {
    const _listId = "63fa6448b68206bbbb739751";

    const expectedTasks = [
      {
        id: 1,
        title: "Some todo",
        _listId: _listId,
        completed: false,
      },
      {
        id: 2,
        title: "Some other todo",
        _listId: _listId,
        completed: false,
      },
      {
        id: 3,
        title: "Another todo",
        _listId: _listId,
        completed: false,
      },
    ];

    taskService.getAllTasksFromList.mockImplementation(() => expectedTasks);

    const request = mockRequest({
      params: {
        listId: _listId,
      },
    });

    await taskController.getAllTasksFromList(request, response, nextFunction);
    expect(taskService.getAllTasksFromList).toBeCalledWith(_listId);
    expect(taskService.getAllTasksFromList).toBeCalledTimes(1);
    expect(nextFunction).not.toBeCalled();
    expect(response.statusCode).not.toBe(500);
  });

  test("Finding Tasks with unexisting List Id", async () => {
    const _listId = "unexistingId";
    const expectedError = new createError.InternalServerError(
      "Can't get Tasks!"
    );

    taskService.getAllTasksFromList.mockImplementation(() => {
      throw expectedError;
    });

    const request = mockRequest({
      params: {
        listId: _listId,
      },
    });

    await taskController.getAllTasksFromList(request, response, nextFunction);
    expect(taskService.getAllTasksFromList).toBeCalledWith(_listId);
    expect(taskService.getAllTasksFromList).toBeCalledTimes(1);
    expect(nextFunction).toBeCalledWith(expectedError);
    expect(response.statusCode).not.toBe(200);
  });
});

describe("Task controller - POST", () => {
  const mockData = [
    {
      id: 1,
      title: "Book a Hotel",
      _listId: "63fa6448b68206bbbb739751",
      completed: false,
    },
  ];

  let response;
  const nextFunction = jest.fn();

  beforeEach(() => {
    taskService.__setMockData(mockData);
    response = mockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Creating a new Task for a List", async () => {
    const _listId = "63fa6448b68206bbbb739752";
    const newTask = { title: "Buy Tickets" };

    const request = mockRequest({
      params: {
        listId: _listId,
      },
      body: {
        title: newTask.title,
      },
    });

    await taskController.createTask(request, response, nextFunction);
    expect(taskService.createTask).toBeCalledWith(_listId, newTask.title);
    expect(taskService.createTask).toBeCalledTimes(1);
    expect(nextFunction).not.toBeCalled();
    expect(response.statusCode).not.toBe(500);
  });

  test("Creating new Task with unexisting List Id", async () => {
    const _listId = 2;
    const newTask = { title: "Buy Flowers" };
    const expectedError = new createError.InternalServerError(
      "Task could not be created!"
    );
    taskService.createTask.mockRejectedValue(expectedError);

    const request = mockRequest({
      params: {
        listId: _listId,
      },
      body: {
        title: newTask.title,
      },
    });

    await taskController.createTask(request, response, nextFunction);
    expect(taskService.createTask).toBeCalledWith(_listId, newTask.title);
    expect(nextFunction).toBeCalledWith(expectedError);
    expect(response.statusCode).not.toBe(200);
    expect(response.json).not.toBeCalled();
  });
});

describe("Task controller - DELETE", () => {
  const mockData = [
    {
      id: 1,
      title: "Book a Hotel",
      _listId: "63fa6448b68206bbbb739751",
      completed: false,
    },
  ];

  let response;
  const nextFunction = jest.fn();

  beforeEach(() => {
    taskService.__setMockData(mockData);
    response = mockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Deleting a Task by taskId", async () => {
    const taskId = 1;
    const listId = "63fa6448b68206bbbb739751";
    const mockTask = {
      id: taskId,
      title: "Example Task",
      _listId: listId,
      completed: false,
    };

    taskService.deleteTask.mockResolvedValue(mockTask);

    const request = mockRequest({
      params: {
        taskId: taskId,
        listId: listId,
      },
    });

    await taskController.deleteTask(request, response, nextFunction);
    expect(taskService.deleteTask).toBeCalledWith(listId, taskId);
    expect(response.sendStatus).toHaveBeenCalledWith(204);
    expect(response.json).not.toBeCalled();
    expect(nextFunction).not.toBeCalled();
  });

  test("Deleting a Task by unexisting taskId", async () => {
    const taskId = 2;
    const listId = "63fa6448b68206bbbb739751";
    const mockTask = {
      id: taskId,
      title: "Example Task",
      _listId: listId,
      completed: false,
    };

    taskService.deleteTask.mockResolvedValue(null);

    const request = mockRequest({
      params: {
        taskId: taskId,
        listId: listId,
      },
    });

    await taskController.deleteTask(request, response, nextFunction);
    expect(taskService.deleteTask).toBeCalledWith(listId, taskId);
    expect(nextFunction).not.toBeCalled();
    expect(response.json).not.toBeCalled();
  });
});

describe("Task controller - UPDATE", () => {
  const mockData = [
    {
      id: 1,
      title: "Book a Hotel",
      _listId: "63fa6448b68206bbbb739751",
      completed: false,
    },
  ];

  let response;
  const nextFunction = jest.fn();

  beforeEach(() => {
    taskService.__setMockData(mockData);
    response = mockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Updating a Task by taskId", async () => {
    const taskId = 1;
    const listId = "63fa6448b68206bbbb739751";

    const mockTask = {
      id: taskId,
      title: "Book a Hotel",
      _listId: listId,
      completed: false,
    };

    const completed = true;

    taskService.updateTask.mockResolvedValue(mockTask);

    const request = mockRequest({
      params: {
        taskId: taskId,
        listId: listId,
      },
      body: {
        title: mockTask.title,
        completed: completed,
      },
    });

    const response = mockResponse();

    await taskController.updateTask(request, response, nextFunction);
    expect(taskService.updateTask).toHaveBeenCalledWith(
      listId,
      taskId,
      mockTask.title,
      completed
    );
    expect(response.send).toHaveBeenCalledWith(mockTask);
  });

  test("Updating a Task by  unexisting taskId", async () => {
    const taskId = 1;
    const listId = "63fa6448b68206bbbb739751";

    const mockTask = {
      id: taskId,
      title: "Book a Hotel",
      _listId: listId,
      completed: false,
    };

    const completed = true;

    taskService.updateTask.mockResolvedValue(null);

    const request = mockRequest({
      params: {
        taskId: taskId,
        listId: listId,
      },
      body: {
        title: mockTask.title,
        completed: completed,
      },
    });

    const response = mockResponse();

    await taskController.updateTask(request, response, nextFunction);
    expect(taskService.updateTask).toHaveBeenCalledWith(
      listId,
      taskId,
      mockTask.title,
      completed
    );
    expect(nextFunction).toBeCalled();
    expect(response.json).not.toBeCalled();
    expect(nextFunction.mock.calls[0][0].message).toBe("Task not found");
  });
});
