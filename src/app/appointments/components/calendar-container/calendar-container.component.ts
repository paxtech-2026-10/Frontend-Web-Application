import {Component, inject, Input, OnInit} from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import {FullCalendarModule} from '@fullcalendar/angular';

import {ClientAppointment} from '../../model/appointment.entity';

import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import {Service} from '../../../services/model/service.entity';
import {Worker} from '../../../dashboard/models/worker.entity';
import {AppointmentApiService} from '../../services/appointment-api-service.service';
import {AppointmentAssembler} from '../../services/appointment.assembler';
import {TimeSlotApiService} from '../../services/time-slot-api.service';
import {PaymentApiService} from '../../services/payment-api.service';
import {ReservationApiService} from '../../services/reservation-api.service';

// ─────────────────────────────────────────────────────
// LEGACY (2026-05-06): Stripe hardcodeado del lado cliente.
// Reemplazado por: backend POST /api/v1/payments/create-payment-link
// Razón: bypaseaba al backend, doble flujo de checkout, key publishable
// hardcodeada, y el webhook nunca podía correlacionar el Payment.
// import {loadStripe} from '@stripe/stripe-js';
// ─────────────────────────────────────────────────────

/**
 * Descripción que se envía al backend cuando se crea el Payment Link.
 * Se usa como nombre del Product en Stripe.
 *
 * Por ahora es estática para alinearse con el flujo móvil. Cuando se quiera
 * volver dinámica, basta con construirla a partir de `this.service` y
 * pasarla como argumento al `paymentApi.createPaymentLink(...)` más abajo.
 */
const PAYMENT_DESCRIPTION = 'Reserva de servicio';
const PAYMENT_CURRENCY = 'PEN';

@Component({
  selector: 'app-week-calendar',
  template: '<full-calendar [options]="calendarOptions"></full-calendar>',
  standalone: true,
  imports: [FullCalendarModule]
})
export class WeekCalendarComponent implements OnInit {

