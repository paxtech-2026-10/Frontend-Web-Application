# language: es
@profiles
Característica: Personalización del perfil del salón
  Como dueño o administrador
  Quiero personalizar el perfil de mi salón con información relevante
  Para atraer a más clientes desde la búsqueda de salones

  @US06
  Escenario: Personalización de la ubicación del salón al registrarse como proveedor
    Dado que un visitante navega al formulario de registro de uTime
    Y la geolocalización del navegador apunta a "-12.121100,-77.030600"
    Y la dirección "Av. Larco 123, Miraflores, Lima" se resuelve a coordenadas conocidas
    Cuando completa el registro como proveedor con la empresa "Pax Salon BDD" y la dirección anterior
    Entonces el backend confirma la actualización del perfil con HTTP 200
    Y la ubicación persistida del perfil contiene la dirección y las coordenadas registradas
