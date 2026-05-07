/**
 * Estados posibles de un Payment.
 * Espejo del enum PaymentStatus.java del backend (reservations bounded context).
 */
export type PaymentStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';
