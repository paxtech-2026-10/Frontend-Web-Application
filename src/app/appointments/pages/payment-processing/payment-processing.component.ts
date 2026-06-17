import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, Subscription, interval, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { PaymentApiService } from '../../services/payment-api.service';
import { PaymentResponse } from '../../services/payment.response';

type PaymentUiState =
  | 'ready'
  | 'polling'
  | 'succeeded'
  | 'failed'
  | 'timeout'
  | 'error';

const POLL_INTERVAL_MS = 5_000;
const MAX_POLL_ATTEMPTS = 60;
// Workaround: como el webhook de Stripe no confirma el pago, tras abrir Stripe
// regresamos automáticamente al dashboard luego de este tiempo.
const REDIRECT_AFTER_MS = 10_000;

@Component({
  selector: 'app-payment-processing',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './payment-processing.component.html',
  styleUrl: './payment-processing.component.css'
})
export class PaymentProcessingComponent implements OnInit, OnDestroy {
  status: PaymentUiState = 'ready';
  errorMessage: string | null = null;
  attempt = 0;
  readonly maxAttempts = MAX_POLL_ATTEMPTS;
  paymentLinkUrl = '';

  private reservationId!: number;
  private paymentId!: number;
  private hasOpenedBrowser = false;
  private destroy$ = new Subject<void>();
  private pollSubscription?: Subscription;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private paymentApi = inject(PaymentApiService);

  ngOnInit(): void {
    this.reservationId = Number(this.route.snapshot.paramMap.get('reservationId'));
    this.paymentId = Number(this.route.snapshot.paramMap.get('paymentId'));
    this.paymentLinkUrl = this.route.snapshot.queryParamMap.get('paymentLinkUrl') ?? '';

    if (!this.reservationId || !this.paymentId || !this.paymentLinkUrl) {
      this.status = 'error';
      this.errorMessage = 'Falta informacion del pago. Vuelve a intentarlo.';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.pollSubscription?.unsubscribe();
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange(): void {
    if (document.visibilityState === 'visible' && this.hasOpenedBrowser && this.status === 'polling') {
      this.checkStatusImmediately();
    }
  }

  startPaymentPolling(): void {
    if (this.status === 'polling') return;

    this.errorMessage = null;
    this.attempt = 0;
    this.hasOpenedBrowser = true;
    this.status = 'polling';
    this.startPolling();

    // El webhook de Stripe no llega a confirmar el pago, así que tras abrir Stripe
    // devolvemos al usuario al dashboard automáticamente luego de 10 segundos.
    timer(REDIRECT_AFTER_MS)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.goHome());
  }

  retry(): void {
    this.errorMessage = null;
    this.attempt = 0;
    this.status = 'ready';
    this.pollSubscription?.unsubscribe();
  }

  goHome(): void {
    this.router.navigate(['/client/homeClient']);
  }

  private startPolling(): void {
    this.pollSubscription?.unsubscribe();

    this.pollSubscription = interval(POLL_INTERVAL_MS).pipe(
      takeUntil(this.destroy$),
      switchMap(() => this.paymentApi.getPaymentStatus(this.paymentId))
    ).subscribe({
      next: payment => this.handlePaymentUpdate(payment),
      error: err => {
        this.status = 'error';
        this.errorMessage = err?.message ?? 'No pudimos verificar el estado del pago.';
      }
    });
  }

  private checkStatusImmediately(): void {
    this.paymentApi.getPaymentStatus(this.paymentId).subscribe({
      next: payment => this.handlePaymentUpdate(payment),
      error: () => { /* keep polling */ }
    });
  }

  private handlePaymentUpdate(payment: PaymentResponse): void {
    this.attempt++;

    switch (payment.paymentStatus) {
      case 'SUCCEEDED':
        this.status = 'succeeded';
        this.pollSubscription?.unsubscribe();
        break;
      case 'FAILED':
      case 'CANCELED':
        this.status = 'failed';
        this.errorMessage = 'El pago no se completo.';
        this.pollSubscription?.unsubscribe();
        break;
      case 'PENDING':
        if (this.attempt >= this.maxAttempts) {
          this.status = 'timeout';
          this.errorMessage = 'Tiempo de espera agotado. Si ya pagaste, tu reserva se confirmara automaticamente.';
          this.pollSubscription?.unsubscribe();
        }
        break;
    }
  }
}
