const userService = jest.mock("./user.service.js");

let mockData;

userService.create = jest.fn((email, password, nickName) => {
  if (email === undefined || password === undefined || nickName === undefined) {
    return Promise.reject();
  }

  const savedUser = {
    email: email,
    password: password,
    nickName: nickName,
  };
  mockData.push(savedUser);
  return Promise.resolve(savedUser);
});

userService.__setMockData = (data) => (mockData = data);

module.exports = userService;
