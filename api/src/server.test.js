const app = require("./server");
const mongoose = require("mongoose");
const supertest = require("supertest");
const config = require("config");
const jwt = require("jsonwebtoken");

const List = require("./models/list.model");
const Task = require("./models/task.model");
const User = require("./models/user.model");

const dbConfig = config.get("database");

const { username, password, host } = config.get("database");

describe("REST API List végpont Integrációs tesztek", () => {
  let ACCESS_TOKEN;

  const insertData = [
    {
      title: "New List",
      owner: "64318f2931462dec43afff0a",
      tasks: [],
    },
    {
      title: "New List 2",
      owner: "64318f2931462dec43afff0a",
      tasks: [],
    },
    {
      title: "New List 3",
      owner: "64318f2931462dec43afff0a",
      tasks: [],
    },
  ];

  const ownerId = "64318f2931462dec43afff0a";

  beforeEach(async () => {
    await mongoose.connect(`mongodb://127.0.0.1:27017/TaskManagerTESZT`);
    console.log("MongoDB connection established!");
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  });

  test("GET /:ownerId endpoint return Lists", async () => {
    await List.insertMany(insertData);

    const user = new User({
      _id: "64318f2931462dec43afff0a",
      email: "ts@ts.com",
      password: "12345",
      nickName: "Tester",
    });

    user
      .save()
      .then(() => console.log("User saved to database"))
      .catch((err) => console.error(err));

    await supertest(app)
      .post("/api/login")
      .send({
        email: "ts@ts.com",
        password: "12345",
      })
      .then((res) => {
        ACCESS_TOKEN = res.body.accessToken;
      });

    const response = await supertest(app)
      .get(`/api/lists/${ownerId}`)
      .set("Authorization", `Bearer ${ACCESS_TOKEN}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBe(insertData.length);

    response.body.forEach((list, index) => {
      expect(list.title).toBe(insertData[index].title);
      expect(list.owner).toBe(insertData[index].owner);
      expect(list.tasks).toEqual(insertData[index].tasks);
    });
  });

  test("POST /lists endpoint create List", async () => {
    const user = new User({
      _id: "64318f2931462dec43afff0a",
      email: "ts@ts.com",
      password: "12345",
      nickName: "Tester",
      lists: [],
    });

    await user.save();

    const newList = {
      title: "Teszt Lista",
      ownerId: "64318f2931462dec43afff0a",
    };

    await supertest(app)
      .post("/api/login")
      .send({ email: "ts@ts.com", password: "12345" })
      .then((res) => {
        ACCESS_TOKEN = res.body.accessToken;
      });

    const response = await supertest(app)
      .post("/api/lists")
      .send(newList)
      .set("Authorization", `Bearer ${ACCESS_TOKEN}`);

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newList.title);
    expect(response.body.owner).toBe(newList.ownerId);
  });

  test("DELETE /:listId endpoint delete List", async () => {
    const user = new User({
      email: "test@example.com",
      password: "password",
      nickName: "Tester",
      lists: [],
    });

    const savedUser = await user.save();

    const list = new List({
      title: "Test List",
      owner: savedUser._id,
    });

    const savedList = await list.save();

    await supertest(app)
      .post("/api/login")
      .send({
        email: "test@example.com",
        password: "password",
      })
      .then((res) => {
        ACCESS_TOKEN = res.body.accessToken;
      });

    const response = await supertest(app)
      .delete(`/api/lists/${savedList._id}`)
      .set("Authorization", `Bearer ${ACCESS_TOKEN}`);

    expect(response.statusCode).toBe(204);
    expect(response.body).toEqual({});
    const deletedList = await List.findById(savedList._id);
    expect(deletedList).toBeNull();
    const person = await User.findById(savedUser._id);
    expect(person.lists).not.toContain(savedList._id);
  });
});

describe("REST API Task végpont Integrációs tesztek", () => {
  let ACCESS_TOKEN;

  beforeEach(async () => {
    await mongoose.connect(`mongodb://127.0.0.1:27017/TaskManagerTESZT`);
    console.log("MongoDB connection established!");
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  });

  test("GET /:listId/tasks endpoint return Tasks", async () => {
    const user = new User({
      email: "test@example.com",
      password: "password",
      nickName: "Tester",
      lists: [],
    });
    const savedUser = await user.save();

    const list = new List({
      title: "Test List",
      owner: savedUser._id,
      tasks: [],
    });
    const savedList = await list.save();

    let listId = savedList._id;

    const tasks = [
      { title: "Task 1", _listId: savedList._id, completed: false },
      { title: "Task 2", _listId: savedList._id, completed: false },
      { title: "Task 3", _listId: savedList._id, completed: false },
    ];
    await Task.insertMany(tasks);

    await supertest(app)
      .post("/api/login")
      .send({
        email: "test@example.com",
        password: "password",
      })
      .then((res) => {
        ACCESS_TOKEN = res.body.accessToken;
      });

    const response = await supertest(app)
      .get(`/api/lists/${listId}/tasks`)
      .set("Authorization", `Bearer ${ACCESS_TOKEN}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(tasks.length);
  });

  test("POST /:listId/tasks endpoint create new Task", async () => {
    const user = new User({
      _id: "64318f2931462dec43afff0a",
      email: "test@example.com",
      password: "password",
      nickName: "Tester",
      lists: [],
    });
    const savedUser = await user.save();

    const list = new List({
      _id: "64318f2931462dec43addd1b",
      title: "Test List",
      owner: savedUser._id,
      tasks: [],
    });
    const savedList = await list.save();

    let listId = savedList._id;

    const task = new Task({
      title: "Test Task",
      _listId: savedList._id,
      completed: false,
    });
    const savedTask = await task.save();

    let title = savedTask.title;

    await supertest(app)
      .post("/api/login")
      .send({
        email: "test@example.com",
        password: "password",
      })
      .then((res) => {
        ACCESS_TOKEN = res.body.accessToken;
      });

    const response = await supertest(app)
      .post(`/api/lists/${listId}/tasks`)
      .send({ title })
      .set("Authorization", `Bearer ${ACCESS_TOKEN}`);

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(title);
    expect(response.body.completed).toBe(false);
    expect(response.body.title).toBe(title);
    expect(response.body.completed).toBe(false);
  });

  test("PUT /:listId/tasks/:taskId endpoint update a Task", async () => {
    const user = new User({
      _id: "64318f2931462dec43afff0a",
      email: "test@example.com",
      password: "password",
      nickName: "Tester",
      lists: [],
    });
    const savedUser = await user.save();

    const list = new List({
      _id: "64318f2931462dec43addd1b",
      title: "Test List",
      owner: savedUser._id,
      tasks: [],
    });
    const savedList = await list.save();

    let listId = savedList._id;

    const task = new Task({
      title: "Test Task",
      _listId: savedList._id,
      completed: false,
    });
    const savedTask = await task.save();

    let title = savedTask.title;
    let completed = true;
    let taskId = savedTask._id;

    await supertest(app)
      .post("/api/login")
      .send({
        email: "test@example.com",
        password: "password",
      })
      .then((res) => {
        ACCESS_TOKEN = res.body.accessToken;
      });

    const response = await supertest(app)
      .put(`/api/lists/${listId}/tasks/${taskId}`)
      .send({ title, completed })
      .set("Authorization", `Bearer ${ACCESS_TOKEN}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toEqual(title);
    expect(response.body.completed).toEqual(completed);
  });

  test("DELETE /:listId/tasks/:taskId endpoint delete a Task", async () => {
    const user = new User({
      _id: "64318f2931462dec43afff0a",
      email: "test@example.com",
      password: "password",
      nickName: "Tester",
      lists: [],
    });
    const savedUser = await user.save();

    const list = new List({
      _id: "64318f2931462dec43addd1b",
      title: "Test List",
      owner: savedUser._id,
      tasks: [],
    });
    const savedList = await list.save();

    let listId = savedList._id;

    const task = new Task({
      title: "Test Task",
      _listId: savedList._id,
      completed: false,
    });
    const savedTask = await task.save();

    let taskId = savedTask._id;

    await supertest(app)
      .post("/api/login")
      .send({
        email: "test@example.com",
        password: "password",
      })
      .then((res) => {
        ACCESS_TOKEN = res.body.accessToken;
      });

    const response = await supertest(app)
      .delete(`/api/lists/${listId}/tasks/${taskId}`)
      .set("Authorization", `Bearer ${ACCESS_TOKEN}`);

    expect(response.statusCode).toBe(204);
    expect(await Task.findById(savedTask._id)).toBeNull();
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("REST API User végpont Integrációs teszt", () => {
  beforeEach(async () => {
    await mongoose.connect(`mongodb://127.0.0.1:27017/TaskManagerTESZT`);
    console.log("MongoDB connection established!");
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  });

  test("POST /users register an User", async () => {
    const user = {
      email: "test@example.com",
      password: "password",
      nickName: "Tester",
      lists: [],
    };

    const response = await supertest(app).post("/api/users").send(user);

    expect(response.status).toBe(201);
    expect(response.body.email).toBe(user.email);
    expect(response.body.nickName).toBe(user.nickName);
  });
});

describe("REST API Login végpont Integrációs teszt", () => {
  let ACCESS_TOKEN;

  beforeEach(async () => {
    await mongoose.connect(`mongodb://127.0.0.1:27017/TaskManagerTESZT`);
    console.log("MongoDB connection established!");
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  });

  test("POST /login register an User", async () => {
    const user = new User({
      email: "test@example.com",
      password: "password",
      nickName: "Tester",
      lists: [],
    });
    await user.save();

    const response = await supertest(app).post("/api/login").send({
      email: "test@example.com",
      password: "password",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("ownerId");
    expect(response.body).toHaveProperty("userNickName");
    const decodedToken = jwt.verify(
      response.body.accessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY
    );
    expect(decodedToken.email).toBe("test@example.com");
    expect(decodedToken.nickName).toBe("Tester");
  });
});
