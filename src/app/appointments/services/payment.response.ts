import { PaymentStatus } from './payment-status.enum';

// ─────────────────────────────────────────────────────
// LEGACY (2026-05-06): Estructura previa al rework de Stripe
// Reemplazado por la nueva PaymentResponse alineada al backend (PaymentResource record).
// Razón: el backend evolucionó a usar PaymentStatus enum + campos de Stripe; el viejo
// `status: boolean` se mantiene en BD por compatibilidad pero no debe consumirse desde frontend.
// ─────────────────────────────────────────────────────
// export interface PaymentResponse {
//   id: number;
//   amount: number;
//   currency: string;
//   status: boolean;
// }

/**
 * Respuesta de POST /api/v1/payments y GET /api/v1/payments/{id}
 * Backend: PaymentResource (record)
 */
export interface PaymentResponse {
  id: number;
  amount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  stripePaymentLinkId: string | null;
  stripeCheckoutSessionId: string | null;
  reservationId: number;
  clientId: number;
}
