import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('jwt_token');

  if (token) {
    console.log('🔐 Interceptor activo: Token encontrado y agregado al header');

    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(cloned);
  }

  console.warn('⚠️ Interceptor activo: No se encontró token en localStorage');
  return next(req);
};
