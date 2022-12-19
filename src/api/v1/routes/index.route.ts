import { Router } from "express";
const indexRouter = Router();
import authRouter from "./auth.route";

indexRouter.use("/auth", authRouter);

export default indexRouter;
