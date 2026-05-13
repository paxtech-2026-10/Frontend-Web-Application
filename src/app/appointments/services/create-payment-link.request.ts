/**
 * Payload para POST /api/v1/payments/create-payment-link
 * Backend: CreatePaymentLinkResource (record)
 * - paymentId > 0
 * - amount > 0
 * - currency no vacío (ej: "PEN")
 * - description: texto libre, se usa como nombre del Product en Stripe
 */
export interface CreatePaymentLinkRequest {
  paymentId: number;
  amount: number;
  currency: string;
  description: string;
}
