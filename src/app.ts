require("dotenv").config();
import express, { Application, Request, Response } from "express";
import sequelize from "./connection";
import { Error } from "./middlewares/error.middlewares";
import ResponseHandler from "./utils/response";

/* Initialize express application */
const app: Application = express();
app.use(express.json());

/* Database connection */
sequelize
  .authenticate()
  .then(() => {
    console.log(`DB connection established successfully in ${process.env.NODE_ENV} mode`);
  })
  .catch((err: any) => {
    console.log("Unable to connect to DB", err);
  });

/* Ping the API to ensure it is running. */
app.get("/health-check", (req, res) => {
  return ResponseHandler.sendSuccess({ res, message: "Health check passed" });
});

/* Use the error handling middleware as the last in the middleware stack */
app.use(Error);

export default app;
