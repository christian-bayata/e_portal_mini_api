import { Router } from "express";
const CourseRouter = Router();
import courseController from "../controllers/course.controller";
import userMiddleware from "../../../middlewares/user.middleware";
import courseMiddleware from "../../../middlewares/course.middleware";

CourseRouter.post("/create", userMiddleware.isAdmin, courseMiddleware.createCourseValidation, courseController.createCourse);

export default CourseRouter;
