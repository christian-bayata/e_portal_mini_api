import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import ResponseHandler from "../utils/response";
import { AdditionalResponse } from "../utils/interfaces/utils.interfaces";
// import status from "../status-code";
// import * as jwt from "jsonwebtoken";

/**
 * @Responsibility: Validation middleware for user sign up
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */

const signupValidation = async (req: Request, res: AdditionalResponse, next: NextFunction) => {
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
    return error;
  }
};

export default { signupValidation };
