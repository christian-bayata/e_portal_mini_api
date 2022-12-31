import { Request, Response } from "express";
import { AdditionalResponse } from "../../../utils/interfaces/utils.interfaces";
import userRepository from "../../../repositories/user.repository";
import codeRepository from "../../../repositories/code.repository";
import ResponseHandler from "../../../utils/response";
import * as crypto from "crypto";
import { BuildResponse } from "../../../utils/interfaces/utils.interfaces";
import sendEmail from "../../../utils/send_email";
import { statusCodes } from "../../../status-code";
import * as _ from "lodash";
import { v2 as cloudinary } from "cloudinary";
import util from "util";
import request from "request";
const theRequest = util.promisify(request);
import helper from "../../../utils/helper";

/**
 * @Author Edomaruse, Frank
 * @Title User verification code
 * @Param req
 * @Param res
 * @returns {Promise<BuildResponse.SuccessObj | undefined>}
 */

const getVerificationCode = async (req: Request, res: Response): Promise<BuildResponse.SuccessObj> => {
  const { email } = req.body;
  if (!email) return ResponseHandler.sendError({ res, statusCode: statusCodes.BAD_REQUEST, message: "Please provide an email" });

  try {
    /* Check if user with this email already exists */
    const confirmEmail = await userRepository.findUser({ email });
    if (confirmEmail) return ResponseHandler.sendError({ res, statusCode: statusCodes.BAD_REQUEST, message: "You already have an account with us" });

    /* Check if token already exists */
    const confirmToken = await codeRepository.confirmVerCode({ email });
    if (confirmToken) return ResponseHandler.sendError({ res, statusCode: statusCodes.BAD_REQUEST, message: "Code already exists" });

    /* Create verification code for user */
    const verCodeData = { email, code: crypto.randomBytes(3).toString("hex").toUpperCase() };
    const userCode = await codeRepository.createVerCode(verCodeData);

    /* Send verification code to recipients' email address */
    const message = `Hello, your verification code is ${userCode.code}.\n\n Thanks and regards`;
    await sendEmail({ email, subject: "Verification Code", message });

    return ResponseHandler.sendSuccess({ res, statusCode: statusCodes.CREATED, message: "Code successfully sent", body: userCode });
  } catch (error) {
    return ResponseHandler.sendFatalError({ res });
  }
};

/**
 * @Responsibility:  Sign up a new user
 *
 * @param req
 * @param res
 * @returns {Promise<BuildResponse.SuccessObj | undefined>}
 */

const userSignup = async (req: Request, res: AdditionalResponse): Promise<BuildResponse.SuccessObj | undefined> => {
  const { data } = res;
  const { matricNo, staffNo } = req.body;
  const { flag } = req.params;

  const validFlags = ["student", "staff"];
  if (!validFlags.includes(flag)) return ResponseHandler.sendError({ res, statusCode: statusCodes.BAD_REQUEST, message: "Invalid flag" });

  try {
    /* Check if user already exists */
    const userExists = await userRepository.findUser({ email: data.email });
    if (userExists) return ResponseHandler.sendError({ res, statusCode: statusCodes.CONFLICT, message: "User already exists" });

    /* Confirm that verification code exists */
    const confirmUserVerCode = await codeRepository.confirmVerCode({ email: data.email, code: data.verCode });
    if (!confirmUserVerCode) return ResponseHandler.sendError({ res, statusCode: statusCodes.BAD_REQUEST, message: "Invalid verification code, please try again." });

    /* Delete token if the received time is past 30 minutes */
    const timeDiff = +(Date.now() - confirmUserVerCode.createdAt.getTime());
    const timeDiffInMins = +(timeDiff / (1000 * 60));
    if (timeDiffInMins > 30) {
      await codeRepository.deleteVerCode({ email: data.email, code: data.verCode });
      return ResponseHandler.sendError({ res, statusCode: statusCodes.BAD_REQUEST, message: "The verification Code has expired, kindly request another." });
    }

    const userData = { firstName: data.firstName, lastName: data.lastName, email: data.email, password: data.password, profilePhoto: data.profilePhoto, dept: data.dept.toUpperCase(), faculty: data.faculty.toUpperCase(), phone: data.phone, flag };

    /* Upload images with cloudinary */
    const uploadPhoto = cloudinary.uploader.upload(userData.profilePhoto, { folder: "portal_avatar" });
    theRequest(await uploadPhoto).then(async (result) => {
      /* The url link generated by cloudinary for the profile photo */
      userData.profilePhoto = result.request.uri.href;

      /* Function to distinguish student signup from that of the staff */
      const signUp4StudentOrStaff = async (flag: string) => {
        const theUserData = flag == "student" ? { ...userData, matricNo, isStudent: 1 } : { ...userData, staffNo, isStaff: 1 };
        const createData = await userRepository.createUser(theUserData);
        const theCreatedData =
          flag == "student"
            ? _.pick(createData, ["_id", "firstName", "lastName", "email", "profilePhoto", "dept", "faculty", "phone", "matricNo", "isStudent"])
            : _.pick(createData, ["_id", "firstName", "lastName", "email", "profilePhoto", "dept", "faculty", "phone", "staffNo", "isStaff"]);
        /* Delete user verification code after signing up */
        await codeRepository.deleteVerCode({ email: data.email, code: data.verCode });

        return ResponseHandler.sendSuccess({ res, statusCode: statusCodes.CREATED, message: "User successfully signed up", body: theCreatedData });
      };

      if (flag == "student") {
        await signUp4StudentOrStaff("student");
      } else {
        await signUp4StudentOrStaff("staff");
      }
    });
  } catch (error) {
    return ResponseHandler.sendFatalError({ res });
  }
};

