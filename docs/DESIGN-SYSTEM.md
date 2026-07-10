# uTime — Sistema de Diseño (Web)

> Sistema de diseño de la web **derivado de la app iOS/Flutter uTime** (`Ios-Mobile-App`).
> Objetivo: replicar en la web Angular el look & feel de la app móvil, empezando por el **panel del provider**.
> **Solo modo claro** (la app iOS no tiene modo oscuro).

Este documento es la fuente de verdad del look. Los valores concretos viven como **tokens CSS** en `src/styles.css` (`:root`). No hardcodees hex sueltos en los componentes: usa siempre las variables `--u-*`.

---

## 1. Identidad y estética

uTime es una app de gestión para salones/barberías. Su look se resume como **"Material 3 suavizado, iOS-friendly"**:

- **Fondos claros** (off-white `#FAFAFA`) con **tarjetas blancas flotantes**. La jerarquía se da por **elevación (sombras), no por bordes**.
- **Sombras muy suaves y difusas** (opacidad 0.05–0.08, blur alto). Sensación de "tarjetas que levitan".
- **Esquinas muy redondeadas** en todo (12–24 px; hasta 30 en el logo). Nada es cuadrado.
- **Gradiente morado** (`#7209B7 → #9D4EDD`) como sello de marca, repetido en logo, botones, avatares e iconos, con **glow morado** para efecto luminoso.
- **NO** glassmorphism, **NO** neumorfismo. Es "soft UI" plano con sombras.
- **Acentos de color puntuales:** verde (abierto/éxito), rojo (cerrado/error), ámbar dorado (ratings). El resto es morado + neutros grises.
- **Tipografía "tight"**: letter-spacing negativo en títulos, pesos semibold/bold, para un aire premium y compacto.
- **Micro-interacciones**: escala al hover/tap, transiciones fade/slide 200–300 ms.

---

## 2. Color

### Marca
| Token | Hex | Uso |
|---|---|---|
| `--u-primary` | `#7209B7` | Color principal. Botones, iconos activos, focus, acentos. |
| `--u-primary-light` | `#9D4EDD` | Fin del gradiente, hovers, acentos secundarios. |
| `--u-lavender` | `#E8D5F2` | Fondos suaves decorativos. |
| `--u-lavender-tint` | `#F2E6FC` | Hover muy sutil, chips tintados. |
| `--u-amber` | `#FFB800` | Estrellas de rating. |

**Gradiente de marca (firma visual):**
```css
--u-gradient: linear-gradient(135deg, #7209B7 0%, #9D4EDD 100%);
```

### Superficie y fondo
| Token | Hex | Uso |
|---|---|---|
| `--u-bg` | `#FAFAFA` | Fondo de página/scaffold. |
| `--u-surface` | `#FFFFFF` | Tarjetas, inputs, appbar, nav. |
| `--u-border` | `#E0E0E0` | Borde por defecto de inputs y divisores fuertes. |
| `--u-border-subtle` | `#EEEEEE` | Divisores sutiles. |

### Texto (neutros)
| Token | Hex | Uso |
|---|---|---|
| `--u-text` | `#1A1A1A` (~black87) | Texto principal, títulos. |
| `--u-text-secondary` | `#616161` (grey.700) | Cuerpo. |
| `--u-text-muted` | `#757575` (grey.600) | Labels, texto secundario, iconos inactivos. |
| `--u-text-hint` | `#9E9E9E` (grey.500) | Placeholders, hints. |

### Estado
| Token | Hex | Uso |
|---|---|---|
| `--u-success` | `#2E7D32` / verde | "Abierto", éxito, snackbars OK. |
| `--u-danger` | `#D32F2F` / rojo | "Cerrado", error, eliminar. |

---

## 3. Tipografía

- **Familia:** `Roboto` + system stack (la app usa la fuente por defecto de Flutter/Material — Roboto/SF). No hay fuente custom.
- **Pesos:** 400 (normal), 500 (medium), 600 (semibold — muy frecuente), 700 (bold). No usar light (<400).
- **Escala** (los tamaños más usados en la app):

| Token | px | Peso típico | Uso |
|---|---|---|---|
| `--u-fs-display` | 28 | 700, ls -0.5 | Título de pantalla / hero |
| `--u-fs-h1` | 22 | 700 | Encabezado de sección grande |
| `--u-fs-h2` | 20 | 700 | Título de card/appbar/diálogo |
| `--u-fs-h3` | 18 | 700 | Título de sección |
| `--u-fs-title` | 16 | 600/700 | Nombre de empresa, título de tarjeta, texto de botón |
| `--u-fs-body` | 14 | 400/500 | Cuerpo |
| `--u-fs-label` | 13 | 500/600 | Labels de formulario, metadatos |
| `--u-fs-caption` | 12 | 500/600 | Labels de stat, texto pequeño |
| `--u-fs-badge` | 10–11 | 600 | Badges/chips |

- **letter-spacing:** negativo (-0.2 a -0.5) en títulos grandes; ligeramente positivo (0.2–0.5) en botones.
- **line-height:** 1.3–1.4 en cuerpo.

