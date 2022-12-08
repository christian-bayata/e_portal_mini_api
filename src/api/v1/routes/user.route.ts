import { Router } from "express";
const userRouter = Router();
import userController from "../controllers/user.controller";

userRouter.post("/verification-code", userController.getVerificationCode);

export default userRouter;
