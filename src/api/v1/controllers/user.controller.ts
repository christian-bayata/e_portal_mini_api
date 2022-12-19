import { Request, Response } from "express";
import userRepository from "../../../repositories/user.repository";
import codeRepository from "../../../repositories/code.repository";
import ResponseHandler from "../../../utils/response";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { BuildResponse } from "../../../utils/interfaces/utils.interfaces";
import sendEmail from "../../../utils/send_email";
import { statusCodes } from "../../../status-code";

/**
 * @Title User verification code
 * @Param req
 * @Param res
 * @Returns Returns the verification code of the user
 *
 */
const getVerificationCode = async (req: Request, res: Response): Promise<BuildResponse.SuccessObj> => {
  const { email } = req.body;
  if (!email) return ResponseHandler.sendError({ res, statusCode: statusCodes.BAD_REQUEST, error: "Please provide an email" });

  try {
    /* Check if user with this email already exists; */
    const confirmEmail = await userRepository.findEmail({ email });
    if (confirmEmail) return ResponseHandler.sendError({ res, statusCode: statusCodes.BAD_REQUEST, error: "You already have an account with us" });

    /* Create verification code for user */
    const verCodeData = { email, code: crypto.randomBytes(3).toString("hex").toUpperCase() };
    const userCode = await codeRepository.createVerCode(verCodeData);

    /* Send verification code to recipients' email address */
    const message = `Hello, your verification code is ${userCode.code}.\n\n Thanks and regards`;
    await sendEmail({ email, subject: "Verification Code", message });

    return ResponseHandler.sendSuccess({ res, statusCode: statusCodes.CREATED, message: "Code successfully sent", body: userCode });
  } catch (error) {
    console.log("********************: ", error);
    return ResponseHandler.sendFatalError({ res });
  }
};

export default { getVerificationCode };
