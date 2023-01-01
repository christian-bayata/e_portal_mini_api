import { Request } from "express";
import { AdditionalResponse } from "../../../utils/interfaces/utils.interfaces";
import ResponseHandler from "../../../utils/response";
import courseRepository from "../../../repositories/course.repository";
import paymentRepository from "../../../repositories/payment.repository";
import { statusCodes } from "../../../status-code";
import { BuildResponse } from "../../../utils/interfaces/utils.interfaces";

/**
 * @Author Edomaruse, Frank
 * @Title Admin create course
 * @Param req
 * @Param res
 * @returns {Promise<BuildResponse.SuccessObj | undefined>}
 *
 */

const createCourse = async (req: Request, res: AdditionalResponse): Promise<BuildResponse.SuccessObj | undefined> => {
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

/**
 * @Title Students register course(s)
 * @Param req
 * @Param res
 * @returns {Promise<BuildResponse.SuccessObj | undefined>}
 *
 */

const registerCourse = async (req: Request, res: AdditionalResponse): Promise<BuildResponse.SuccessObj | undefined> => {
  const { user, data } = res;

  try {
    const hasPaid = await paymentRepository.findPayment({ user: user._id, session: data.session });
    if (!hasPaid) return ResponseHandler.sendError({ res, statusCode: statusCodes.BAD_REQUEST, message: "Course registration denied. Please make payment" });

    const theCourse = await courseRepository.findCourse({ _id: data.courseId });
    if (!theCourse) return ResponseHandler.sendError({ res, statusCode: statusCodes.NOT_FOUND, message: "Course does not exist" });

    /* Add student to the list of registered students for the selected course */
    if (theCourse._id) {
      await courseRepository.addStudentToCourse(theCourse._id, hasPaid.user);
    }

    return ResponseHandler.sendSuccess({ res, statusCode: statusCodes.CREATED, message: "Successfully registered course", body: theCourse });
  } catch (error) {
    return ResponseHandler.sendFatalError({ res });
  }
};

/**
 * @Title retrieve all user course(s) for a sesmeter
 * @Param req
 * @Param res
 * @returns {Promise<BuildResponse.SuccessObj | undefined>}
 *
 */

const retrieveUserCourses = async (req: Request, res: AdditionalResponse): Promise<BuildResponse.SuccessObj | undefined> => {
  const { user } = res;
  const { semester, session } = req.query;

  if (!semester || !session) return ResponseHandler.sendError({ res, statusCode: statusCodes.BAD_REQUEST, message: "Please provide semester or session" });

  try {
    const theCourses = await courseRepository.findCourses({ session });
    const studentsCourses = theCourses.map((course) => {
      const theRegisteredStudents = course.registered_students;
      let theStudentCourses;
      if (Array.isArray(theRegisteredStudents) && theRegisteredStudents.length) {
        const checkForStudent = theRegisteredStudents.some((s) => s == user._id);
        if (checkForStudent) {
          theStudentCourses = {
            courseId: course._id,
            name: course.name,
            code: course.code,
            units: course.units,
          };
        }
      }
      return theStudentCourses;
    });

    return ResponseHandler.sendSuccess({ res, statusCode: statusCodes.CREATED, message: "Successfully retrieved courses", body: studentsCourses });
  } catch (error) {
    return ResponseHandler.sendFatalError({ res });
  }
};

export default { createCourse, registerCourse, retrieveUserCourses };
