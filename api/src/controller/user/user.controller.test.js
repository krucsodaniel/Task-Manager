const { mockRequest, mockResponse } = require("jest-mock-req-res");
const createError = require("http-errors");

const userController = require("./user.controller");
const userService = require("./user.service");

jest.mock("./user.service");

describe("User controller - POST", () => {
  const mockData = [
    {
      id: 1,
      email: "user1@email.com",
      password: "12345",
      nickName: "User1",
    },
    {
      id: 2,
      email: "user2@email.com",
      password: "12345",
      nickName: "User2",
    },
  ];

  let response;
  const nextFunction = jest.fn();

  beforeEach(() => {
    userService.__setMockData(mockData);
    response = mockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Save new User", async () => {
    const newUser = {
      email: "user3@email.com",
      password: "12345",
      nickName: "User3",
    };

    const request = mockRequest({
      body: {
        email: "user3@email.com",
        password: "12345",
        nickName: "User3",
      },
    });

    const response = mockResponse();

    await userController.createUser(request, response, nextFunction);
    expect(
      userService.create(newUser.email, newUser.password, newUser.nickName)
    ).resolves.toEqual(newUser);
    expect(userService.create).toBeCalledWith(
      newUser.email,
      newUser.password,
      newUser.nickName
    );
    expect(userService.create).toBeCalledTimes(1);
  });
});
