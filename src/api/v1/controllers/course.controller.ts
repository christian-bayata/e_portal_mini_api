import { Request } from "express";
import { AdditionalResponse } from "../../../utils/interfaces/utils.interfaces";
import ResponseHandler from "../../../utils/response";
import courseRepository from "../../../repositories/course.repository";
import { statusCodes } from "../../../status-code";

/**
 * @Author Edomaruse, Frank
 * @Title Admin create course
 * @Param req
 * @Param res
 * @returns {Promise<BuildResponse.SuccessObj | undefined>}
 *
 */

const createCourse = async (req: Request, res: AdditionalResponse) => {
  const { admin, data } = res;

  if (!admin) return ResponseHandler.sendError({ res, statusCode: statusCodes.UNAUTHORIZED, message: "You are not authorized" });

  try {
    const isCreated = await courseRepository.findCourse({ code: data.code });
    if (isCreated) return ResponseHandler.sendError({ res, statusCode: statusCodes.BAD_REQUEST, message: "This course has already been created" });

    const courseData = { name: data.name.toUpperCase(), code: data.code, units: data.units, semester: data.semester, session: data.session, registered_students: [] };
    const createdCourse = await courseRepository.createCourse(courseData);

    return ResponseHandler.sendSuccess({ res, statusCode: statusCodes.CREATED, message: "Course successfully created", body: createdCourse });
  } catch (error) {
    return ResponseHandler.sendFatalError({ res });
  }
};

export default { createCourse };