/**
 * @Responsibility:  Login an existing user
 *
 * @param req
 * @param res
 * @returns {Promise<BuildResponse.SuccessObj>}
 */

const userLogin = async (req: Request, res: AdditionalResponse): Promise<BuildResponse.SuccessObj> => {
  const { data } = res;
  const { flag } = req.params;

  const validFlags = ["student", "staff"];
  if (!validFlags.includes(flag)) return ResponseHandler.sendError({ res, statusCode: statusCodes.BAD_REQUEST, message: "Invalid flag" });

  try {
    /* Check if user already exists */
    const userExists = flag == "student" ? await userRepository.findUser({ matricNo: data.matricNo }) : await userRepository.findUser({ staffNo: data.staffNo });
    if (!userExists) return ResponseHandler.sendError({ res, statusCode: statusCodes.NOT_FOUND, message: "Sorry you do not have an account with us. Please sign up" });

    /* validate user password with bcrypt */
    const validPassword = await userExists?.comparePassword(data.password);
    if (!validPassword) return ResponseHandler.sendError({ res, statusCode: statusCodes.BAD_REQUEST, message: "Incorrect Password" });

    /* Generate JWT token for user */
    const token = flag == "student" ? userExists?.generateJsonWebToken("student") : userExists?.generateJsonWebToken("staff");

    /* Format and hash user data for security */
    const protectedData = helper.formatUserData(userExists);

    return ResponseHandler.sendSuccess({ res, statusCode: statusCodes.OK, message: "User successfully logged in", body: { token, protectedData } });
  } catch (error) {
    return ResponseHandler.sendFatalError({ res });
  }
};

/**
 * @Responsibility: Provide user with password reset token
 *
 * @param req
 * @param res
 * @returns {Promise<BuildResponse.SuccessObj>}
 */

const forgotPassword = async (req: Request, res: Response): Promise<BuildResponse.SuccessObj> => {
  const { email } = req.body;

  if (!email) return ResponseHandler.sendError({ res, statusCode: statusCodes.BAD_REQUEST, message: "Please provide a valid email" });

  try {
    const user = await userRepository.findUser({ email });
    if (!user) return ResponseHandler.sendError({ res, statusCode: statusCodes.NOT_FOUND, message: "Sorry you do not have an account with us. Please sign up" });

    //Create reset password token and save
    const getResetToken = await helper.resetToken(user);

    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/reset-password/${getResetToken}`;

    //Set the password reset email message for client
    const message = `This is your password reset token: \n\n${resetUrl}\n\nIf you have not requested this email, then ignore it`;

    //The reset token email
    await sendEmail({ email: user.email, subject: "Password Recovery", message });

    return ResponseHandler.sendSuccess({ res, statusCode: statusCodes.OK, message: "Password reset token successfully sent" });
  } catch (error) {
    console.log(error);
    return ResponseHandler.sendFatalError({ res });
  }
};

/**
 * @Responsibility: Enables user reset password with reset token
 *
 * @param req
 * @param res
 * @returns {Promise<BuildResponse.SuccessObj>}
 */

const resetPassword = async (req: Request, res: Response): Promise<BuildResponse.SuccessObj> => {
  const { password, confirmPassword } = req.body;
  const { token } = req.params;

  if (!token) return ResponseHandler.sendError({ res, statusCode: statusCodes.BAD_REQUEST, message: "Provide the reset token" });

  try {
    const user = await userRepository.findUser({ resetPasswordToken: token });
    if (!user) return ResponseHandler.sendError({ res, statusCode: statusCodes.BAD_REQUEST, message: "Password reset token is invalid" });

    // Check to see if the token is still valid
    if (user.resetPasswordDate) {
      const timeDiff = +(Date.now() - user.resetPasswordDate.getTime());
      const timeDiffInMins = +(timeDiff / (1000 * 60));

      if (timeDiffInMins > 30) {
        user.resetPasswordToken = undefined;
        user.resetPasswordDate = undefined;
        await user.save();

        return ResponseHandler.sendError({ res, statusCode: statusCodes.BAD_REQUEST, message: "Password reset token has expired" });
      }
    }

    // Confirm if the password matches
    if (password !== confirmPassword) return ResponseHandler.sendError({ res, statusCode: statusCodes.BAD_REQUEST, message: "Password does not match" });

    // If password matches
    user.password = password;

    user.resetPasswordToken = undefined;
    user.resetPasswordDate = undefined;
    await user.save();

    // Generate another Auth token for user
    const authToken = !!user.isStudent ? user?.generateJsonWebToken("student") : user?.generateJsonWebToken("staff");

    /* Format and hash user data for security */
    const protectedData = helper.formatUserData(user);

    return ResponseHandler.sendSuccess({ res, statusCode: statusCodes.OK, message: "Password reset is successful", body: { token: authToken, userData: protectedData } });
  } catch (error) {
    console.log(error);
    return ResponseHandler.sendFatalError({ res });
  }
};

export default { getVerificationCode, userSignup, userLogin, forgotPassword, resetPassword };
