require("dotenv").config();
import express, { Application } from "express";
import { Error } from "./middlewares/error.middleware";
import ResponseHandler from "./utils/response";
import winston from "./logger/winston";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import indexRouter from "./api/v1/routes/index.route";
import connectionString from "./config/connection";
import Database from "./config/database";

/* Initialize express application */
const app: Application = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(morgan("combined", { stream: winston.stream }));
app.use(express.json());

/* Connect to the database */
new Database(connectionString).connect();

/* Ping the API to ensure it is running. */
app.get("/health-check", (req, res) => {
  return ResponseHandler.sendSuccess({ res, message: "Health check passed" });
});

/* Bind app port to index router */
app.use("/api", indexRouter);

/* Use the error handling middleware as the last in the middleware stack */
app.use(Error);

export default app;
