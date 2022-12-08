import { Router } from "express";
const indexRouter = Router();
import userRouter from "./user.route";

indexRouter.use("/users", userRouter);

export default indexRouter;
