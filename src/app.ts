import express, { Application, Request, Response } from "express";

/* Initialize express application */
const app: Application = express();
app.use(express.json());

export default app;
