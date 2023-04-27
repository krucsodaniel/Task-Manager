const { mockRequest, mockResponse } = require("jest-mock-req-res");
const createError = require("http-errors");

const listController = require("./list.controller");
const listService = require("./list.service");

jest.mock("./list.service");

describe("List controller - GET", () => {
  const mockData = [
    {
      id: 1,
      title: "Vacation",
      owner: "64245593abb0d57d76a2fffa",
      tasks: ["63fa65601860bae045537017"],
    },
    {
      id: 2,
      title: "School",
      owner: "64245593abb0d57d76a2fffa",
      tasks: ["63fa65ca63bd603afc4371cc"],
    },
    {
      id: 3,
      title: "Work",
      owner: "64245593abb0d57d76a2fffa",
      tasks: ["63fa68bb65c5730340e580df"],
    },
  ];

  let response;
  const nextFunction = jest.fn();

  beforeEach(() => {
    listService.__setMockData(mockData);
    response = mockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Find all Lists by an User ID", () => {
    const OWNER_ID = "64245593abb0d57d76a2fffa";
    const request = mockRequest({
      params: {
        ownerId: OWNER_ID,
      },
    });

    return listController.findAll(request, response, nextFunction).then(() => {
      expect(listService.findAll).toBeCalledWith(OWNER_ID);
      expect(listService.findAll).toBeCalledTimes(1);
      expect(nextFunction).not.toBeCalled();
      expect(response.statusCode).not.toBe(500);
    });
  });

  test("Finding Lists with invalid ownerId", () => {
    const OWNER_ID = "invalid_owner_id";
    const request = mockRequest({
      params: {
        ownerId: OWNER_ID,
      },
    });

    listService.findAll.mockImplementation(() => {
      throw new Error("Invalid ownerId");
    });

    return listController.findAll(request, response, nextFunction).then(() => {
      expect(listService.findAll).toBeCalledWith(OWNER_ID);
      expect(nextFunction).toBeCalledWith(expect.any(Error));
      expect(listService.findAll).toBeCalledTimes(1);
    });
  });
});

describe("List controller - POST", () => {
  const mockData = [
    {
      id: 1,
      title: "University",
      owner: "64245593abb0d57d76a2fffa",
      tasks: [],
    },
  ];

  let response;
  const nextFunction = jest.fn();

  beforeEach(() => {
    listService.__setMockData(mockData);
    response = mockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Creating a new List for an User", async () => {
    const ownerId = "64245593abb0d57d76a2fffa";
    const newList = { title: "Shopping" };

    const request = mockRequest({
      body: {
        ownerId: ownerId,
        title: newList.title,
      },
    });

    await listController.create(request, response, nextFunction);
    expect(listService.create).toBeCalledWith(newList, ownerId);
    expect(response.status).toBeCalledWith(201);
    expect(nextFunction).not.toBeCalled();
    expect(response.statusCode).not.toBe(500);
  });

  test("Wrong ownerId while creating List", async () => {
    const ownerId = "invalidOwnerID";
    const newList = { title: "Shopping" };

    const request = mockRequest({
      body: {
        ownerId,
        title: newList.title,
      },
    });

    const expectedError = new createError.InternalServerError(
      "List could not saved!"
    );
    listService.create.mockRejectedValue(expectedError);

    await listController.create(request, response, nextFunction);
    expect(listService.create).toBeCalledWith(newList, ownerId);
    expect(nextFunction).toBeCalledWith(expectedError);
    expect(response.json).not.toBeCalled();
  });
});

describe("List controller - DELETE", () => {
  const mockData = [
    {
      id: 1,
      title: "University",
      owner: "64245593abb0d57d76a2fffa",
      tasks: [],
    },
  ];

  let response;
  const nextFunction = jest.fn();

  beforeEach(() => {
    listService.__setMockData(mockData);
    response = mockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Deleting a List by listId", async () => {
    const listId = 1;

    const request = mockRequest({
      params: {
        listId: listId,
      },
    });

    await listController.deleteList(request, response, nextFunction);
    expect(listService.delete).toBeCalledWith(listId);
    expect(nextFunction).not.toBeCalled();
    expect(listService.delete).toBeCalledTimes(1);
  });

  test("Deleting a List with unexisting listId", async () => {
    const listId = 2;

    listService.delete.mockRejectedValueOnce(
      new Error("List could not deleted!")
    );

    const request = mockRequest({
      params: {
        listId: listId,
      },
    });

    await listController.deleteList(request, response, nextFunction);

    expect(listService.delete).toBeCalledWith(listId);
    expect(nextFunction).toBeCalledWith(expect.any(Error));
    expect(nextFunction.mock.calls[0][0].message).toBe(
      `List could not deleted!`
    );
    expect(response.status).not.toBeCalled();
    expect(response.json).not.toBeCalled();
  });
});
