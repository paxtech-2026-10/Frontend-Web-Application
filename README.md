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
