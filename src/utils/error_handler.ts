require("dotenv").config();
import { ErrorRequestHandler } from "express";
import ResponseHandler from "./response";

class ErrorHandler {
  /**
   *
   * @param err
   * @param req
   * @param res
   * @returns {*}
   */
  static handle: ErrorRequestHandler = (err, req, res) => {
    let stack = process.env.NODE_ENV === "development" ? err.stack : null;
    return ResponseHandler.sendFatalError({ res, error: err.errors, message: err.message, stack });
  };
}

module.exports = ErrorHandler;
