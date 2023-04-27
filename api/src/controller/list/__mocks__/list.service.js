const listService = jest.mock("./list.service.js");

let mockData;

listService.findAll = jest.fn((ownerId) =>
  Promise.resolve(mockData.filter((list) => (list.ownerId = ownerId)))
);

listService.create = jest.fn((newList, ownerId) => {
  const savedList = {
    ...newList,
    id: mockData[mockData.length - 1].id + 1,
    ownerId: ownerId,
  };
  mockData.push(savedList);
  return Promise.resolve(savedList);
});

listService.delete = jest.fn((listId) => {
  const listIndex = mockData.findIndex((list) => list.id === listId);
  if (listIndex === -1) {
    return Promise.reject(new Error("List could not deleted!"));
  }
  mockData.splice(listIndex, 1);
  return Promise.resolve();
});

listService.__setMockData = (data) => (mockData = data);

module.exports = listService;
