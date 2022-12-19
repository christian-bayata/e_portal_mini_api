import { Router } from "express";
const authRouter = Router();
import authController from "../controllers/auth.controller";

authRouter.post("/verification-code", authController.getVerificationCode);

export default authRouter;
