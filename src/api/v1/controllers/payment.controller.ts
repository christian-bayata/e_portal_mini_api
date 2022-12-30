import { Request, Response } from "express";
import { AdditionalResponse } from "../../../utils/interfaces/utils.interfaces";
import request from "request";
import util from "util";
const theRequest = util.promisify(request);
import { BuildResponse } from "../../../utils/interfaces/utils.interfaces";
import ResponseHandler from "../../../utils/response";
import { statusCodes } from "../../../status-code";

/**
 * @Responsibility: Paystack external API to initilaize user payment
 *
 * @param req
 * @param res
 * @returns {Promise<BuildResponse.SuccessObj | undefined>}
 */

const initializePayment = async (req: Request, res: AdditionalResponse): Promise<BuildResponse.SuccessObj | undefined> => {
  const { user } = res;
  const { amount, email } = req.body;

  try {
    const url = `https://api.paystack.co/transaction/initialize`;
    const SECRET = process.env.PAYSTACK_TEST_SK;

    const options = {
      method: "POST",
      url: url,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${SECRET}`,
      },
      body: { amount: amount * 100, email, metadata: { firstName: user.firstName, lastName: user.lastName } },
      json: true,
    };

    theRequest(options).then((resp) => {
      if (resp.body.status == true) {
        return ResponseHandler.sendSuccess({ res, statusCode: statusCodes.OK, message: resp.body.message, body: resp.body.data });
      }

      if (resp.body.status == false) {
        return ResponseHandler.sendError({ res, statusCode: statusCodes.BAD_REQUEST, message: "Authorization url not successfully created" });
      }
    });
  } catch (error) {
    return ResponseHandler.sendFatalError({ res });
  }
};

export default { initializePayment };
