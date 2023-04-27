require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const logger = require("./config/logger");

const cors = require("cors");
const { join } = require("path");

const app = express();

const apiWrapper = express();
apiWrapper.use("/api", app);

const authenticateJWT = require("./auth/authenticate");
const authHandler = require("./auth/authHandler");

const angularAppPath = join(__dirname, "..", "public", "angular");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./docs/swagger.yaml");

app.use(
  morgan("combined", { stream: { write: (message) => logger.info(message) } })
);

app.use(cors());

app.use(express.json());

app.use("/static", express.static("./public"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post("/login", authHandler.login);

app.use("/lists", authenticateJWT, require("./controller/list/list.routes"));
app.use("/users", require("./controller/user/user.routes"));

apiWrapper.use("/", express.static(angularAppPath));

apiWrapper.get("*", (req, res) => {
  res.sendFile(angularAppPath + "/index.html");
});

app.use("/", (err, req, res, next) => {
  console.log(`ERR: ${err.message}`);
  next(err);
});

app.use("/", (err, req, res, next) => {
  logger.error(`ERROR ${err.statusCode}: ${err.message}`);
  res.status(err.statusCode);
  res.json({
    hasError: true,
    message: err.message,
  });
});

module.exports = apiWrapper;
