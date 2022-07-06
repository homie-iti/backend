const express = require("express");
var cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const unitRoute = require("./routers/unit.route");
const userRoute = require("./routers/user.route");
const recommendationsRoute = require("./routers/recommendationsRoute")
const landlordRoute = require("./routers/landlordRoute")

require("./models/address.model");
require("./models/admin.model");
require("./models/agent.model");
require("./models/city.model");
require("./models/contract.model");
require("./models/helpQuestion.model");
require("./models/landlord.model");
require("./models/review.model");
require("./models/unit.model");
require("./models/user.model");

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
app.use(express.json())

app.use(unitRoute);
app.use(userRoute);
app.use(recommendationsRoute);
app.use(landlordRoute)

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