  @Input({ required: true }) service!: Service;   // servicio elegido
  @Input({ required: false }) worker!: Worker;     // staff elegido
  @Input({ required: true }) providerId!: number;

  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, timeGridPlugin],
    initialView: 'timeGridWeek',
    selectable: true,
    slotDuration: '00:30:00',
    // Impide navegar y seleccionar fechas/horas pasadas
    validRange: { start: new Date() },
    selectAllow: (selectInfo) => selectInfo.start.getTime() >= Date.now(),
    headerToolbar: { left: 'prev,next today', center: 'title', right: 'timeGridWeek,timeGridDay' },
    events: [],
    select: this.handleDateSelect.bind(this)
  };

  private appointments: ClientAppointment[] = [];
  private api   = inject(AppointmentApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  private timeSlotApi = inject(TimeSlotApiService);
  private paymentApi = inject(PaymentApiService);
  private reservationApi = inject(ReservationApiService);

  ngOnInit(): void { this.loadAppointments(); }

  /* ---------- Carga citas existentes ---------- */
  private loadAppointments(): void {
    const providerId = this.getProviderId();

    this.api.getAll().subscribe(res => {
      this.appointments = AppointmentAssembler.toEntitiesFromResponse(res)
        .filter(a => a.provider.id === providerId);

      const events: EventInput[] = this.appointments.map(a => ({
        title: `${a.workerId.specialization} - cliente ${a.clientId}`,
        start: a.timeSlot.startTime,
        end:   a.timeSlot.endTime,
        extendedProps: { appointmentId: a.id }
      }));

      this.calendarOptions = { ...this.calendarOptions, events };
    });
  }

  /* ---------- Selección y POST ---------- */
  private handleDateSelect(sel: any): void {
    if (!this.service?.id) {
      this.snackBar.open('Selecciona un servicio antes de reservar.', 'Cerrar', { duration: 3000 });
      return;
    }

    if (!this.worker?.id) {
      this.snackBar.open('Selecciona un profesional antes de reservar.', 'Cerrar', { duration: 3000 });
      return;
    }

    const duration = this.service?.duration ?? 30;
    const start = new Date(sel.start);
    const end = new Date(start.getTime() + duration * 60000);

    if (start.getTime() < Date.now()) {
      this.snackBar.open('No puedes reservar en una fecha u hora pasada.', 'Cerrar', { duration: 3000 });
      return;
    }

    const overlaps = this.appointments.some(ap => {
      const s = new Date(ap.timeSlot.startTime).getTime() - 10 * 60000;
      const e = new Date(ap.timeSlot.endTime).getTime() + 10 * 60000;
      return start.getTime() < e && end.getTime() > s;
    });
    if (overlaps) {
      this.snackBar.open('⚠ Hay otra cita muy cerca.', 'Cerrar', { duration: 3000 });
      return;
    }

    // Modal de confirmación a medida (reemplaza el window.confirm nativo)
    this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: {
        title: 'Confirmar reserva',
        message: `¿Deseas reservar de ${start.toLocaleTimeString()} a ${end.toLocaleTimeString()}?`,
        confirmText: 'Confirmar',
        cancelText: 'Cancelar'
      }
    }).afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.confirmReservation(start, end);
      }
    });
  }

  private confirmReservation(start: Date, end: Date): void {
    const providerId = this.getProviderId();
    const clientId = Number(localStorage.getItem('clientId'));
    if (!clientId) {
      this.snackBar.open('No se encontró clientId en sesión. Vuelve a iniciar sesión.', 'Cerrar', { duration: 4000 });
      return;
    }
    const workerId = this.worker.id;

    function toLocalISOString(date: Date): string {
      const offsetMs = date.getTimezoneOffset() * 60000;
      const localISOTime = new Date(date.getTime() - offsetMs).toISOString().slice(0, 19);
      return localISOTime;
    }
    const startIsoLocal = toLocalISOString(start);
    const endIsoLocal   = toLocalISOString(end);

    // ─────────────────────────────────────────────────────
    // FLUJO ACTUAL (2026-05-06): TimeSlot → Reservation → Payment → PaymentLink
    // Espejo del flujo móvil (ver Mobile-App/.../ConfirmationViewModel.kt).
    // ─────────────────────────────────────────────────────

    // 1. Crear TimeSlot
    this.timeSlotApi.post({
      id: 0,
      startTime: startIsoLocal,
      endTime: endIsoLocal,
      status: true,
      type: this.worker.specialization,
    }).subscribe({
      next: timeSlot => this.createReservationFor(timeSlot, providerId, clientId, workerId),
      error: err => this.snackBar.open('❌ Error creando horario: ' + err.message, 'Cerrar', { duration: 3000 })
    });
  }

  private createReservationFor(timeSlot: any, providerId: number, clientId: number, workerId: number): void {
    // 2. Crear Reservation con serviceId (el backend ignoraba paymentId, ahora envía lo correcto)
    this.reservationApi.post({
      clientId,
      providerId,
      serviceId: this.service.id,
      timeSlotId: timeSlot.id,
      workerId
    }).subscribe({
      next: (reservation: any) => this.createPaymentFor(reservation, clientId),
      error: err => this.snackBar.open('❌ Error creando reserva: ' + err.message, 'Cerrar', { duration: 3000 })
    });
  }

  private createPaymentFor(reservation: any, clientId: number): void {
    // 3. Crear Payment vinculado a la Reservation
    this.paymentApi.createPayment({
      amount: this.service.price,
      currency: PAYMENT_CURRENCY,
      reservationId: reservation.id,
      clientId
    }).subscribe({
      next: payment => this.createPaymentLinkFor(payment, reservation.id),
      error: err => this.snackBar.open('❌ Error creando pago: ' + err.message, 'Cerrar', { duration: 3000 })
    });
  }

  private createPaymentLinkFor(payment: any, reservationId: number): void {
    // 4. Pedir Payment Link al backend (el backend habla con Stripe del lado servidor)
    this.paymentApi.createPaymentLink({
      paymentId: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      description: PAYMENT_DESCRIPTION
    }).subscribe({
      next: linkResponse => {
        // 5. Navegar a payment-processing — esa pantalla abre Stripe en una pestaña nueva
        //    y hace polling al backend hasta detectar SUCCEEDED/FAILED.
        this.router.navigate(
          ['/client/payment-processing', reservationId, payment.id],
          { queryParams: { paymentLinkUrl: linkResponse.paymentLinkUrl } }
        );
      },
      error: err => this.snackBar.open('❌ Error generando link de pago: ' + err.message, 'Cerrar', { duration: 3000 })
    });
  }

  // ─────────────────────────────────────────────────────
  // LEGACY (2026-05-06): flujo viejo — TimeSlot → Payment → Reservation + Stripe hardcoded.
  //
  // Bugs identificados:
  //   • Orden invertido: el backend modela Payment.reservationId, no al revés.
  //   • El payload de Reservation enviaba `paymentId` que el backend ignoraba; faltaba `serviceId`.
  //   • Doble flujo de Stripe: window.location.href + redirectToCheckout en paralelo.
  //   • Stripe publishable key hardcodeada en el código fuente.
  //   • alert/confirm nativos en lugar de MatSnackBar/MatDialog.
  //
  // Reemplazado por handleDateSelect + helpers de arriba.
  // ─────────────────────────────────────────────────────
  // private handleDateSelectLegacy(sel: any): void {
  //   // ... (código original conservado en git history)
  //   //
  //   // this.timeSlotApi.post({...}).subscribe(timeSlot => {
  //   //   this.paymentApi.post({...}).subscribe(payment => {
  //   //     this.reservationApi.post({...}).subscribe({
  //   //       next: () => {
  //   //         alert('✅ Cita reservada');
  //   //         this.loadAppointments();
  //   //         window.location.href = 'https://buy.stripe.com/test_eVq00l2Dz6EJ4iN2Wz5os00';
  //   //       },
  //   //       error: e => alert('❌ Error en reserva: ' + e.message)
  //   //     });
  //   //   }, err => alert('❌ Error en pago: ' + err.message));
  //   // }, err => alert('❌ Error en horario: ' + err.message));
  //   //
  //   // const stripePromise = loadStripe('pk_test_51RO93KQjzoQNilXPLpic68sHjDYb1tcVKSpYNcjqQv0uZUB7dg7mxLL2JzkjmTNzwyf9WCWa8sDAEcB0qcLX7Uw100WAGbxwW4');
  //   // stripePromise.then(stripe => {
  //   //   stripe!.redirectToCheckout({
  //   //     lineItems: [{ price: 'price_1RhIY5QjzoQNilXPLxfTT1JP', quantity: 1 }],
  //   //     mode: 'payment',
  //   //     successUrl: window.location.origin + '/client/homeClient',
  //   //     cancelUrl: window.location.origin + '/client/homeClient'
  //   //   }).then(result => {
  //   //     if (result.error) alert('Error en checkout: ' + result.error.message);
  //   //   });
  //   // });
  // }

  private getProviderId(): number {
    return Number(this.providerId || this.route.snapshot.paramMap.get('id'));
  }
}
