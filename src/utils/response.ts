const { statusCodes } = require("../status-code");
import { BuildResponse } from "./interfaces/utils.interfaces";

class ResponseHandler {
  /**
   *
   * @param param0
   * @returns {*}
   */
  static sendSuccess({ res, success = true, statusCode = statusCodes.OK, message = "Successful Operation", body = {} }: BuildResponse.SuccessInput): any {
    return res.status(statusCode).send({ success, message, body });
  }

  /**
   *
   * @param param0
   * @returns {*}
   */
  static sendError({ res, success = false, statusCode = statusCodes.BAD_REQUEST, error = "Failed Operation", body = {} }: BuildResponse.ErrorInput): any {
    return res.status(statusCode).send({ success, error, body });
  }

  /**
   *
   * @param param0
   * @returns {*}
   */
  static sendFatalError({ res, success = false, statusCode = statusCodes.INTERNAL_SERVER_ERROR, message = "Internal server error", body = {}, error, stack }: BuildResponse.FatalErrorInput): any {
    return res.status(statusCode).send({ success, message, body, error, stack });
  }
}

export default ResponseHandler;
