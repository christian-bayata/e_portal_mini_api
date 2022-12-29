import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import ResponseHandler from "../utils/response";
import { AdditionalResponse } from "../utils/interfaces/utils.interfaces";
import { UserDto } from "../dto/user.dto";
import { statusCodes } from "../status-code";
import * as jwt from "jsonwebtoken";
import { UserJwtPayload } from "../utils/interfaces/utils.interfaces";

/**
 * @Responsibility: Validation middleware for user sign up
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<UserDto>}
 */

const signupValidation = async (req: Request, res: AdditionalResponse, next: NextFunction): Promise<UserDto | void> => {
  const payload = req.body;
  const { flag } = req.params;

  try {
    const schema = Joi.object({
      firstName: Joi.string().min(3).max(15).required(),
      lastName: Joi.string().min(3).max(15).required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .lowercase()
        .required(),
      password: Joi.string().min(6).required(),
      profilePhoto: Joi.string().allow(""),
      dept: Joi.string().min(15).required(),
      faculty: Joi.string().min(15).required(),
      [flag == "student" ? "matricNo" : "staffNo"]: Joi.string().allow(""),
      phone: Joi.string().required(),
      verCode: Joi.string().max(6).required(),
    });

    const { error, value } = schema.validate(payload);

    if (error) {
      return ResponseHandler.sendError({ res, message: error.details[0].message });
    }

    res.data = value;
    return next();
  } catch (error) {
    throw error;
  }
};

/**
 * @Responsibility: Validation middleware for user sign up
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<UserDto | void>}
 */

const loginValidation = async (req: Request, res: AdditionalResponse, next: NextFunction): Promise<UserDto | void> => {
  const payload = req.body;
  const { flag } = req.params;

  try {
    const schema = Joi.object({
      [flag == "student" ? "matricNo" : "staffNo"]: Joi.string().required(),
      password: Joi.string().min(6).required(),
    });

    const { error, value } = schema.validate(payload);

    if (error) {
      return ResponseHandler.sendError({ res, message: error.details[0].message });
    }

    res.data = value;
    return next();
  } catch (error) {
    throw error;
  }
};

/**
 * @Responsibility:  Middleware authentication for users
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */

const authenticateUser = async (req: Request, res: AdditionalResponse, next: NextFunction) => {
  let { authorization } = req.headers;
  const { userId } = req.body;

  if (!authorization) {
    authorization = req.body.authorization;
  }

  // decode jwt token from req header
  const decode = jwt.verify(authorization as string, process.env.JWT_SECRET_KEY as string, (err, decoded) => decoded) as unknown as UserJwtPayload;

  // if token is invalid or has expired
  if (!authorization || !decode || !decode._id) {
    return ResponseHandler.sendError({ res, statusCode: statusCodes.UNAUTHENTICATED, message: "Unauthenticated! Please login" });
  }

  try {
    res.user = decode;
    return next();
  } catch (error) {
    // console.log(error);
    return ResponseHandler.sendFatalError({ res });
  }
};

export default { signupValidation, loginValidation, authenticateUser };
