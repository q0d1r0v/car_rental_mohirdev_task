require("dotenv").config();
require("./src/cron/car_status_checker");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const { router } = require("./src/api/api");

const server = express();

server.use(express.json());
server.use(cors());

server.use("/", router);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Car rental api",
      version: "1.0.0",
      description: "Car rental api",
    },
  },
  apis: ["./src/services/*.js"],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
server.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

server.listen(PORT, () => {
  console.log("server is running on port " + PORT);
});
