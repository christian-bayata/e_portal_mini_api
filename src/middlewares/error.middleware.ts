import winston from "winston";
import { ErrorRequestHandler } from "express";
import ErrorHandler from "../utils/error_handler";

export const Error: ErrorRequestHandler = (error, req, res, next) => {
  res.locals.message = error.message;
  res.locals.error = process.env.NODE_ENV === "development" ? error : {};
  winston.error(`${error.status || 500} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  return ErrorHandler.handle(error, req, res, next);
};
