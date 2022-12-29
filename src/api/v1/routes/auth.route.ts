import { Router } from "express";
const authRouter = Router();
import authController from "../controllers/auth.controller";
import userMiddleware from "../../../middlewares/user.middleware";

authRouter.post("/verification-code", authController.getVerificationCode);

authRouter.post("/signup/:flag", userMiddleware.signupValidation, authController.userSignup);

authRouter.post("/login/:flag", userMiddleware.loginValidation, authController.userLogin);

authRouter.post("/forgot-password", authController.forgotPassword);

authRouter.post("/reset-password/:token", authController.resetPassword);

export default authRouter;
