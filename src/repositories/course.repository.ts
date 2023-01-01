import { CourseDataInput, CourseDto } from "../dto/course.dto";
import Course from "../models/course.model";

/**
 *
 * @param where
 * @returns {Promise<CourseDto | null>}
 */

const findCourse = async (where: CourseDataInput): Promise<CourseDto | null> => {
  return await Course.findOne(where);
};

/**
 *
 * @param data
 * @returns {Promise<Partial<CourseDto>>}
 */

const createCourse = async (data: CourseDataInput): Promise<Partial<CourseDto>> => {
  return await Course.create(data);
};

/**
 *
 * @param courseId
 * @param studentId
 * @returns {Promise<CourseDto | null>}
 */
const addStudentToCourse = async (courseId: string, studentId: string): Promise<CourseDto | null> => {
  return await Course.findOneAndUpdate({ _id: courseId }, { $addToSet: { registered_students: studentId } }, { new: true });
};

export default { findCourse, createCourse, addStudentToCourse };
