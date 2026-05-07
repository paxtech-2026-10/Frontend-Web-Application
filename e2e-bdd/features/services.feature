# language: es
@services @US22
Característica: Administración de servicios ofrecidos
  Como dueño o administrador
  Quiero agregar, editar o eliminar servicios
  Para mantener mi catálogo actualizado

  Escenario: Registro de nuevo servicio
    Dado que el administrador proveedor está autenticado
    Y se encuentra en la página de servicios
    Cuando completa los datos necesarios para registrar un servicio llamado "Corte BDD" con duración 45 y precio 80
    Entonces el sistema guarda el nuevo servicio
    Y el servicio registrado aparece en el catálogo de servicios

  Escenario: Eliminación de servicio registrado
    Dado que el administrador proveedor está autenticado
    Y tiene un servicio registrado llamado "Servicio BDD" en el catálogo
    Y se encuentra en la página de servicios
    Cuando elimina el servicio registrado del catálogo
    Entonces el sistema retira el servicio del catálogo
    Y el servicio eliminado ya no aparece en la página de servicios
