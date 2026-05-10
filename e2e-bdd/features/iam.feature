# language: es
@iam
Característica: Autenticación e identidad de usuarios
  Como usuario de uTime
  Quiero poder registrarme y autenticarme en la plataforma
  Para acceder a mi cuenta y a las funciones que me corresponden

  @US01
  Escenario: Registro de un cliente desde el formulario público
    Dado que un visitante navega al formulario de registro de uTime
    Cuando completa el registro como cliente con nombre "Gael", apellido "BDD", correo y contraseña válidos
    Entonces el sistema confirma la creación de la cuenta con un snackbar de éxito
    Y la aplicación lo redirige a la página de inicio de sesión

  @US03
  Escenario: Inicio de sesión de un proveedor con credenciales válidas
    Dado que existe un proveedor previamente registrado en el sistema
    Y el proveedor navega a la página de inicio de sesión
    Cuando ingresa su correo y contraseña y envía el formulario
    Entonces el sistema lo redirige al dashboard del proveedor
    Y persiste el identificador del proveedor en el almacenamiento local
