import { PaymentDto } from "../dto/payment.dto";
import Payment from "../models/payment.model";

/**
 *
 * @param data
 * @returns {Promise<Partial<PaymentDto>>}
 */

const createPayment = async (data: PaymentDto): Promise<Partial<PaymentDto>> => {
  return await Payment.create(data);
};

export default { createPayment };
