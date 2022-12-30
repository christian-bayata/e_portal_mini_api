import { Request, Response } from "express";
import { AdditionalResponse } from "../../../utils/interfaces/utils.interfaces";
import request from "request";
import util from "util";
const theRequest = util.promisify(request);
import { BuildResponse } from "../../../utils/interfaces/utils.interfaces";
import ResponseHandler from "../../../utils/response";
import { statusCodes } from "../../../status-code";
import userRepository from "../../../repositories/user.repository";
import paymentRepository from "../../../repositories/payment.repository";

/**
 * @Responsibility: Paystack external API to initilaize user payment
 *
 * @param req
 * @param res
 * @returns {Promise<BuildResponse.SuccessObj | undefined>}
 */

const initializePayment = async (req: Request, res: AdditionalResponse): Promise<BuildResponse.SuccessObj | undefined> => {
  const { user } = res;
  const { amount, email, session } = req.body;

  try {
    const theUser = await userRepository.findUser({ _id: user._id });
    if (!theUser) return ResponseHandler.sendError({ res, statusCode: statusCodes.NOT_FOUND, message: "ID not found" });

    const url = `https://api.paystack.co/transaction/initialize`;
    const SECRET = process.env.PAYSTACK_TEST_SK;

    const options = {
      method: "POST",
      url: url,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${SECRET}`,
      },
      body: { amount: amount * 100, email, metadata: { session } },
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

/**
 * @Responsibility: Paystack external API to verify user payment
 *
 * @param req
 * @param res
 * @returns {Promise<BuildResponse.SuccessObj | undefined>}
 */

const verifyPayment = async (req: Request, res: AdditionalResponse): Promise<BuildResponse.SuccessObj | undefined> => {
  const { refId } = req.query;
  const { user } = res;

  if (!refId) return ResponseHandler.sendError({ res, statusCode: statusCodes.BAD_REQUEST, message: "Please provide your reference Id" });

  try {
    const url = `https://api.paystack.co/transaction/verify/${refId}`;
    const SECRET = process.env.PAYSTACK_TEST_SK;

    const options = {
      method: "GET",
      url: url,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${SECRET}`,
      },
      body: "{}",
    };

    theRequest(options).then(async (resp) => {
      const response = JSON.parse(resp.body);

      if (response.data.status == "success") {
        const { reference, currency, paid_at, amount, metadata, customer } = response.data;
        /* Save user payment info */
        const thePayment = await paymentRepository.createPayment({ reference, amount: +(amount / 100), email: customer.email, paidAt: paid_at, currency, session: metadata.session, user: user._id });

        return ResponseHandler.sendSuccess({ res, statusCode: statusCodes.OK, message: "Payment successfully verified", body: thePayment });
      }
    });
  } catch (error) {
    return ResponseHandler.sendFatalError({ res });
  }
};

export default { initializePayment, verifyPayment };
