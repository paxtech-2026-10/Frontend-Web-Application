import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { BaseService } from '../../shared/services/base.service';
import { PaymentResponse } from './payment.response';
import { CreatePaymentRequest } from './create-payment.request';
import { CreatePaymentLinkRequest } from './create-payment-link.request';
import { PaymentLinkResponse } from './payment-link.response';

@Injectable({
  providedIn: 'root'
})
export class PaymentApiService extends BaseService<PaymentResponse> {
  override resourceEndpoint = '/payments';

  constructor() {
    super();
  }

  /**
   * Crea un Payment vinculado a una Reservation existente.
   * Backend: POST /api/v1/payments
   */
  public createPayment(request: CreatePaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(
      this.resourcePath(),
      JSON.stringify(request),
      this.httpOptions
    ).pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Solicita al backend que genere un Payment Link de Stripe para un Payment ya creado.
   * Backend: POST /api/v1/payments/create-payment-link
   * Devuelve la URL pública de Stripe a la que se redirige al usuario.
   */
  public createPaymentLink(request: CreatePaymentLinkRequest): Observable<PaymentLinkResponse> {
    return this.http.post<PaymentLinkResponse>(
      `${this.resourcePath()}/create-payment-link`,
      JSON.stringify(request),
      this.httpOptions
    ).pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Polling: consulta el estado actual del Payment.
   * El webhook de Stripe (lado backend) actualiza paymentStatus de PENDING → SUCCEEDED/FAILED.
   * Backend: GET /api/v1/payments/{paymentId}
   */
  public getPaymentStatus(paymentId: number): Observable<PaymentResponse> {
    return this.getById(paymentId);
  }
}
