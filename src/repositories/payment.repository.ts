import { PaymentDto, PaymentDataInput } from "../dto/payment.dto";
import Payment from "../models/payment.model";

/**
 *
 * @param data
 * @returns {Promise<Partial<PaymentDto>>}
 */

const createPayment = async (data: PaymentDto): Promise<Partial<PaymentDto>> => {
  return await Payment.create(data);
};

/**
 *
 * @param where
 * @returns {Promise<PaymentDto | null>}
 */

const findPayment = async (where: PaymentDataInput): Promise<PaymentDto | null> => {
  return await Payment.findOne(where);
};

export default { createPayment, findPayment };
