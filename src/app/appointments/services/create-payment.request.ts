/**
 * Payload para POST /api/v1/payments
 * Backend: CreatePaymentResource (record)
 * - amount > 0
 * - currency no vacío (ej: "PEN")
 * - reservationId > 0
 * - clientId > 0
 */
export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  reservationId: number;
  clientId: number;
}
