/**
 * Respuesta de POST /api/v1/payments/create-payment-link
 * Backend: PaymentLinkResponse (record)
 * Devuelve la URL de Stripe a la que se redirige al usuario para completar el pago.
 */
export interface PaymentLinkResponse {
  paymentLinkUrl: string;
}
