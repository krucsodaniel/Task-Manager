require("dotenv").config();
const config = require("config");

const PORT = process.env.PORT || 3000;
const logger = require("./config/logger");
const mongoose = require("mongoose");
const app = require("./server");

if (!config.has("database")) {
  logger.error("No database config found.");
  process.exit();
}

const { username, password, host } = config.get("database");

mongoose
  .connect(`mongodb+srv://${username}:${password}@${host}`)
  .then(() => {
    logger.info("MongoDB connection established successfully.");
  })
  .catch((err) => {
    console.log("Error while attempting to connect to MongoDb");
    logger.error(err);
    process.exit();
  });

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
