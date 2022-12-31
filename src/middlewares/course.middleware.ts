import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import ResponseHandler from "../utils/response";
import { AdditionalResponse } from "../utils/interfaces/utils.interfaces";
import { CourseDto } from "../dto/course.dto";

/**
 * @Responsibility: Validation middleware for course registration
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<CourseDto | void>}
 */

const createCourseValidation = async (req: Request, res: AdditionalResponse, next: NextFunction): Promise<CourseDto | void> => {
  const payload = req.body;

  try {
    const schema = Joi.object({
      name: Joi.string().min(6).required(),
      code: Joi.string().max(6).required(),
      units: Joi.number().required(),
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

export default { createCourseValidation };
