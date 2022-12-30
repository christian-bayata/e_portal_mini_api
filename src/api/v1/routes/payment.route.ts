import { Router } from "express";
const paymentRouter = Router();
import paymentController from "../controllers/payment.controller";
import userMiddleware from "../../../middlewares/user.middleware";

paymentRouter.post("/initialize-payment", userMiddleware.authenticateUser, paymentController.initializePayment);

export default paymentRouter;
