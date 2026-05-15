# language: es
@reservations @US18
Característica: Creación de citas por parte del cliente
  Como cliente
  Quiero poder agendar una cita según disponibilidad
  Para recibir el servicio deseado

  Escenario: Registro correcto de cita nueva
    Dado que existe un salón con un servicio, un trabajador y un slot disponible
    Y un cliente autenticado navega al detalle del salón
    Cuando reserva el servicio con el trabajador en el slot disponible
    Entonces el sistema persiste la reserva con su cliente, servicio, trabajador y slot
    Y el sistema persiste el pago en estado PENDING vinculado a la reserva
    Y la aplicación lo redirige a la pantalla de procesamiento de pago con el enlace de Stripe

  Escenario: Verificación de disponibilidad antes de agendar
    Dado que existe un salón con un servicio y un trabajador
    Pero el único slot del trabajador ya está reservado por otro cliente
    Y un cliente autenticado navega al detalle del salón
    Cuando intenta confirmar una reserva sin slots disponibles
    Entonces el sistema no persiste ninguna nueva reserva
    Y el calendario no ofrece slots seleccionables para esa fecha
