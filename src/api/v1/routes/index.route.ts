import { Router } from "express";
const indexRouter = Router();
import authRouter from "./auth.route";
import paymentRouter from "./payment.route";
import courseRouter from "./course.route";

indexRouter.use("/auth", authRouter);
indexRouter.use("/payment", paymentRouter);
indexRouter.use("/course", courseRouter);

export default indexRouter;
