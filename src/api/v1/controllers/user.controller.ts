import { Request, Response } from "express";
import userRepository from "../../../repositories/user.repository";
import ResponseHandler from "../../../utils/response";
import crypto from "crypto";
import bcrypt from "bcrypt";

/**
 * @Title User verification code
 * @Param req
 * @Param res
 * @Returns Returns the verification code of the user
 *
 */
const getVerificationCode = async (req: Request, res: Response): Promise<Response> => {
  const { email } = req.body;

  try {
    // Check if user with this email already exists;
    const confirmEmail = await userRepository.findEmail({ email });
    if (confirmEmail) return ResponseHandler.sendError({ res, error: "You already have an account with us" });

    const verCodeData = { email, code: crypto.randomBytes(3).toString("hex").toUpperCase() };
    const userCode = await userRepository.createVerCode(verCodeData);

    return ResponseHandler.sendSuccess({ res, message: "Code successfully sent", body: userCode });
  } catch (error) {
    return ResponseHandler.sendFatalError({ res });
  }
};

export default { getVerificationCode };
