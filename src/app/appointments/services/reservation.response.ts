/**
 * Payload de POST /api/v1/reservationsDetails
 * Backend: CreateReservationResource (record)
 *
 * Mismatch corregido el 2026-05-06: el frontend enviaba `paymentId` que el
 * backend ignoraba silenciosamente, mientras que el backend espera `serviceId`
 * y lo dejaba en null. Ver Mobile-App/.../ReservationService.kt como referencia.
 */
export interface ReservationResponse {
  clientId: number;
  providerId: number;
  // ─────────────────────────────────────────────────────
  // LEGACY (2026-05-06): el backend nunca lee este campo.
  // paymentId: number;
  // ─────────────────────────────────────────────────────
  serviceId: number;
  timeSlotId: number;
  workerId: number;
}
