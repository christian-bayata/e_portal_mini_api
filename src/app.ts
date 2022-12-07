require("dotenv").config();
import express, { Application, Request, Response } from "express";
import sequelize from "./connection";

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

export default app;
