const express = require("express");
var cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const unitRoute = require("./routers/unitRoute");
const userRoute = require("./routers/userRoute");
const cityRoute = require("./routers/cityRoute");
const recommendationsRoute = require("./routers/recommendationsRoute");
const agentRoute = require("../src/routers/agentRoute");
const searchRoute = require("../src/routers/searchRoute");
const helpRoute = require("../src/routers/helpQuestionRoute");

const adminRoute = require("../src/routers/adminRoute");

require("./models/addressModel");
require("./models/adminModel");
require("./models/agentModel");
require("./models/cityModel");
require("./models/contractModel");
require("./models/helpQuestionModel");
require("./models/landlordModel");
require("./models/reviewModel");
require("./models/unitModel");
require("./models/userModel");

const app = express();
const port = process.env.PORT || 8080;

const homieDB_URL = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
mongoose
  .connect(homieDB_URL)
  .then(() => {
    app.listen(port, () => {
      console.log("App listens on port", port);
    });
  })
  .catch((error) => {
    console.log("DB Connection Error", error);
  });

app.use(cors());
app.use(morgan(":method :url :status - :response-time ms"));
app.use(express.json());

app.use(adminRoute);
app.use(searchRoute);
app.use(agentRoute);
app.use(unitRoute);
app.use(userRoute);
app.use(cityRoute);
app.use(recommendationsRoute);
app.use(helpRoute);

// not-found middleware
app.use((request, response, next) => {
  // throw new Error("very big error"); //throwing an error causes the error handling middleware to work
  response.status(404).json({ message: "Endpoint not found." });
});

// handling errors middleware
app.use((error, request, response, next) => {
  response
    .status(error.status || 500)
    .json({ message: "Internal Error", details: error.message });
});