---

## 4. Spacing (escala base 4px)

`--u-space-1: 4px` · `-2: 8px` · `-3: 12px` · `-4: 16px` · `-5: 20px` · `-6: 24px` · `-8: 32px` · `-10: 40px`

Valores de referencia de la app:
- Padding horizontal de página: **20–24 px**.
- Padding interno de card: **16 px** (a veces 12).
- Padding de input: `16px` horizontal, `14–16px` vertical.
- Gaps más frecuentes: **12, 16, 20, 24**.

---

## 5. Border radius

| Token | px | Uso |
|---|---|---|
| `--u-radius-sm` | 8 | Chips/badges pequeños, botones de diálogo |
| `--u-radius-md` | 12 | Inputs, botones, cuadros de icono, badges de estado |
| `--u-radius-lg` | 16 | **Tarjetas estándar**, diálogos |
| `--u-radius-xl` | 20 | Contenedores destacados, header flotante |
| `--u-radius-2xl` | 24 | Nav flotante |
| `--u-radius-pill` | 999px | Pills / cápsulas |

---

## 6. Sombras (elevación por sombra, no por borde)

| Token | Valor | Uso |
|---|---|---|
| `--u-shadow-sm` | `0 2px 6px rgba(0,0,0,.05)` | Elementos sutiles |
| `--u-shadow-card` | `0 3px 10px rgba(0,0,0,.05)` | **Tarjeta estándar** |
| `--u-shadow-card-hover` | `0 8px 20px rgba(0,0,0,.08)` | Card al hover |
| `--u-shadow-float` | `0 8px 24px rgba(0,0,0,.10)` | Nav / header flotante |
| `--u-shadow-glow` | `0 6px 16px rgba(114,9,183,.35)` | **Botón/elemento con gradiente** (glow morado) |

**Sombra de tarjeta de servicio (doble, con tinte morado):**
`0 4px 15px rgba(0,0,0,.08), 0 2px 10px rgba(114,9,183,.05)`

---

## 7. Componentes (patrones)

- **Botón primario** → contenedor con `--u-gradient`, `radius-md/lg`, texto blanco 600, `--u-shadow-glow`. Al hover: leve `scale(1.02)` + glow más fuerte. (Ver clase `.u-btn-gradient`.)
- **Tarjeta** → `background: --u-surface`, `radius-lg`, `--u-shadow-card`, padding 16. Sin borde. (Clase `.u-card`.)
- **Cuadro de icono con gradiente** (firma visual) → 48×48, `radius-md`, `--u-gradient`, glow morado, icono blanco. (Clase `.u-icon-box`.)
- **Input** → fondo blanco, `radius-md`, borde `--u-border`; **focus: borde `--u-primary` 2px**. Padding `16`.
- **Badge/chip info** → fondo `color / 0.1`, borde `color / 0.2`, `radius-sm`, texto 10–11px 600 del color.
- **Badge de estado** → punto circular 10px verde/rojo + texto.
- **Stat card** → card con cuadro de icono tintado arriba, valor 24px bold, label 12px muted.
- **Nav lateral (provider)** → tarjeta flotante blanca `radius-2xl`, `--u-shadow-float`. Item activo: **cápsula con gradiente morado**, icono/label blanco. Inactivo: gris muted; hover: fondo `--u-lavender-tint`.
- **AppBar/Toolbar** → fondo blanco, sombra suave, título 18–20 bold, `centerTitle`.

---

## 8. Iconografía

- **Material Icons / Material Symbols** (equivalente web directo del `Icons.*` de Flutter).
- Variantes *outlined* para estados inactivos, sólidas para activos.
- Iconos temáticos: `content_cut` (tijeras), `spa`, `people`, `calendar_today`, `local_offer`, `workspace_premium`, `store`, `star`.

---

## 9. Mapa iOS → Web (provider)

| Pantalla iOS | Ruta web equivalente |
|---|---|
| Home (stats + reviews) | `/provider/homeProvider` (dashboard) |
| Servicios | `/provider/services` |
| Trabajadores/Equipo | integrado en dashboard (`staff-list`) |
| Calendario / Reservas | `/provider/schedule` |
| Reseñas | `/provider/reviews` |
| Perfil del negocio (panel admin) | `/provider/profile` |
| Suscripción | `/provider/subscription` |
| Ajustes / Notificaciones | `/provider/settings`, `/provider/notification` |

**Nav inferior "pill flotante" de iOS → nav lateral flotante** en la web (mismo lenguaje visual: cápsula de gradiente para el item activo).

---

## 10. Referencias en el código iOS

- Tema: `Ios-Mobile-App/lib/core/theme/app_theme.dart`
- Nav (gradiente/sombras): `lib/core/widgets/custom_bottom_navbar.dart`
- Cards / stats / gradiente: `lib/features/home/presentation/home_page.dart`
- Botón gradiente + inputs: `lib/features/auth/presentation/login_screen.dart`
- Card de lista con badges: `lib/features/service/presentation/widgets/service_card.dart`
- Panel admin/perfil + menú: `lib/features/profile/presentation/pages/profile_overview_page.dart`
