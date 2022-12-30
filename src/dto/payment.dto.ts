export interface PaymentDto {
  _id?: string;
  amount: number;
  email: string;
  reference: number;
  paidAt: Date;
  currency: string;
  session: string;
  user: string;
}
