# uTime – Frontend Web Application

Bienvenido al repositorio del frontend de **uTime**, ahora desarrollado con **Angular + TypeScript**. Este proyecto forma parte del ecosistema de aplicaciones de **PaxTech**.

---

## 🚀 Tecnologías principales

- [Angular](https://angular.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Angular Material](https://material.angular.io/)
- [ngx-translate](https://github.com/ngx-translate/core)
- [HttpClient (Angular)](https://angular.io/guide/http)

---

## 📦 Clonar y preparar el entorno

> Si estás colaborando en el proyecto, sigue estos pasos para preparar tu entorno local correctamente:

### 1. Clonar el repositorio

```bash
git clone https://github.com/PaxTech-UPC/Frontend-Web-Applications.git
```

Accede al directorio del proyecto:

```bash
cd Frontend-Web-Applications
```

### 2. Instalar las dependencias base

Instala las dependencias definidas en package.json:

```bash
npm install
```

### 3. Instalar Angular Material

Esto agregará los estilos de Material, tema base, animaciones, etc.

```bash
ng add @angular/material
```

### 4. Instalar ngx-translate para i18n

Núcleo de traducciones:

```bash
npm install @ngx-translate/core
```

Cargador HTTP para archivos de traducción:

```bash
npm install @ngx-translate/http-loader
```
```iconos Material
npm install @angular/material @angular/cdk
```

```carrusel
npm i ngx-owl-carousel-o
```

---

## 🌐 Despliegue en GitHub Pages

> Puedes publicar la aplicación fácilmente en GitHub Pages siguiendo estos pasos:

### 📤 **1. Compilar para producción**

```bash
ng add angular-cli-ghpages
```
## 📢 Deploy en GitHub Pages (Producción)

### 1️⃣ Compilar el proyecto en modo producción

```bash
ng build --configuration production
```
```bash
npx angular-cli-ghpages --dir=dist/frontend-web-applications/browser
```
npm run build:gh-pages

npm run deploy:gh-pages

---

## 🧪 Testing

Este proyecto usa **Karma + Jasmine** (configuración por defecto de Angular CLI). Los archivos `.spec.ts` viven **al lado** del `.ts` que prueban (convención Angular: co-localización, no carpeta `test/` separada).

### Tests existentes para el bounded context Services

Ubicados en `src/app/services/services/`:

- `service.assembler.spec.ts` — 4 tests para `ServiceAssembler` (mapeo response → entity, no leak de referencia, listas vacías, preservación de orden).
- `services-api.service.spec.ts` — 3 tests para `ServiceApiService` con `HttpTestingController`: GET correcto al endpoint, lista vacía, y el comportamiento de `retry(2)` ante errores (necesita 3 fallos antes de propagar el error genérico de `BaseService.handleError`).

Todos los tests siguen estructura **AAA** (Arrange / Act / Assert) y mockean lo necesario sin tocar el backend real.

### Cómo correr los tests

#### Solo los del contexto Services (corrida limpia y rápida)

```bash
ng test --configuration=services-only
```

Esta configuración está definida en `angular.json` → `architect.test.configurations.services-only` y restringe el bundle a los 2 archivos de Services. Output esperado: `7 SUCCESS, 0 FAILED`.

#### Suite completa

```bash
ng test
```

Corre los 108 tests del proyecto. ⚠️ **Aviso**: hay 71 fallos preexistentes que **no son nuevos** — son scaffolds generados con `ng generate component/service` que nunca tuvieron configuración real de TestBed. Patrones más comunes:

- `NullInjectorError: No provider for HttpClient!` → falta `provideHttpClient()` en el TestBed.
- `NullInjectorError: No provider for TranslateStore!` → falta `TranslateModule.forRoot()`.
- `NullInjectorError: No provider for MatDialogRef!` → falta mock del dialog ref.
- `Cannot read properties of undefined (reading 'X')` → al componente le falta `@Input` requerido.

Cada equipo arregla los suyos cuando le toca escribir tests reales en su bounded context.

### Scaffolds rotos reemplazados con placeholders

Para que `ng test` lograra siquiera compilar el bundle, reemplazamos 7 specs cuyos imports apuntaban a clases renombradas o tenían `it()` dentro de `beforeEach`. Quedaron como placeholders válidos:

```typescript
describe('NombreDelTarget', () => {
  xit('placeholder — real tests pending', () => {});
});
```

Archivos afectados (con su clase real entre paréntesis cuando el spec original tenía el nombre incorrecto):

- `src/app/appointments/services/payment.assembler.spec.ts`
- `src/app/appointments/services/time-slot.assembler.spec.ts`
- `src/app/appointments/services/appointment-api-service.service.spec.ts`
- `src/app/iam/services/client.assembler.spec.ts`
- `src/app/profile/components/social-edit/social-edit.component.spec.ts` (clase real: `EditSocialsDialogComponent`)
- `src/app/profile/models/social.entity.spec.ts`
- `src/app/profile/services/social-api.service.spec.ts` (clase real: `SocialsApiService`)

**Cuando te toque escribir tests reales en alguno de estos archivos**, borra el `describe` placeholder y escribe el tuyo desde cero. El nombre del `describe` ya apunta al símbolo correcto del código de producción.

### Agregar tu propia configuración por bounded context

Para enfocar la corrida en tu contexto, agrega una entrada en `angular.json`:

```json
"configurations": {
  "services-only": { "include": ["src/app/services/services/**/*.spec.ts"] },
  "tu-contexto-only": { "include": ["src/app/tu-contexto/**/*.spec.ts"] }
}
```

Y la corres con `ng test --configuration=tu-contexto-only`. La corrida default (`ng test` sin flags) sigue intacta para el resto del equipo.

### Recetas para no caer en los errores comunes de TestBed

| Si tu spec instancia... | Agrega al `TestBed.configureTestingModule` |
|---|---|
| Un `*ApiService` (extiende `BaseService`) | `providers: [provideHttpClient(), provideHttpClientTesting()]` |
| Un componente que usa `TranslatePipe` / `ngx-translate` | `imports: [TranslateModule.forRoot()]` |
| Un componente con `@Input() requerido` | `fixture.componentInstance.miInput = mockValue;` antes de `detectChanges()` |
| Un componente de diálogo con `MatDialogRef` | `providers: [{ provide: MatDialogRef, useValue: { close: jasmine.createSpy() } }, { provide: MAT_DIALOG_DATA, useValue: {} }]` |
| Un componente bajo router (`ActivatedRoute`) | `providers: [{ provide: ActivatedRoute, useValue: { params: of({}) } }]` |

### Convenciones

- Estructura **AAA** explícita en cada `it()`.
- Mocks vía `HttpTestingController` para servicios HTTP — nunca hits al backend real.
- Para fixturizar: `xit` mantiene el placeholder visible en el reporte como "pending"; **no** dejar `describe` vacíos sin children porque Jasmine los trata como error.
