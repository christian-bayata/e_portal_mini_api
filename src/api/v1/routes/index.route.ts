import { Router } from "express";
const indexRouter = Router();
import authRouter from "./auth.route";
import paymentRouter from "./payment.route";

indexRouter.use("/auth", authRouter);
indexRouter.use("/payment", paymentRouter);

export default indexRouter;
