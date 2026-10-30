# Órbita: especificación de componentes para el prototipo

Especificación para construir en React (`prototipo/src/orbita/`) los componentes de Órbita sin abrir Figma. Datos leídos el 30 oct 2026 de los archivos de `docs/FIGMA_REFERENCIAS.md` (Plugin API en modo lectura: variables, estilos y nodos de cada componente). No se modificó Figma.

Notación:
- Color: `token` (#Light / #Dark), modo **OBP Light** / **OBP Dark** de la colección *Semantic Color*. WIB queda fuera.
- Medidas en px. `p` = padding top/right/bottom/left. `g` = gap. `r` = radio.
- Borde INSIDE = `border` con `box-sizing: border-box` (o `box-shadow: inset`). Borde OUTSIDE = `outline` o `box-shadow` con spread.
- Nombres de propiedades y valores de variante copiados de Figma, con sus emojis y erratas (`Tittle`, `Dissabled`, `Succes`, `gost brand`, `Toogle`, `Colum`).

---

## 0. Tokens globales (Fundations v.2)

### 0.1 Convención de variables CSS

Cada variable de Figma tiene `codeSyntax.WEB`. Regla: prefijo `--ui-` + ruta con `/` → `-`, en minúsculas.

| Colección | Ejemplo Figma | Variable CSS |
|---|---|---|
| Semantic Color | `color/bg/fill/brand/default` | `--ui-color-bg-fill-brand-default` |
| Semantic Fonts | `type/body/xs/Bold/tracking` | `--ui-type-body-xs-bold-tracking` |
| Font Primitives | `font/size/2xs` | `--ui-font-size-2xs` |
| Space Primitives | `positive/space_16` / `negative/space_16` | `--ui-space-16` / `--ui-space-neg-16` |
| Sizes Primitives | `size/control/xs` | `--ui-size-control-xs` |
| Semantic Radius | `radius/control/sm` | `--ui-radius-control-sm` |
| Radius Primitives | `radius_8` | `--ui-radius-8` |
| Strokes | `width/2` | `--ui-stroke-width-2` |
| Sombras (en Semantic Color) | `shadows/05/Color` | `--ui-shadow-05-color` |
| Semantic z-index | `Layer/dialog/modal` | `--ui-layer-dialog-modal` |

Colecciones y modos: Semantic Color (OBP Light, OBP Dark, WIB Light, WIB Dark); Semantic Fonts (regular, compact); Sizes Primitives (Regular, Compact); el resto con un solo modo.

### 0.2 Colores semánticos

| Token | OBP Light | OBP Dark |
|---|---|---|
| `color/bg/canvas/default` | #f7f8fa | #1e1f21 |
| `color/bg/canvas/inverse` | #1e1f21 | #f7f8fa |
| `color/bg/overlay/default` | #00000066 | #00000099 |
| `color/bg/overlay/darker` | #000000b2 | #000000cc |
| `color/bg/surface/default` | #ffffff | #27292b |
| `color/bg/surface/hover` | #f7f8fa | #313336 |
| `color/bg/surface/pressed` | #e1e3e5 | #44464a |
| `color/bg/surface/selected` | #f0f1f2 | #3a3c40 |
| `color/bg/surface/disabled` | #f7f8fa | #313336 |
| `color/bg/surface/secondary/default` | #f7f8fa | #313336 |
| `color/bg/surface/secondary/hover` | #f0f1f2 | #3a3c40 |
| `color/bg/surface/secondary/pressed` | #c6c8cc | #585a5e |
| `color/bg/surface/secondary/selected` | #d4d6d9 | #4d5054 |
| `color/bg/surface/tertiary/default` | #e1e3e5 | #44464a |
| `color/bg/surface/tertiary/hover` | #d4d6d9 | #4d5054 |
| `color/bg/surface/tertiary/pressed` | #babcbf | #616469 |
| `color/bg/surface/tertiary/selected` | #c6c8cc | #585a5e |
| `color/bg/surface/brand/default` | #f1f4fe | #243a80 |
| `color/bg/surface/brand/hover` | #e3e9fc | #294291 |
| `color/bg/surface/brand/pressed` | #8da1df | #3251b1 |
| `color/bg/surface/brand/selected` | #b8c5ee | #2d49a1 |
| `color/bg/surface/brand/disabled` | #f7f8fa | #313336 |
| `color/bg/surface/success/default` | #f1fef6 | #16803d |
| `color/bg/surface/success/hover` | #e3fcec | #199246 |
| `color/bg/surface/success/pressed` | #83e1a5 | #1fb456 |
| `color/bg/surface/success/selected` | #b3efc9 | #1ca34e |
| `color/bg/surface/warning/default` | #fefbf1 | #806204 |
| `color/bg/surface/warning/hover` | #fcf6e3 | #9b7705 |
| `color/bg/surface/warning/pressed` | #f3d576 | #d09f07 |
| `color/bg/surface/warning/selected` | #f8e6ad | #b58b06 |
| `color/bg/surface/danger/default` | #fef1f1 | #802424 |
| `color/bg/surface/danger/hover` | #fce3e3 | #9c2c2c |
| `color/bg/surface/danger/pressed` | #f69494 | #d43c3c |
| `color/bg/surface/danger/selected` | #f9bcbc | #b83434 |
| `color/bg/surface/info/default` | #f1fcfe | #046d80 |
| `color/bg/surface/info/hover` | #e3f9fc | #058095 |
| `color/bg/surface/info/pressed` | #75d8e8 | #06a4bf |
| `color/bg/surface/info/selected` | #ace9f2 | #0592aa |
| `color/bg/fill/default` | #ffffff | #27292b |
| `color/bg/fill/hover` | #f0f1f2 | #3a3c40 |
| `color/bg/fill/pressed` | #c6c8cc | #585a5e |
| `color/bg/fill/selected` | #e1e3e5 | #44464a |
| `color/bg/fill/disabled` | #f7f8fa | #313336 |
| `color/bg/fill/secondary/default` | #f7f8fa | #313336 |
| `color/bg/fill/secondary/hover` | #e1e3e5 | #44464a |
| `color/bg/fill/secondary/pressed` | #babcbf | #616469 |
| `color/bg/fill/secondary/selected` | #d4d6d9 | #4d5054 |
| `color/bg/fill/tertiary/default` | #f0f1f2 | #3a3c40 |
| `color/bg/fill/tertiary/hover` | #d4d6d9 | #4d5054 |
| `color/bg/fill/tertiary/pressed` | #abaeb2 | #6c6e73 |
| `color/bg/fill/tertiary/selected` | #c6c8cc | #585a5e |
| `color/bg/fill/brand/default` | #3658c1 | #3251b1 |
| `color/bg/fill/brand/hover` | #3251b1 | #3658c1 |
| `color/bg/fill/brand/pressed` | #2d49a1 | #627dd0 |
| `color/bg/fill/brand/selected` | #627dd0 | #2d49a1 |
| `color/bg/fill/brand/disabled` | #b8c5ee | #243a80 |
| `color/bg/fill/success/default` | #22c55e | #1fb456 |
| `color/bg/fill/success/hover` | #1fb456 | #22c55e |
| `color/bg/fill/success/pressed` | #1ca34e | #53d382 |
| `color/bg/fill/success/selected` | #53d382 | #1ca34e |
| `color/bg/fill/success/disabled` | #b3efc9 | #16803d |
| `color/bg/fill/warning/default` | #eab308 | #d09f07 |
| `color/bg/fill/warning/hover` | #d09f07 | #eab308 |
| `color/bg/fill/warning/pressed` | #b58b06 | #efc43f |
| `color/bg/fill/warning/selected` | #efc43f | #b58b06 |
| `color/bg/fill/warning/disabled` | #f8e6ad | #806204 |
| `color/bg/fill/danger/default` | #ef4444 | #d43c3c |
| `color/bg/fill/danger/hover` | #d43c3c | #ef4444 |
| `color/bg/fill/danger/pressed` | #b83434 | #f36c6c |
| `color/bg/fill/danger/selected` | #f36c6c | #b83434 |
| `color/bg/fill/danger/disabled` | #f9bcbc | #802424 |
| `color/bg/fill/info/default` | #06b6d4 | #06a4bf |
| `color/bg/fill/info/hover` | #06a4bf | #06b6d4 |
| `color/bg/fill/info/pressed` | #0592aa | #3ec7de |
| `color/bg/fill/info/selected` | #3ec7de | #0592aa |
| `color/bg/fill/info/disabled` | #ace9f2 | #046d80 |
| `color/text/primary` | #313336 | #f0f1f2 |
| `color/text/secondary` | #585a5e | #c6c8cc |
| `color/text/tertiary` | #6c6e73 | #9fa2a6 |
| `color/text/disabled` | #babcbf | #616469 |
| `color/text/text-on-color` | #ffffff | #ffffff |
| `color/text/on-canvas-inverse` | #ffffff | #313336 |
| `color/text/brand/default` | #2d49a1 | #e3e9fc |
| `color/text/brand/hover` | #294291 | #f1f4fe |
| `color/text/brand/pressed` | #243a80 | #ffffff |
| `color/text/brand/selected` | #243a80 | #f1f4fe |
| `color/text/link/default` | #3251b1 | #627dd0 |
| `color/text/link/hover` | #2d49a1 | #8da1df |
| `color/text/link/pressed` | #294291 | #b8c5ee |
| `color/text/link/visited` | #602db7 | #b58ff5 |
| `color/text/success/default` | #1ca34e | #e3fcec |
| `color/text/success/hover` | #199246 | #f1fef6 |
| `color/text/success/pressed` | #16803d | #ffffff |
| `color/text/success/selected` | #16803d | #f1fef6 |
| `color/text/warning/default` | #b58b06 | #fcf6e3 |
| `color/text/warning/hover` | #9b7705 | #fefbf1 |
| `color/text/warning/pressed` | #806204 | #ffffff |
| `color/text/warning/selected` | #806204 | #fefbf1 |
| `color/text/danger/default` | #b83434 | #fce3e3 |
| `color/text/danger/hover` | #9c2c2c | #fef1f1 |
| `color/text/danger/pressed` | #802424 | #ffffff |
| `color/text/danger/selected` | #802424 | #fef1f1 |
| `color/text/info/default` | #0592aa | #e3f9fc |
| `color/text/info/hover` | #058095 | #f1fcfe |
| `color/text/info/pressed` | #046d80 | #ffffff |
| `color/text/info/selected` | #046d80 | #f1fcfe |
| `color/icon/default` | #4d5054 | #d4d6d9 |
| `color/icon/hover` | #3a3c40 | #f0f1f2 |
| `color/icon/pressed` | #27292b | #ffffff |
| `color/icon/selected` | #3251b1 | #627dd0 |
| `color/icon/disabled` | #babcbf | #616469 |
| `color/icon/on-color` | #ffffff | #ffffff |
| `color/icon/on-canvas-inverse` | #ffffff | #4d5054 |
| `color/icon/secondary/default` | #616469 | #babcbf |
| `color/icon/secondary/hover` | #585a5e | #d4d6d9 |
| `color/icon/secondary/pressed` | #44464a | #f0f1f2 |
| `color/icon/secondary/selected` | #4d5054 | #d4d6d9 |
| `color/icon/tertiary/default` | #919499 | #85888c |
| `color/icon/tertiary/hover` | #85888c | #9fa2a6 |
| `color/icon/tertiary/pressed` | #6c6e73 | #babcbf |
| `color/icon/tertiary/selected` | #787b80 | #9fa2a6 |
| `color/icon/brand/default` | #627dd0 | #b8c5ee |
| `color/icon/brand/hover` | #3658c1 | #e3e9fc |
| `color/icon/brand/pressed` | #3251b1 | #f1f4fe |
| `color/icon/brand/selected` | #3251b1 | #ffffff |
| `color/icon/success/default` | #1ca34e | #b3efc9 |
| `color/icon/success/hover` | #199246 | #e3fcec |
| `color/icon/success/pressed` | #16803d | #f1fef6 |
| `color/icon/success/selected` | #16803d | #ffffff |
| `color/icon/warning/default` | #b58b06 | #f8e6ad |
| `color/icon/warning/hover` | #9b7705 | #fcf6e3 |
| `color/icon/warning/pressed` | #806204 | #fefbf1 |
| `color/icon/warning/selected` | #806204 | #ffffff |
| `color/icon/danger/default` | #b83434 | #f9bcbc |
| `color/icon/danger/hover` | #9c2c2c | #fce3e3 |
| `color/icon/danger/pressed` | #802424 | #fef1f1 |
| `color/icon/danger/selected` | #802424 | #ffffff |
| `color/icon/info/default` | #0592aa | #ace9f2 |
| `color/icon/info/hover` | #058095 | #e3f9fc |
| `color/icon/info/pressed` | #046d80 | #f1fcfe |
| `color/icon/info/selected` | #046d80 | #ffffff |
| `color/border/default` | #c6c8cc | #4d5054 |
| `color/border/hover` | #85888c | #9fa2a6 |
| `color/border/pressed` | #44464a | #babcbf |
| `color/border/focus` | #627dd0 | #627dd0 |
| `color/border/disabled` | #d4d6d9 | #44464a |
| `color/border/subtle` | #d4d6d9 | #44464a |
| `color/border/on-color` | #ffffff | #ffffff |
| `color/border/strong` | #4d5054 | #abaeb2 |
| `color/border/brand` | #3658c1 | #627dd0 |
| `color/border/success` | #22c55e | #53d382 |
| `color/border/warning` | #eab308 | #efc43f |
| `color/border/danger` | #ef4444 | #f36c6c |
| `color/border/info` | #06b6d4 | #3ec7de |
| `color/black-alpha/transparent` (primitivo) | #00000000 | #00000000 |

`bg/surface/{success,warning,danger,info}/disabled` apuntan a `bg/surface/disabled`.

**Paleta `all-colors`** (fills, superficies, bordes, íconos y textos categóricos). Formato: Light / Dark.

| Color | `bg/fill/all-colors/*` | `bg/surface/all-colors/*` | `border/all-colors/*` | `icon/all-colors/*` | `text/all-colors/*` |
|---|---|---|---|---|---|
| red | #ef4444 / #d43c3c | #fce3e3 / #802424 | #f36c6c / #ef4444 | #ef4444 / #f36c6c | #b83434 / #f69494 |
| orange | #f97316 / #db6514 | #fceee3 / #803b0b | #fa924a / #f97316 | #f97316 / #fa924a | #bd5711 / #fbb17d |
| yellow | #eab308 / #d09f07 | #fcf6e3 / #806204 | #efc43f / #eab308 | #eab308 / #efc43f | #b58b06 / #f3d576 |
| lime | #84cc16 / #78b914 | #f2fce3 / #53800e | #a0d84a / #84cc16 | #84cc16 / #a0d84a | #6ca612 / #bbe47d |
| green | #22c55e / #1fb456 | #e3fcec / #16803d | #53d382 / #22c55e | #22c55e / #53d382 | #1ca34e / #83e1a5 |
| cyan | #06b6d4 / #06a4bf | #e3f9fc / #046d80 | #3ec7de / #06b6d4 | #06b6d4 / #3ec7de | #0592aa / #75d8e8 |
| azure | #0ea5e9 / #0d93cf | #e3f5fc / #085a80 | #44b9ee / #0ea5e9 | #0ea5e9 / #44b9ee | #0b80b5 / #79cdf3 |
| blue | #3658c1 / #3251b1 | #e3e9fc / #243a80 | #627dd0 / #3658c1 | #3658c1 / #627dd0 | #2d49a1 / #8da1df |
| violet | #7c3aed / #6e34d2 | #ede3fc / #431f80 | #9965f1 / #7c3aed | #7c3aed / #9965f1 | #602db7 / #b58ff5 |
| magenta | #eb3387 / #d12e78 | #fce3ef / #801c49 | #f05fa1 / #eb3387 | #eb3387 / #f05fa1 | #b62868 / #f48bbb |
| rose | #e11d48 / #c91a41 | #fce3e9 / #801029 | #e84f71 / #e11d48 | #e11d48 / #e84f71 | #b11739 / #ef8099 |

### 0.3 Tipografía

Familias (variables): `font/family/ui` = **SF Pro**; `font/family/mono` = **IBM Plex Mono**. La guía de Fonts documenta el respaldo Inter → Raleway → Open Sans → Lato (no está en variables). Pesos: regular 400, medium 500, semibold 600, bold 700. Interlineado y tracking en px fijos: `tight` = +0.5 px, `normal` = 0, `wide` = +2 px.

Escala de tamaños (`font/size/*`): 2xs 10, xs 12, sm 14, md 16, lg 18, xl 20, 2xl 24 (sin rol), 3xl 30, 4xl 36, 5xl 48 (sin rol).

Estilos (text styles `Type/...`, todos ligados a variables `type/...`). Formato tamaño / interlineado / peso / tracking.

| Text style | Regular | Compact | Uso (guía) |
|---|---|---|---|
| `Type/Heading/H1` | 36 / 45 / 600 / +0.5 | igual | máximo visible en app |
| `Type/Heading/H2` | 30 / 37.5 / 600 / +0.5 | igual | |
| `Type/Heading/H3` | 20 / 25 / 600 / 0 | igual | títulos de modal y header |
| `Type/Heading/H4` | 18 / 22.5 / 600 / 0 | igual | |
| `Type/Heading/H5` | 16 / 20 / 600 / 0 | igual | |
| `Type/Heading/H6` | 14 / 17.5 / 600 / 0 | igual | título de popover |
| `Type/Body/LG/{Regular,Medium,Semibold,Bold}` | 18 / 26 / 400·500·600·700 / +0.5 | igual | párrafos largos |
| `Type/Body/MD/{Regular,Medium,Semibold,Bold}` | 16 / 23 / 400·500·600·700 / +0.5 | **14 / 20.5** | texto principal |
| `Type/Body/SM/{Regular,Medium,Semibold,Bold}` | 14 / 20.5 / 400·500·600·700 / +0.5 | **12 / 17.5** | texto de tabla, botones |
| `Type/Body/XS/{Regular,Medium,Semibold,Bold}` | 12 / 17.5 / 400·500·600·700 / +0.5 | igual | ayudas, badges |
| `Type/Label/MD/{Regular,Medium,Semibold,Bold}` | 14 / 20.5 / 400·500·600·700 / +0.5 | igual | labels de formulario |
| `Type/Caption/MD` | 12 / 17.5 / 400 / +2 | igual | |
| `Type/Caption/XS` | 10 / 14.5 / 400 / +2 | igual | meta, tipo de medio |
| `Type/Code/MD` | IBM Plex Mono 14 / 20.5 / 400 / 0 | igual | |

No existen Body XL ni Label SM/LG. En el text style el nombre de fuente aparece como "SF Pro Regular" aunque el peso real viene de la variable `type/.../weight`.

### 0.4 Radios (`Semantic Radius`)

| Token | Valor | Token | Valor |
|---|---|---|---|
| `radius/control/na` | 0 | `radius/surface/square` | 0 |
| `radius/control/xs` | 6 | `radius/surface/forms` | 2 |
| `radius/control/sm` | 8 | `radius/surface/card` | 12 |
| `radius/control/md` | 8 | `radius/surface/modal` | 16 |
| `radius/control/lg` | 10 | `radius/surface/sheet` | 16 |
| `radius/control/pill` | 9999 | `radius/surface/popover` | 8 |
| `radius/image/na` | 0 | `radius/surface/tooltip` | 6 |
| `radius/image/sm` | 8 | `radius/image/md` | 16 |
| `radius/image/pill` | 9999 | | |

Primitivos: `radius_0, 2, 4, 6, 8, 10, 12, 16, 24, full(9999)`.

### 0.5 Espaciado (`Space Primitives`)

`positive/space_N`: 0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96. Negativos `negative/space_N` con los mismos pasos (−2 … −96).

### 0.6 Sombras (effect styles, color ligado a variables con modo)

| Effect style | x / y / blur / spread | Color Light | Color Dark | Uso observado |
|---|---|---|---|---|
| `shadows/shadow-0` | 0 / 0 / 0 / 0 | #00000000 | #00000000 | |
| `shadows/shadow-1` | 0 / 1 / 2 / 0 | #0000001a | #00000066 | Tooltip |
| `shadows/shadow-2` | 0 / 2 / 4 / −1 | #00000033 | #00000080 | |
| `shadows/shadow-3` | 0 / 4 / 8 / −2 | #00000033 | #00000080 | Modal, Popover, Header, Card hover, Picture |
| `shadows/shadow-4` | 0 / 8 / 16 / −4 | #0000004d | #00000099 | |
| `shadows/shadow-5` | 0 / 16 / 24 / −8 | #0000004d | #00000099 | Toast, Notification popup |

Variables: `shadows/0N/{x,y,blur,Spread,Color}` → `--ui-shadow-0N-x` … `--ui-shadow-0N-color`.

### 0.7 Tamaños (`Sizes Primitives`, modo Regular / Compact)

| Token | Regular | Compact | Token | Regular | Compact |
|---|---|---|---|---|---|
| `size/control/xxs` | 20 | 16 | `size/avatar/xxs` | 16 | 12 |
| `size/control/xs` | 32 | 28 | `size/avatar/xs` | 24 | 24 |
| `size/control/sm` | 36 | 32 | `size/avatar/sm` | 32 | 32 |
| `size/control/md` | 40 | 36 | `size/avatar/md` | 40 | 40 |
| `size/control/lg` | 48 | 40 | `size/avatar/lg` | 48 | 48 |
| `size/icon/xs` | 10 | 8 | `size/avatar/xl` | 64 | 64 |
| `size/icon/sm` | 16 | 16 | `size/row/regular` | 40 | 40 |
| `size/icon/md` | 20 | 20 | `size/row/compact` | 32 | 32 |
| `size/icon/lg` | 24 | 24 | `size/image/xs`/`sm`/`md`/`lg` | 24 / 40 / 64 / 128 | igual |
| `size/icon/xl` | 32 | 32 | `size/image/full` | 9999 | 9999 |

### 0.8 Bordes y z-index

Strokes: `width/0` 0, `width/1` 1, `width/2` 2; `style/solid`, `style/dashed`.

| Capa semántica | Valor | Capa semántica | Valor |
|---|---|---|---|
| `Layer/App/header` | 300 | `Layer/dialog/backdrop` | 690 |
| `Layer/nav/dropdown` | 400 | `Layer/dialog/modal` | 700 |
| `Layer/surface/popover` | 500 | `Layer/feedback/toast` | 800 |
| `Layer/surface/tooltip` | 600 | `Layer/system/overlay` | 900 |

Primitivos: `z/hide` −1, `z/base` 0, `z/raised` 100, `z/sticky` 200, `z/max` 99999.

### 0.9 Foco (patrón observado)

| Componente | Anillo de foco |
|---|---|
| Button, Icon button, Card, Toogle | rectángulo `focus border`, 2 px OUTSIDE, `border/focus` (#627dd0 / #627dd0), separado 2 px del control; radio = radio del control + 2 |
| Checkbox | 1 px OUTSIDE `border/focus` (#627dd0 / #627dd0), sin separación |
| Cell (tabla) | estado `Focused`: 1 px INSIDE `border/focus` (#627dd0 / #627dd0) + fondo `bg/surface/brand/default` (#f1f4fe / #243a80) |
| Input | no hay anillo; el estado `Typing` cambia el borde a `border/brand` (#3658c1 / #627dd0) |

---

## 1. Button

Archivo Button, página "Button". Tres niveles anidados:

| Nivel | Componente | Propiedades (nombre exacto: opciones = default) |
|---|---|---|
| Público | `Button` (42 variantes) | `🎨 color`: primary, secondary, tertiary, destructive, ghost, Switch, Tap = primary · `🚦State`: default, hover, pressed, selected, disabled, loading = default |
| Base | `_size-&-pill` (40) | `📏 size`: xxs, xs, sm, md, lg = xxs · `⚪ pill?`: none, xs, sm, md, lg, pill, tabRounded, tab = none · `🎯 focus?`: boolean = false |
| Contenido | `_content` (3) | `👁️ show Icon` bool = true · `🔽 show chevorn` bool = true · `🅰️ label` text = "Text Button" · `🔵 show badge` bool = false · `Default`: Default, Tap, Tap-active |

Anatomía: `_size-&-pill` (auto layout vertical, centrado) > `_content` (horizontal, g4) > `left Icon` (16) · `label` · `Badge` (oculto) · `right Icon` (chevron-down, 16). Ícono = glifo de Font Awesome 7 Pro Regular (`shapes` de muestra; `loader` en loading).

### 1.1 Tamaños (`📏 size`)

| size | Alto (token) | Padding V / H | Gap | Label | Ícono |
|---|---|---|---|---|---|
| xxs | 20 (`size/control/xxs`) | 4 / 8 | 4 | `Type/Body/XS/Bold` 12/17.5 | 10 |
| xs | 32 (`size/control/xs`) | 4 / 12 | 4 | `Type/Body/SM/Bold` 14/20.5 | 16 |
| sm | 36 (`size/control/sm`) | 6 / 12 | 4 | `Type/Body/SM/Bold` | 16 |
| md | 40 (`size/control/md`) | 8 / 16 | 4 | `Type/Body/SM/Bold` | 16 |
| lg | 48 (`size/control/lg`) | 12 / 24 | 4 | `Type/Body/SM/Bold` | 16 |

El alto lo fija el token; ancho = contenido. La instancia por defecto de `Button` usa size xs.

### 1.2 Radio (`⚪ pill?`)

| pill? | Radio | Nota |
|---|---|---|
| none (default) | 0 (`radius/control/na`) | |
| xs | 6 (`radius/control/xs`) | |
| sm | 8 (`radius/control/sm`) | usado en Cell, Toast, Alerts |
| md | 8 (`radius/control/md`) | |
| lg | 10 (`radius/control/lg`); en xxs = 8 | |
| pill | 9999 (`radius/control/pill`) | |
| tabRounded | 6 / 6 / 0 / 0 | label pasa a `Body/SM/Regular` (xxs: `Body/XS/Regular`) |
| tab | 0 | label `Regular` como tabRounded |

### 1.3 Colores por variante y estado

Fondo y borde van en `_size-&-pill`; label en `label`; ícono en `icon`. Borde 1 px INSIDE cuando existe.

**primary**

| State | Fondo | Borde | Label | Ícono |
|---|---|---|---|---|
| default | `bg/fill/brand/default` (#3658c1 / #3251b1) | — | `text/text-on-color` (#ffffff / #ffffff) | `icon/on-color` (#ffffff / #ffffff) |
| hover | `bg/fill/brand/hover` (#3251b1 / #3658c1) | — | `text/text-on-color` (#ffffff / #ffffff) | `icon/on-color` (#ffffff / #ffffff) |
| pressed | `bg/fill/brand/pressed` (#2d49a1 / #627dd0) | — | `text/text-on-color` (#ffffff / #ffffff) | `icon/on-color` (#ffffff / #ffffff) |
| selected | `bg/fill/brand/selected` (#627dd0 / #2d49a1) | — | `text/text-on-color` (#ffffff / #ffffff) | `icon/on-color` (#ffffff / #ffffff) |
| disabled | `bg/fill/disabled` (#f7f8fa / #313336) | — | `text/disabled` (#babcbf / #616469) | `icon/disabled` (#babcbf / #616469) |
| loading | `bg/fill/brand/disabled` (#b8c5ee / #243a80) | — | oculto | `loader` `icon/on-color` (#ffffff / #ffffff) |

**secondary**

| State | Fondo | Borde | Label | Ícono |
|---|---|---|---|---|
| default | `bg/fill/secondary/default` (#f7f8fa / #313336) | `border/default` (#c6c8cc / #4d5054) | `text/primary` (#313336 / #f0f1f2) | `icon/default` (#4d5054 / #d4d6d9) |
| hover | `bg/fill/secondary/hover` (#e1e3e5 / #44464a) | `border/default` (#c6c8cc / #4d5054) | `text/primary` (#313336 / #f0f1f2) | `icon/default` (#4d5054 / #d4d6d9) |
| pressed | `bg/fill/secondary/pressed` (#babcbf / #616469) | `border/default` (#c6c8cc / #4d5054) | `text/primary` (#313336 / #f0f1f2) | `icon/default` (#4d5054 / #d4d6d9) |
| selected | `bg/fill/secondary/selected` (#d4d6d9 / #4d5054) | `border/default` (#c6c8cc / #4d5054) | `text/primary` (#313336 / #f0f1f2) | `icon/default` (#4d5054 / #d4d6d9) |
| disabled | `bg/fill/secondary/default` (#f7f8fa / #313336) | `border/disabled` (#d4d6d9 / #44464a) | `text/disabled` (#babcbf / #616469) | `icon/disabled` (#babcbf / #616469) |
| loading | `bg/fill/secondary/default` (#f7f8fa / #313336) | `border/disabled` (#d4d6d9 / #44464a) | oculto | `loader` `icon/disabled` (#babcbf / #616469) |

**tertiary**

| State | Fondo | Borde | Label | Ícono |
|---|---|---|---|---|
| default | transparente (`black-alpha/transparent`) | — | `text/primary` (#313336 / #f0f1f2) | `icon/default` (#4d5054 / #d4d6d9) |
| hover | `bg/fill/tertiary/hover` (#d4d6d9 / #4d5054) | — | `text/primary` (#313336 / #f0f1f2) | `icon/default` (#4d5054 / #d4d6d9) |
| pressed | `bg/fill/tertiary/pressed` (#abaeb2 / #6c6e73) | — | `text/primary` (#313336 / #f0f1f2) | `icon/default` (#4d5054 / #d4d6d9) |
| selected | `bg/fill/tertiary/selected` (#c6c8cc / #585a5e) | — | `text/primary` (#313336 / #f0f1f2) | `icon/default` (#4d5054 / #d4d6d9) |
| disabled | `bg/fill/tertiary/default` (#f0f1f2 / #3a3c40) | — | `text/disabled` (#babcbf / #616469) | `icon/disabled` (#babcbf / #616469) |
| loading | `bg/fill/tertiary/default` (#f0f1f2 / #3a3c40) | — | oculto | `loader` `icon/disabled` (#babcbf / #616469) |

**destructive** (suave: fondo de superficie, texto rojo; no hay variante roja sólida)

| State | Fondo | Borde | Label | Ícono |
|---|---|---|---|---|
| default | `bg/surface/danger/default` (#fef1f1 / #802424) | — | `text/danger/default` (#b83434 / #fce3e3) | `icon/danger/default` (#b83434 / #f9bcbc) |
| hover | `bg/surface/danger/hover` (#fce3e3 / #9c2c2c) | — | `text/danger/default` (#b83434 / #fce3e3) | `icon/danger/default` (#b83434 / #f9bcbc) |
| pressed | `bg/surface/danger/pressed` (#f69494 / #d43c3c) | — | `text/danger/default` (#b83434 / #fce3e3) | `icon/danger/default` (#b83434 / #f9bcbc) |
| selected | `bg/surface/danger/selected` (#f9bcbc / #b83434) | — | `text/danger/default` (#b83434 / #fce3e3) | `icon/danger/default` (#b83434 / #f9bcbc) |
| disabled | `bg/fill/secondary/default` (#f7f8fa / #313336) | — | `text/disabled` (#babcbf / #616469) | `icon/disabled` (#babcbf / #616469) |
| loading | `bg/fill/secondary/default` (#f7f8fa / #313336) | — | oculto | `loader` `icon/disabled` (#babcbf / #616469) |

**ghost** (sin fondo en ningún estado; solo cambia el color)

| State | Fondo | Borde | Label | Ícono |
|---|---|---|---|---|
| default | sin fill | — | `text/brand/default` (#2d49a1 / #e3e9fc) | `icon/brand/default` (#627dd0 / #b8c5ee) |
| hover | sin fill | — | `text/brand/hover` (#294291 / #f1f4fe) | `icon/brand/hover` (#3658c1 / #e3e9fc) |
| pressed | sin fill | — | `text/brand/pressed` (#243a80 / #ffffff) | `icon/brand/pressed` (#3251b1 / #f1f4fe) |
| selected | sin fill | — | `text/brand/selected` (#243a80 / #f1f4fe) | `icon/brand/selected` (#3251b1 / #ffffff) |
| disabled | sin fill | — | `text/disabled` (#babcbf / #616469) | `icon/disabled` (#babcbf / #616469) |
| loading | sin fill | — | oculto | `loader` `icon/disabled` (#babcbf / #616469) |

**Switch** (ítem del control segmentado, ver §12.4; radio 6 en la variante)

| State | Fondo | Label | Ícono |
|---|---|---|---|
| default | transparente | `text/secondary` (#585a5e / #c6c8cc) | `icon/default` (#4d5054 / #d4d6d9) |
| hover | sin fill | `text/primary` (#313336 / #f0f1f2) | `icon/default` (#4d5054 / #d4d6d9) |
| pressed | `bg/fill/tertiary/pressed` (#abaeb2 / #6c6e73) | `text/primary` (#313336 / #f0f1f2) | `icon/default` (#4d5054 / #d4d6d9) |
| selected | `bg/surface/default` (#ffffff / #27292b) | `text/primary` (#313336 / #f0f1f2) | `icon/default` (#4d5054 / #d4d6d9) |
| disabled | `bg/fill/tertiary/default` (#f0f1f2 / #3a3c40) | `text/disabled` (#babcbf / #616469) | `icon/disabled` (#babcbf / #616469) |
| loading | `bg/fill/tertiary/default` (#f0f1f2 / #3a3c40) | oculto | `loader` `icon/disabled` (#babcbf / #616469) |

**Tap** (pestaña, ver §5; `pill?` = tabRounded; borde 1 px arriba, izquierda y derecha, 0 abajo)

| State | Fondo | Borde | Label | Ícono |
|---|---|---|---|---|
| default | `bg/surface/default` (#ffffff / #27292b) | `border/default` (#c6c8cc / #4d5054) | `text/primary` (#313336 / #f0f1f2) | `icon/default` (#4d5054 / #d4d6d9) |
| hover | `bg/surface/hover` (#f7f8fa / #313336) | `border/default` (#c6c8cc / #4d5054) | `text/primary` (#313336 / #f0f1f2) | `icon/default` (#4d5054 / #d4d6d9) |
| pressed | `bg/fill/brand/pressed` (#2d49a1 / #627dd0) | — | `text/text-on-color` (#ffffff / #ffffff) | `icon/on-color` (#ffffff / #ffffff) |
| selected | `bg/fill/brand/default` (#3658c1 / #3251b1) | — | `text/text-on-color` (#ffffff / #ffffff) | `icon/on-color` (#ffffff / #ffffff) |
| disabled | `bg/surface/disabled` (#f7f8fa / #313336) | `border/default` (#c6c8cc / #4d5054) | `text/disabled` (#babcbf / #616469) | `icon/disabled` (#babcbf / #616469) |
| loading | `bg/surface/disabled` (#f7f8fa / #313336) | `border/default` (#c6c8cc / #4d5054) | oculto | `loader` `icon/disabled` (#babcbf / #616469) |

### 1.4 Foco, badge y sombra

| Elemento | Especificación |
|---|---|
| `🎯 focus?` = true | capa `focus border`: 2 px OUTSIDE `border/focus` (#627dd0 / #627dd0), desplazada −2 px (anillo a 2 px del borde); radio control + 2 (ej. sm 8 → 10). CSS: `outline: 2px solid; outline-offset: 2px` |
| Badge (`🔵 show badge`) | punto 12 × 12, pill, `bg/fill/danger/default` (#ef4444 / #d43c3c), arriba a la derecha del contenido |
| Sombra | ninguna en ningún estado |

### 1.5 Icon button (página "Icon button")

Propiedades: `Icon button` → `👁️ Badge?` bool · `🎨 color`: primary, secondary, tertiary, destructive, gost brand · `🚦 state`: default, hover, pressed, selected, disabled, loading. Base `_base icon button` → `🎯 Focus?` bool · `🔄 Content` (instance swap) · `📏 Size`: xxs, xs, sm, md, lg · `⚪ pill?`: none, xs, sm, md, lg, pill.

| Size | Caja | Ícono |
|---|---|---|
| xxs | 20 × 20 | 10 |
| xs | 32 × 32 | 16 |
| sm | 36 × 36 | 16 |
| md | 40 × 40 | 20 |
| lg | 48 × 48 | 24 |

| color / state | default | hover | pressed | selected | disabled y loading |
|---|---|---|---|---|---|
| primary (fondo; ícono `icon/on-color` (#ffffff / #ffffff)) | `bg/fill/brand/default` (#3658c1 / #3251b1) | `bg/fill/brand/hover` (#3251b1 / #3658c1) | `bg/fill/brand/pressed` (#2d49a1 / #627dd0) | `bg/fill/brand/selected` (#627dd0 / #2d49a1) | `bg/fill/brand/disabled` (#b8c5ee / #243a80) |
| secondary (borde `border/default` (#c6c8cc / #4d5054); ícono `icon/default` (#4d5054 / #d4d6d9)) | `bg/fill/secondary/default` (#f7f8fa / #313336) | `bg/fill/secondary/hover` (#e1e3e5 / #44464a) | `bg/fill/secondary/pressed` (#babcbf / #616469) | `bg/fill/secondary/selected` (#d4d6d9 / #4d5054) | `bg/fill/disabled` (#f7f8fa / #313336) + borde `border/disabled` (#d4d6d9 / #44464a) + ícono `icon/disabled` (#babcbf / #616469) |
| tertiary (ícono `icon/default` (#4d5054 / #d4d6d9)) | transparente | `bg/fill/tertiary/hover` (#d4d6d9 / #4d5054) | `bg/fill/tertiary/pressed` (#abaeb2 / #6c6e73) | `bg/fill/tertiary/selected` (#c6c8cc / #585a5e) | `bg/fill/disabled` (#f7f8fa / #313336) + ícono `icon/disabled` (#babcbf / #616469) |
| destructive (ícono `icon/danger/default` (#b83434 / #f9bcbc)) | `bg/surface/danger/default` (#fef1f1 / #802424) | `bg/surface/danger/hover` (#fce3e3 / #9c2c2c) | `bg/surface/danger/pressed` (#f69494 / #d43c3c) | `bg/surface/danger/selected` (#f9bcbc / #b83434) | `bg/fill/disabled` (#f7f8fa / #313336) + ícono `icon/disabled` (#babcbf / #616469) |
| gost brand (ícono `icon/default` (#4d5054 / #d4d6d9)) | transparente | `bg/fill/hover` (#f0f1f2 / #3a3c40) | `bg/fill/secondary/pressed` (#babcbf / #616469) | `bg/fill/brand/default` (#3658c1 / #3251b1) + ícono `text/text-on-color` (#ffffff / #ffffff) | `bg/fill/disabled` (#f7f8fa / #313336) + ícono `icon/disabled` (#babcbf / #616469) |

Loading muestra el glifo `loader`. Un botón solo de ícono necesita `aria-label` y tooltip (regla de la guía de íconos).

---

## 2. Badge y Tag

### 2.1 Badge

Propiedades del set público `Badge` (28 variantes): `🎨 color`: accent, gray, success, warning, danger, info = accent · `🎭 theme`: soft, solid = solid · `⚪ stroke?`: false, true = false · `state`: default, disabled (disabled solo existe en `color=info`).

Anatomía: `_base` (auto layout) > `_content` (horizontal, g4) > ícono 10 (FA) + `label` `Type/Body/XS/Semibold` (12/17.5/600).

Tamaños (componente `_base`, `Type` × `size`; el set público usa md):

| Type / size | Alto | Padding V / H | Radio |
|---|---|---|---|
| default / sm | 16 | 2 / 8 | 6 (`radius/control/xs`) |
| default / md | 20 | 2 / 8 | 8 (`radius/control/sm`) |
| default / lg | 24 | 4 / 8 | 8 (`radius/control/sm`) |
| Num / sm (contador) | 16 | 4 / 4 | 9999 (`radius/control/pill`) |
| dot / dot | 12 × 12 | 0 | 9999 |

Borde (`⚪ stroke?` = true): 1 px OUTSIDE.

| color | theme | Fondo | Borde | Texto | Ícono |
|---|---|---|---|---|---|
| accent | soft | `bg/surface/brand/default` (#f1f4fe / #243a80) | `border/brand` (#3658c1 / #627dd0) | `text/brand/default` (#2d49a1 / #e3e9fc) | `icon/brand/default` (#627dd0 / #b8c5ee) |
| accent | solid | `bg/fill/brand/default` (#3658c1 / #3251b1) | `border/all-colors/blue` (#627dd0 / #3658c1) | `text/text-on-color` (#ffffff / #ffffff) | `icon/on-color` (#ffffff / #ffffff) |
| gray | soft | `bg/fill/tertiary/default` (#f0f1f2 / #3a3c40) | `border/default` (#c6c8cc / #4d5054) | `text/primary` (#313336 / #f0f1f2) | `icon/secondary/default` (#616469 / #babcbf) |
| gray | solid | `bg/surface/tertiary/default` (#e1e3e5 / #44464a) | `border/default` (#c6c8cc / #4d5054) | `text/primary` (#313336 / #f0f1f2) | `icon/secondary/default` (#616469 / #babcbf) |
| success | soft | `bg/surface/success/default` (#f1fef6 / #16803d) | `border/success` (#22c55e / #53d382) | `text/success/default` (#1ca34e / #e3fcec) | `icon/success/default` (#1ca34e / #b3efc9) |
| success | solid | `bg/fill/success/default` (#22c55e / #1fb456) | `border/all-colors/green` (#53d382 / #22c55e) | `text/text-on-color` (#ffffff / #ffffff) | `icon/on-color` (#ffffff / #ffffff) |
| warning | soft | `bg/surface/warning/default` (#fefbf1 / #806204) | `border/warning` (#eab308 / #efc43f) | `text/warning/default` (#b58b06 / #fcf6e3) | `icon/warning/default` (#b58b06 / #f8e6ad) |
| warning | solid | `bg/fill/warning/default` (#eab308 / #d09f07) | `border/all-colors/yellow` (#efc43f / #eab308) | `text/text-on-color` (#ffffff / #ffffff) | `icon/on-color` (#ffffff / #ffffff) |
| danger | soft | `bg/surface/danger/default` (#fef1f1 / #802424) | `border/danger` (#ef4444 / #f36c6c) | `text/danger/default` (#b83434 / #fce3e3) | `icon/danger/default` (#b83434 / #f9bcbc) |
| danger | solid | `bg/fill/danger/default` (#ef4444 / #d43c3c) | `border/all-colors/red` (#f36c6c / #ef4444) | `text/text-on-color` (#ffffff / #ffffff) | `icon/on-color` (#ffffff / #ffffff) |
| info | soft | `bg/surface/info/default` (#f1fcfe / #046d80) | `border/info` (#06b6d4 / #3ec7de) | `text/info/default` (#0592aa / #e3f9fc) | `icon/info/default` (#0592aa / #ace9f2) |
| info | solid | `bg/fill/info/default` (#06b6d4 / #06a4bf) | `border/all-colors/cyan` (#3ec7de / #06b6d4) | `text/text-on-color` (#ffffff / #ffffff) | `icon/on-color` (#ffffff / #ffffff) |
| (disabled) | soft | `bg/surface/disabled` (#f7f8fa / #313336) | `border/disabled` (#d4d6d9 / #44464a) | `text/disabled` (#babcbf / #616469) | `icon/disabled` (#babcbf / #616469) |
| (disabled) | solid | `bg/fill/disabled` (#f7f8fa / #313336) | `border/disabled` (#d4d6d9 / #44464a) | `text/disabled` (#babcbf / #616469) | `icon/disabled` (#babcbf / #616469) |

Dentro de un Button el badge es un punto de 12 px `bg/fill/danger/default` (#ef4444 / #d43c3c) (§1.4).

### 2.2 Tag

Propiedades: `Tag` → `🎨 Color`: accent, gray, success, warning, danger, info = accent. Cada color es un set interno (`_gray`, `_accent`, `_success`, `_warning`, `_danger`, `_info`) con `🚦 state`: default, hover, pressed, selected, disabled · `👁️ xmark?`: false, true = true · `👁️ border?`: false, true = false. Contenido `_content`: `👁️ left Icon` bool · `👁️ xmark` bool · `🅰️ label` text = "Tag" · `🎭 type`: icon, avatar.

| Parte | Especificación |
|---|---|
| Contenedor | alto 20, p 2/4/2/6, g 0, radio 8 (`radius/control/sm`) |
| `_content` | horizontal, g4 |
| Ícono izquierdo | 10 (`info-circle`); con type=avatar: imagen 16 × 16 |
| Label | `Type/Body/XS/Semibold` (el `_content` suelto trae `Body/XS/Bold`; las instancias usan Semibold) |
| `xmark` (cerrar) | 14 × 14, p2, radio 6 (`radius/control/xs`), glifo `xmark` 10 |
| `border?` = true | 1 px INSIDE `border/default` (#c6c8cc / #4d5054) (verificado en gray) |

| Color | Fondo | Texto | Ícono e xmark |
|---|---|---|---|
| gray | `bg/fill/tertiary/default` (#f0f1f2 / #3a3c40) | `text/primary` (#313336 / #f0f1f2) | `icon/default` (#4d5054 / #d4d6d9) |
| accent | `bg/surface/brand/default` (#f1f4fe / #243a80) | `text/brand/default` (#2d49a1 / #e3e9fc) | `icon/brand/default` (#627dd0 / #b8c5ee) |
| success | `bg/surface/success/default` (#f1fef6 / #16803d) | `text/success/default` (#1ca34e / #e3fcec) | `icon/success/default` (#1ca34e / #b3efc9) |
| warning | `bg/surface/warning/default` (#fefbf1 / #806204) | `text/warning/default` (#b58b06 / #fcf6e3) | `icon/warning/default` (#b58b06 / #f8e6ad) |
| danger | `bg/surface/danger/default` (#fef1f1 / #802424) | `text/danger/default` (#b83434 / #fce3e3) | `icon/danger/default` (#b83434 / #f9bcbc) |
| info | `bg/surface/info/default` (#f1fcfe / #046d80) | `text/info/default` (#0592aa / #e3f9fc) | `icon/info/default` (#0592aa / #ace9f2) |

`🚦 state` solo cambia el botón `xmark` (el fondo del tag no cambia), salvo disabled:

| state | gray: fondo xmark / ícono | accent: fondo xmark / ícono |
|---|---|---|
| default | — / `icon/default` (#4d5054 / #d4d6d9) | — / `icon/brand/default` (#627dd0 / #b8c5ee) |
| hover | `bg/fill/tertiary/hover` (#d4d6d9 / #4d5054) / `icon/hover` (#3a3c40 / #f0f1f2) | `bg/surface/brand/hover` (#e3e9fc / #294291) / `icon/brand/hover` (#3658c1 / #e3e9fc) |
| pressed | `bg/fill/tertiary/pressed` (#abaeb2 / #6c6e73) / `icon/pressed` (#27292b / #ffffff) | `bg/surface/brand/pressed` (#8da1df / #3251b1) / `icon/brand/pressed` (#3251b1 / #f1f4fe) |
| selected | `bg/fill/tertiary/selected` (#c6c8cc / #585a5e) / `icon/pressed` (#27292b / #ffffff) | `bg/surface/brand/selected` (#b8c5ee / #2d49a1) / `icon/brand/pressed` (#3251b1 / #f1f4fe) |
| disabled | tag completo: fondo `bg/surface/disabled` (#f7f8fa / #313336), texto `text/disabled` (#babcbf / #616469), íconos `icon/disabled` (#babcbf / #616469) | igual |

---

## 3. Cards

El archivo Cards contiene tarjetas de producto, no una tarjeta genérica. Sets: `Card Catalogo / Inventario`, `Card Proveedor`, `Card Catalogo`, `Card- Dashboard`, más piezas (`_Estatus medio`, `_Estatus proveedor`, `_Agregar`, `Disponivilidad actualizada`, `Disponibilidad interna`, `Icono de exclusividad`, `_rating`, `_Stat Change Container`).

### 3.1 `Card Catalogo / Inventario` (tarjeta de medio)

Propiedades: `Exclusivo?` bool = true · `Media`: Sitios Fijos, Rutas, Indoor (Padre), Indoor (Hijo) · `State`: Default, Hover, Disabled · `Focus`: false, true.

| Parte | Especificación |
|---|---|
| Contenedor | 250 × 311, vertical, p 0/0/16/0, g16, radio 12 (`radius/surface/card`), fondo `bg/surface/default` (#ffffff / #27292b), borde 1 px INSIDE `border/subtle` (#d4d6d9 / #44464a), sin sombra |
| `Image_container` | 250 × 141, radio 12/12/0/0 |
| `media_details` | vertical, p 0/16, g4 |
| Tipo de medio | `Type/Caption/XS` `text/tertiary` (#6c6e73 / #9fa2a6), en mayúsculas ("ESPECTACULAR") |
| Clave del medio | `Type/Body/SM/Bold` `text/primary` (#313336 / #f0f1f2) |
| Plaza (link) | `Type/Body/XS/Regular` `text/link/default` (#3251b1 / #627dd0), g4 con ícono |
| `format_type` | fila, p 8/0/0/0, g8 |
| `CTA` | fila 32 de alto, p 0/16, g12 |
| `Icono de exclusividad` | 20 × 20, pill, fondo `bg/fill/default` (#ffffff / #27292b) |
| `_Estatus medio` | Stage: Disponible, Inactivo (40 × 18) |

| State | Fondo | Borde | Sombra |
|---|---|---|---|
| Default | `bg/surface/default` (#ffffff / #27292b) | `border/subtle` (#d4d6d9 / #44464a) | ninguna |
| Hover | `bg/surface/brand/hover` (#e3e9fc / #294291) | `border/default` (#c6c8cc / #4d5054) | `shadows/shadow-3` |
| Disabled | `bg/surface/default` (#ffffff / #27292b) | `border/subtle` (#d4d6d9 / #44464a) | ninguna |
| Focus = true | + anillo 2 px OUTSIDE `border/focus` (#627dd0 / #627dd0), radio 14, a 2 px | | |

### 3.2 `Card- Dashboard` (indicador / KPI)

Propiedades: `Show Icon ` bool · `amount` text = "3" · `Show trend` bool · `Tittle` text = "Proximas a vencer" · `Show header` bool · `Stage`: Default, Warning, Danger, Pause.

| Parte | Especificación |
|---|---|
| Contenedor | 170 × 106, vertical, p16, g4, radio 12 (`radius/surface/card`), fondo `bg/surface/default` (#ffffff / #27292b), borde 1 px INSIDE `border/default` (#c6c8cc / #4d5054), sin sombra |
| Encabezado | fila g4: ícono 16 (caja 20, p2) + título `Type/Body/XS/Regular` `text/tertiary` (#6c6e73 / #9fa2a6) |
| Valor | `Type/Heading/H3` (20/25/600), color `icon/all-colors/blue` (#3658c1 / #627dd0) |
| Tendencia `_Stat Change Container` | fila g8: texto `Type/Body/SM/Semibold` + ícono 16 |

| Stage | Ícono | Color del ícono |
|---|---|---|
| Default | `arrow-trend-up` | `icon/all-colors/blue` (#3658c1 / #627dd0) |
| Warning | `calendar-circle-exclamation` | `icon/all-colors/orange` (#f97316 / #fa924a) |
| Danger | `octagon-exclamation` | `icon/all-colors/red` (#ef4444 / #f36c6c) |
| Pause | `circle-pause` | `icon/all-colors/yellow` (#eab308 / #efc43f) |

| Tendencia (Stage) | Texto e ícono | Glifo |
|---|---|---|
| Positive | `text/success/default` (#1ca34e / #e3fcec) | `arrow-up-right` |
| Negative | `text/danger/default` (#b83434 / #fce3e3) | `arrow-down-right` |
| Neutral | `text/secondary` (#585a5e / #c6c8cc) | `dash` |

`Card Proveedor` (270 × 319; State: Default, Hover, Selected, Disabled; Focus) no se detalló.

---

## 4. Table

Archivo Table, página "Table". Plantilla completa `Table Template`; piezas `Header Cell`, `Cell`, `Colum`, `_Table Tool Bar`, `Pagination`.

### 4.1 Contenedor (`Table Template`)

| Parte | Especificación |
|---|---|
| Contenedor | vertical, p16, g16, radio 16 (`radius/surface/sheet`), fondo `bg/surface/default` (#ffffff / #27292b), borde 1 px INSIDE `border/default` (#c6c8cc / #4d5054) |
| Orden | `_Table Tool Bar` → `Table Content Template` (columnas lado a lado, g0) → `Pagination` |
| Separador de filas | cada `Colum` es vertical con g2 y fondo `bg/surface/tertiary/default` (#e1e3e5 / #44464a): la línea entre filas es ese hueco de 2 px |
| Última columna | borde izquierdo 2 px OUTSIDE `border/subtle` (#d4d6d9 / #44464a) (columna fija) |

### 4.2 Header Cell

Propiedades (todas False/True salvo State): `🚦State`: Default, Hover · `Column Locked` · `Filter Applied` · `Sort up` · `Sort Down` · `Only Check` · `Only Icon` · `Skeleton`.

| Parte | Especificación |
|---|---|
| Celda | alto 48, horizontal, p 0/16, g8 |
| Fondo | Default `bg/surface/default` (#ffffff / #27292b) · Hover `bg/surface/hover` (#f7f8fa / #313336) |
| Título | `Type/Body/XS/Regular` `text/secondary` (#585a5e / #c6c8cc), en mayúsculas en el ejemplo |
| Only Icon | ícono 16 `icon/secondary/default` (#616469 / #babcbf) |
| Skeleton | barra 208 × 14, radio 100, degradado |

Controles de 20 × 20 (botón de ícono xxs, radio 6 `radius/control/xs`, glifo 10):

| Control | Default | Hover | Activo |
|---|---|---|---|
| `_Sort - Header Cell` (Default, Hover, Active -up, Active-down) | `arrow-down-arrow-up` `icon/secondary/default` (#616469 / #babcbf) | fondo `bg/fill/tertiary/hover` (#d4d6d9 / #4d5054) | `arrow-up` / `arrow-down` en `icon/all-colors/blue` (#3658c1 / #627dd0) |
| `_Filter - Header Cell` (Default, Hover, Selected, Active) | `filter` `icon/secondary/default` (#616469 / #babcbf) | fondo `bg/surface/default` (#ffffff / #27292b), ícono `icon/secondary/hover` (#585a5e / #d4d6d9) | Selected y Active: `icon/selected` (#3251b1 / #627dd0) |
| `_Column Lock - Header Cell` (Default, Hover, Selected, Active) | no verificado | | |

### 4.3 Cell

Propiedades: `🅰️Text Content` = "Cell Content" · `👁️Show Icon ` · `👁️Show file ` · `🅰️Secundary text` = "Sub Content" · `👁️Show Checkbox` · `👁️Show Avatar` · `🅰️Calificación` · `👁️Show Star` · `Show chevron` · `❇️ Type` (25): Default, Primary, Status, Actions, Link, Avatars, Text Field, Dropdawn, Button, Progress Bar, Skeleton, Tags, Checkbox, Icon, Stars, Icon Button, Numerica, Fecha, Chevron 1–5, Image, Image stack · `🚦State`: Default, Hover, Selected, Disabled, Focused.

Celda: alto 56 (ancho de muestra 240), horizontal, p 0/16, g8.

| State | Fondo | Texto | Borde |
|---|---|---|---|
| Default | `bg/surface/default` (#ffffff / #27292b) | `text/primary` (#313336 / #f0f1f2) | — |
| Hover | `bg/surface/hover` (#f7f8fa / #313336) | `text/primary` (#313336 / #f0f1f2) | — |
| Selected | `bg/surface/brand/default` (#f1f4fe / #243a80) | `text/brand/selected` (#243a80 / #f1f4fe) | — |
| Disabled | `bg/surface/disabled` (#f7f8fa / #313336) | `text/disabled` (#babcbf / #616469) | — |
| Focused | `bg/surface/brand/default` (#f1f4fe / #243a80) | `text/primary` (#313336 / #f0f1f2) | 1 px INSIDE `border/focus` (#627dd0 / #627dd0) |

| Type | Contenido |
|---|---|
| Default, Numerica, Fecha | `Type/Body/SM/Regular` `text/primary` (#313336 / #f0f1f2) ("$1,456.00", "14/12/2025") |
| Link | `Type/Body/SM/Semibold` `text/link/default` (#3251b1 / #627dd0) |
| Primary (columna clave) | avatar 32 pill `bg/fill/all-colors/blue` + título `Type/Body/SM/Bold` `text/primary` (#313336 / #f0f1f2) + subtítulo `Type/Body/XS/Regular` `text/tertiary` (#6c6e73 / #9fa2a6) |
| Status | un Tag (ej. `_success` "Disponible") |
| Tags | varios Tag; el sobrante como Tag gray "+3" |
| Actions | Icon buttons tertiary 32, radio 8, glifo 16 `icon/default` (#4d5054 / #d4d6d9) |
| Icon Button | un Icon button tertiary 32 |
| Button | Button secondary xs, pill sm (radio 8) |
| Text Field | input 32, p 4/8, g8, radio 8, fondo `bg/fill/default` (#ffffff / #27292b), borde 1 px INSIDE `border/default` (#c6c8cc / #4d5054) |
| Dropdawn | igual que Text Field con p 6/8 |
| Checkbox | caja 16 × 16, radio 2 (`radius/surface/forms`), fondo `bg/fill/default` (#ffffff / #27292b), borde `border/default` (#c6c8cc / #4d5054) |
| Progress Bar | `_bar` 8 de alto, pill, pista `bg/fill/tertiary/default` (#f0f1f2 / #3a3c40), relleno `bg/fill/brand/default` (#3658c1 / #3251b1) |
| Skeleton | barra 208 × 14, radio 100, degradado |

### 4.4 Columnas (`Colum`)

`Property 1`: Checkbox Column, Icon Column, Key Column.

| Columna | Ancho | Estructura |
|---|---|---|
| Checkbox Column | 50 | Header Cell 48 + celdas 56 con checkbox |
| Icon Column | 50 | Header Cell 48 + celdas 56 con ícono |
| Key Column | 240 | Header Cell 48 + celdas 56 (clave del registro) |

### 4.5 `_Table Tool Bar`

Propiedades: `👁️Show Settings` · `👁️Show Search` · `👁️Show Filterls` · `👁️Show Button group` · `👁️Show other buttons` · `👁️Show Dropdawn` · `👁️Show Secundary Button` · `👁️Show primary button` (bool, true) · `Filter Applied`: off, on.

| Zona | Contenido (alto 32) |
|---|---|
| Contenedor | alto 64, p16, fondo `bg/fill/default` (#ffffff / #27292b), tres grupos con espacio entre ellos |
| Izquierda (g8) | Icon button 32 + Divider vertical + Input de búsqueda 309 ("Buscar…") + Icon button de filtros con badge |
| Centro | Switch (control segmentado SM, §12.4) |
| Derecha (g8) | 2 Icon buttons + Autocomplete 309 + Button secondary + Button primary |

Paginación al pie: §16.4.

---

## 5. Tabs

Set `Tap ` (con espacio final): `Show Add +` bool = true · `Sizes`: lg, md, sm, xs, xxl = xxl · `Pill?`: False, True = True.

Anatomía: contenedor horizontal p 0/16, g8 > `Button Group` (g0) con instancias `Button` color=Tap + `Icon button` gost brand (agregar "+").

| Sizes | Pestaña default (alto, `size` del Button) | Pestaña seleccionada (alto) | Label default | Label seleccionada |
|---|---|---|---|---|
| xxl (= xxs) | 20 (xxs) | 37 | `Type/Body/XS/Regular` | `Type/Body/SM/Bold` |
| xs | 32 (xs) | 37 | `Type/Body/SM/Regular` | `Type/Body/SM/Bold` |
| sm | 36 (sm) | 41 | `Type/Body/SM/Regular` | `Type/Body/SM/Bold` |
| md | 40 (md) | 45 | `Type/Body/SM/Regular` | `Type/Body/SM/Bold` |
| lg | 48 (lg) | 53 | `Type/Body/SM/Regular` | `Type/Body/SM/Bold` |

| Pill? | Radio de pestaña |
|---|---|
| True | 6 / 6 / 0 / 0 (`pill?` = tabRounded) |
| False | 0 (`pill?` = tab) |

La pestaña seleccionada es más alta porque su contenido (`_content` Default=Tap-active) suma p 4/0/4/0. Colores por estado: tabla "Tap" de §1.3 (seleccionada = `bg/fill/brand/default` (#3658c1 / #3251b1) con texto `text/text-on-color` (#ffffff / #ffffff)).

---

## 6. Stepper

Sets: `Stepper` → `Orientation`: Vertical, Horizontal, Horizontal - white, Vertical - white · `_Step` → `Step text` text = "Paso 1" · `Tittle` text = "TITTLE STEPER" · `Orientation`: Horizontal, Vertical · `_Status` → `Number` text = "1" · `🚦State`: Active, Check, default.

| Parte | Horizontal | Vertical |
|---|---|---|
| Stepper (5 pasos) | 735 × 125, pasos de 147 | 201 × 355, pasos de 71 de alto |
| `_Step` | vertical, p16, g16 | horizontal, p16, g16 |
| Conector | línea 1 px `icon/all-colors/blue` (#3658c1 / #627dd0) detrás de los círculos; en "- white": `border/on-color` (#ffffff / #ffffff) | igual |
| Texto | "Paso N" `Type/Body/XS/Regular` `text/tertiary` (#6c6e73 / #9fa2a6); título `Type/Body/SM/Bold` `text/primary` (#313336 / #f0f1f2); g0 | igual |

`_Status`: círculo 38 × 38, pill, borde 3 px OUTSIDE.

| State | Significado | Fondo | Borde 3 px | Contenido |
|---|---|---|---|---|
| default | pendiente | `bg/surface/default` (#ffffff / #27292b) | `border/all-colors/blue` (#627dd0 / #3658c1) | número `Type/Heading/H3` en `icon/all-colors/blue` (#3658c1 / #627dd0) |
| Active | en curso | `bg/fill/all-colors/blue` (#3658c1 / #3251b1) | `border/all-colors/blue` (#627dd0 / #3658c1) | punto 18 × 18 `bg/surface/default` (#ffffff / #27292b) |
| Check | completado | `bg/fill/brand/default` (#3658c1 / #3251b1) | `border/focus` (#627dd0 / #627dd0) | glifo `check` 24 `icon/on-color` (#ffffff / #ffffff) |

No hay estados error, bloqueado ni disabled.

---

## 7. Modal (`Modal Template`)

Propiedades: `Show Footer` bool · `Show Header` bool · `Slot content 1`…`Slot content 6` (SLOT, uno por tamaño) · `📏Size`: XS, SM, MD, LG, XL, XXL = XXL.

| Size | Ancho |
|---|---|
| XS | 320 |
| SM | 500 |
| MD | 600 |
| LG | 896 |
| XL | 1100 |
| XXL | 1350 |

Alto: según contenido (312 en la muestra).

| Parte | Especificación |
|---|---|
| Contenedor | vertical, g0, radio 16 (`radius/surface/modal`), fondo `bg/fill/default` (#ffffff / #27292b), borde 1 px OUTSIDE `border/default` (#c6c8cc / #4d5054), sombra `shadows/shadow-3` |
| Header (`_Header`) | alto 64, horizontal, p16, borde inferior 1 px INSIDE `border/default` (#c6c8cc / #4d5054) |
| Header: título | g8: círculo 32 (p8, pill, fondo `bg/surface/all-colors/blue` #e3e9fc / #243a80, ícono 16 `icon/all-colors/blue`) + título `Type/Heading/H3` `text/primary` (#313336 / #f0f1f2) |
| Header: centro (opcional) | Switch SM (§12.4) |
| Header: acciones | g16: Badge + Icon buttons secondary 32 (ej. cerrar) |
| Body (slot) | vertical, p8, g8 |
| Footer (`_Footer`) | alto 64, p16, borde superior 1 px INSIDE `border/default` (#c6c8cc / #4d5054); fila: Icon button secondary 32 a la izquierda; a la derecha g12: Button secondary + Button primary (xs, 32) |
| Fondo de pantalla | no forma parte del componente. Token disponible: `bg/overlay/default` (#00000066 / #00000099); z-index `Layer/dialog/backdrop` 690 y `Layer/dialog/modal` 700 |

---

## 8. Toast, Alerts y Notification

### 8.1 Toast

Propiedades: `⏱️ Show timer` bool = true · `🎨 Color`: Neutro, Succes, Warning, Danger, Info = Succes · `Size`: lg, md, sm = lg.

| Parte | Especificación |
|---|---|
| Contenedor | ancho 400, vertical, g0, radio 12 (`radius/surface/card`), fondo `bg/surface/default` (#ffffff / #27292b), borde 1 px INSIDE `border/default` (#c6c8cc / #4d5054), sombra `shadows/shadow-5` |
| Alto por Size | lg 162 (con botones), md 118 (sin botones), sm 75 (solo título y subtítulo) |
| `_base` | horizontal, p12 |
| Ícono (`_Icon-avatar`) | 24 × 24, pill, p4, glifo 16 |
| Título | `Type/Body/SM/Semibold` `text/primary` (#313336 / #f0f1f2) |
| Subtítulo | `Type/Body/XS/Regular` `text/secondary` (#585a5e / #c6c8cc) |
| Cerrar | Icon button tertiary xxs 20, `xmark` `icon/default` (#4d5054 / #d4d6d9) |
| Cuerpo (lg, md) | `Type/Body/XS/Medium` `text/primary` (#313336 / #f0f1f2) |
| Botones (lg) | fila p 12/20/0/0, g6: Button tertiary + Button secondary |
| Timer | barra `_bar` xxs: 8 de alto, pill, pista `bg/fill/tertiary/default` (#f0f1f2 / #3a3c40); zona total 12 (4 + 8) |

| Color | Glifo | Ícono | Fondo del ícono | Relleno del timer |
|---|---|---|---|---|
| Succes | `circle-check` | `icon/success/default` (#1ca34e / #b3efc9) | `bg/surface/success/default` (#f1fef6 / #16803d) | `bg/fill/success/default` (#22c55e / #1fb456) |
| Warning | `warning` | `icon/warning/default` (#b58b06 / #f8e6ad) | `bg/surface/warning/default` (#fefbf1 / #806204) | `bg/fill/warning/default` (#eab308 / #d09f07) |
| Danger | `hexagon-exclamation` | `icon/danger/default` (#b83434 / #f9bcbc) | `bg/surface/danger/default` (#fef1f1 / #802424) | `bg/fill/danger/default` (#ef4444 / #d43c3c) |
| Info | `info-circle` | `icon/info/default` (#0592aa / #ace9f2) | `bg/surface/info/default` (#f1fcfe / #046d80) | `bg/fill/info/default` (#06b6d4 / #06a4bf) |
| Neutro | `shapes` | `icon/default` (#4d5054 / #d4d6d9) | `bg/surface/tertiary/default` (#e1e3e5 / #44464a) | `text/tertiary` (#6c6e73 / #9fa2a6) |

### 8.2 Alerts

Propiedades: `👁️Description` bool · `🅰️Text Description` text · `🅰️ Tittle ` text = "Alerta" · `👁️ Show Icon` · `👁️Show Secundary Button` · `👁️Show buttons` · `👁️Show close` (bool) · `⚪Theme`: Soft, Solid = Soft · `Stage`: Danger, Info, Success, Warning = Info.

| Parte | Especificación |
|---|---|
| Contenedor | ancho fluido (936 en muestra), horizontal, p16, g16, radio 8 (`radius/control/sm`), borde 1 px INSIDE |
| Izquierda | g8: ícono 20 + columna (título `Type/Body/MD/Bold`, descripción `Type/Body/XS/Regular`) |
| Derecha | g16: dos Button secondary (xs, 32) |
| Cerrar | Icon button secondary xxs 20, pill (fondo `bg/fill/secondary/default` (#f7f8fa / #313336), borde `border/default` (#c6c8cc / #4d5054)) |

| Theme / Stage | Fondo | Borde | Título y descripción |
|---|---|---|---|
| Soft / Info | `bg/surface/brand/default` (#f1f4fe / #243a80) | `border/all-colors/blue` (#627dd0 / #3658c1) | `text/brand/default` (#2d49a1 / #e3e9fc) |
| Soft / Success | `bg/surface/success/default` (#f1fef6 / #16803d) | `border/all-colors/green` (#53d382 / #22c55e) | `text/success/default` (#1ca34e / #e3fcec) |
| Soft / Warning | `bg/surface/warning/default` (#fefbf1 / #806204) | `border/all-colors/yellow` (#efc43f / #eab308) | `text/warning/default` (#b58b06 / #fcf6e3) |
| Soft / Danger | `bg/surface/danger/default` (#fef1f1 / #802424) | `border/all-colors/red` (#f36c6c / #ef4444) | `text/danger/default` (#b83434 / #fce3e3) |
| Solid / Info | `bg/fill/all-colors/blue` (#3658c1 / #3251b1) | `border/all-colors/blue` | `text/text-on-color` (#ffffff / #ffffff) |
| Solid / Success | `bg/fill/success/default` (#22c55e / #1fb456) | `border/all-colors/green` | `text/text-on-color` (#ffffff / #ffffff) |
| Solid / Warning, Solid / Danger | no verificado | | |

Info usa la superficie de marca (azul), no la de info (cian).

### 8.3 Notification

Set `Notification` (48 variantes): `🅰️ Title` · `🅱️ Subtitle` · `⏺️ Show counter` · `⏺️ Show content` · `⏺️ show subtitle?` · `⏺️ New?` · `⏺️ Contador?` · `timer?` (bool) · `🎭 tipo`: general, usuario, sistema · `🚦 state`: default, hover · `📚 intención`: confirmacion, critica, informativa, preventiva · `style`: popup, item.

| Parte | popup | item |
|---|---|---|
| Contenedor | 372 ancho, radio 12, fondo `bg/surface/default` (#ffffff / #27292b) (hover `bg/surface/hover` (#f7f8fa / #313336)), borde 1 px INSIDE `border/subtle` (#d4d6d9 / #44464a), sombra `shadows/shadow-5` | igual sin borde ni sombra |
| Contenido | vertical, p 12/0, g6 | igual |
| Encabezado | fila p 0/12, g12: ícono 24 (pill, p4) + título `Type/Body/SM/Semibold` `text/primary` (#313336 / #f0f1f2) + subtítulo `Type/Body/XS/Regular` `text/secondary` (#585a5e / #c6c8cc) + cerrar (`xmark` 10 `icon/default` (#4d5054 / #d4d6d9)) o fecha `Type/Body/XS/Regular` `text/tertiary` (#6c6e73 / #9fa2a6) | igual |
| Cuerpo | sangría p 0/12/0/48; `Type/Body/XS/Medium` `text/tertiary` (#6c6e73 / #9fa2a6) | igual |
| Contador | "5 notificaciones más" `Type/Body/XS/Regular` `text/tertiary` (#6c6e73 / #9fa2a6) | — |
| Timer | barra 8 color neutro (`text/tertiary` (#6c6e73 / #9fa2a6) sobre `bg/fill/tertiary/default` (#f0f1f2 / #3a3c40)) | — |

| intención | Glifo | Color |
|---|---|---|
| informativa | `info-circle` | `icon/brand/default` (#627dd0 / #b8c5ee) |
| confirmacion | `circle-check` | `icon/success/default` (#1ca34e / #b3efc9) |
| preventiva | `triangle-exclamation` | `icon/warning/default` (#b58b06 / #f8e6ad) |
| critica | `light-emergency-on` | `icon/danger/default` (#b83434 / #f9bcbc) |

Variantes de contenido (`_content`, `📜 content`): default, message, file, link, CTA; las de mensaje, archivo y link van en caja p 8/12, radio 8, fondo `bg/surface/brand/default` (#f1f4fe / #243a80); link en `text/link/default` (#3251b1 / #627dd0). Panel: `Notification_Panel` 392 de ancho sobre Popover (radio 12, sombra `shadows/shadow-3`).

---

## 9. Breadcrumbs

Sets: `breadcrumbs` → `Quantity`: one, two, tree, four, five, more five · `_Base` → `Text label` text = "Label" · `🚦Stage`: Default, Selected, More.

| Parte | Especificación |
|---|---|
| Contenedor | horizontal, g4, alto 18 |
| Ítem `Default` (nivel anterior) | label `Type/Body/XS/Bold` `text/tertiary` (#6c6e73 / #9fa2a6) + chevron 12 px (`CHEVRON RIGHT 2` de la librería de íconos), g4 |
| Ítem `Selected` (actual, último) | label `Type/Body/XS/Bold` `text/brand/default` (#2d49a1 / #e3e9fc), sin chevron |
| Ítem `More` (colapsado) | "..." `Type/Body/XS/Bold` `text/tertiary` (#6c6e73 / #9fa2a6) + chevron; se usa en "more five" antes del último |

No hay estado hover.

---

## 10. Progress bar

### 10.1 Barra (`_bar`)

`🎨 color`: brand, danger, neutro, success = brand · `📏 size`: xxs, xs, sm, md, lg = xxs.

| size | Alto |
|---|---|
| xxs | 8 |
| xs | 10 |
| sm | 12 |
| md | 16 |
| lg | 20 |

Pista y relleno pill (`radius/control/pill`). Pista `bg/fill/tertiary/default` (#f0f1f2 / #3a3c40). Relleno: brand `bg/fill/brand/default` (#3658c1 / #3251b1) · success `bg/fill/success/default` (#22c55e / #1fb456) · danger `bg/fill/danger/default` (#ef4444 / #d43c3c) · neutro `text/tertiary` (#6c6e73 / #9fa2a6).

### 10.2 `Progress bar` (con textos)

Propiedades: `↪🏷️ Label` text · `↪🏷️ Percentage` text = 75 · `🔽Show Label` · `🔽 Progress header` · `↪︎🔽Progress Info` · `ㅤ↪⌚ ETA` · `↪❌ Close button` · `🆘 Helper text?` (bool) · `🤏 Commpact?`: false, true · `🚫 Disabled`: false, true.

| Parte | Regular (`Commpact?` = false) | Compacta |
|---|---|---|
| Disposición | encabezado arriba (p-bottom 4), barra xxs, ayuda debajo; ancho 402 | label, barra y datos en una fila g8 (alto 20) |
| Label | `Type/Body/XS/Medium` `text/primary` (#313336 / #f0f1f2) | igual |
| Porcentaje "75" + "%" y ETA "(1m restante)" | `Type/Body/XS/Medium` `text/secondary` (#585a5e / #c6c8cc), g4 | igual |
| Cerrar | Icon button tertiary xxs 20, `xmark` `icon/default` (#4d5054 / #d4d6d9) | igual |
| Ayuda (`_helper text`: archive size, error, custom) | `Type/Caption/XS` `text/secondary` (#585a5e / #c6c8cc) (también en "error") | igual |
| Disabled | textos `text/disabled` (#babcbf / #616469), barra sin relleno, cerrar en disabled | igual |

---

## 11. Header y Avatar

### 11.1 Header

El archivo Header (página "Header") tiene un solo componente: un encabezado de página tipo tarjeta, no una barra de aplicación con logo.

| Parte | Especificación |
|---|---|
| Contenedor | alto 64, horizontal, p 8/16, radio 12 (`radius/surface/card`), fondo `bg/surface/default` (#ffffff / #27292b), sombra `shadows/shadow-3`, sin borde |
| Título | ícono duotono 24 (`icon/brand/default` (#627dd0 / #b8c5ee) + `icon/all-colors/blue`) + título `Type/Heading/H3` `text/primary` (#313336 / #f0f1f2) + subtítulo `Type/Body/XS/Regular` `text/brand/default` (#2d49a1 / #e3e9fc) |
| Centro | Switch MD (§12.4) |
| Acciones | g8: Icon buttons secondary 32, Button secondary, Button primary (xs), Badge |
| Usuario | g8: Avatar 32 (icon) + nombre `Type/Body/XS/Bold` `text/primary` (#313336 / #f0f1f2) + rol `Type/Body/XS/Regular` `text/tertiary` (#6c6e73 / #9fa2a6) |

### 11.2 Avatar

Sets: `Avatar` → `Type`: icon, letter, photo · `_base` (uno por tipo) → `🔽 Show Status` bool · `📏 Size`: XXS, XS, SM, MD, LG, XL = XL · `💊 pill?`: false, true = true · `_style` → `🎭 Theme`: Soft, Solid · `🎨 Color`: Blue, Red, Orange, Yelow, Lime, Green, Cyan, Azure, Violet, Magenta, Rose, Disabled · `🔳 Stroke`: false, true · `🚫 Dissabled?`: false, true.

| Size | Caja | Letra (type=letter) | Glifo `user` (type=icon) |
|---|---|---|---|
| XXS | 16 | `Type/Body/XS/Regular` | 10 |
| XS | 24 | `Type/Body/XS/Regular` | 16 |
| SM | 32 | `Type/Body/SM/Regular` | 20 |
| MD | 40 | `Type/Body/MD/Regular` | 24 |
| LG | 48 | `Type/Body/LG/Regular` | 32 |
| XL | 64 | `Type/Heading/H2` | 32 |

| Theme | Fondo | Letra / ícono | Stroke = true |
|---|---|---|---|
| Solid | `bg/fill/all-colors/{color}` (Blue: #3658c1 / #3251b1) | `text/text-on-color` (#ffffff / #ffffff) / `icon/on-color` (#ffffff / #ffffff) | 1 px INSIDE `border/default` (#c6c8cc / #4d5054) |
| Soft | `bg/surface/all-colors/{color}` (Blue: #e3e9fc / #243a80) | `text/all-colors/{color}` / `icon/all-colors/{color}` | 1 px INSIDE `border/all-colors/{color}` |

Radio: `pill?` = true → 9999; false → 8 (leído en XS). Por defecto el avatar de muestra es Blue Solid.

Punto de estado (`_avatar status`): `🎭 Type`: Icon, Color · `🎨 Color`: Brand, Danger, Disabled, Success, Warning, White · `📏 Size`: lg 16, md 12, sm 8. Aro `border/on-color` (#ffffff / #ffffff) OUTSIDE (2 px en lg y md, 1 px en sm). Relleno: Brand `bg/fill/brand/default` (#3658c1 / #3251b1) · Success `bg/fill/success/default` (#22c55e / #1fb456) · Warning `bg/fill/warning/default` (#eab308 / #d09f07) · Disabled `text/disabled` (#babcbf / #616469).

`Avatar stack`: `📏 Size`: xl, lg, md, sm, xs, xxs (anchos 224, 168, 140, 112, 84, 56 para 4 avatares).

---

## 12. Forms y Switch

### 12.1 Input de texto (página "Input Text")

Sets: `Input` → `🚦State`: Default, Value, Typing, Disabled, Error · `_Base` → `👁️Show info` · `🅰️Text label` = "Label" · `👁️Show label` · `🅰️Text helper` = "Help Text" · `👁️Show text helper` · `📏 Size`: xs, sm, md, lg = xs · `⚪Pill?`: na, 6px, 8px, 10px, Full = na.

Anatomía: vertical g4 > fila de label (g8: label `Type/Label/MD/Semibold` + ícono `info-circle` 10) > campo `base` (horizontal g8, borde 1 px INSIDE) > `_content` (ícono izq. 16 en caja 20 p2 · texto `Type/Body/SM/Regular` · ícono der. 16) > ayuda `Type/Body/XS/Regular`.

| Size | Alto del campo | Padding V / H |
|---|---|---|
| xs | 32 | 4 / 8 |
| sm | 36 | 4 / 8 |
| md | 40 | 8 / 8 |
| lg | 48 | 8 / 8 |

| Pill? | Radio |
|---|---|
| na (default) | 0 |
| 6px | 6 |
| 8px | 8 (`radius/control/sm`) |
| 10px | 10 |
| Full | 9999 |

| State | Fondo | Borde | Texto | Íconos | Label | Ayuda |
|---|---|---|---|---|---|---|
| Default (placeholder) | `bg/fill/default` (#ffffff / #27292b) | `border/default` (#c6c8cc / #4d5054) | `text/tertiary` (#6c6e73 / #9fa2a6) | `icon/tertiary/default` (#919499 / #85888c) | `text/primary` (#313336 / #f0f1f2) | `text/tertiary` (#6c6e73 / #9fa2a6) |
| Value | `bg/fill/default` (#ffffff / #27292b) | `border/default` (#c6c8cc / #4d5054) | `text/primary` (#313336 / #f0f1f2) | `icon/default` (#4d5054 / #d4d6d9) | `text/primary` (#313336 / #f0f1f2) | `text/tertiary` (#6c6e73 / #9fa2a6) |
| Typing (foco) | `bg/fill/default` (#ffffff / #27292b) | `border/brand` (#3658c1 / #627dd0) | `text/primary` (#313336 / #f0f1f2) + cursor 1 px `border/brand` (#3658c1 / #627dd0) | `icon/selected` (#3251b1 / #627dd0) | `text/primary` (#313336 / #f0f1f2) | `text/tertiary` (#6c6e73 / #9fa2a6) |
| Disabled | `bg/fill/disabled` (#f7f8fa / #313336) | `border/disabled` (#d4d6d9 / #44464a) | `text/disabled` (#babcbf / #616469) | `icon/disabled` (#babcbf / #616469) | `text/primary` (#313336 / #f0f1f2) | `text/tertiary` (#6c6e73 / #9fa2a6) |
| Error | `bg/surface/danger/default` (#fef1f1 / #802424) | `border/danger` (#ef4444 / #f36c6c) | `text/danger/default` (#b83434 / #fce3e3) | `icon/danger/default` (#b83434 / #f9bcbc) | `text/danger/default` (#b83434 / #fce3e3) (ícono info igual) | `text/danger/default` (#b83434 / #fce3e3) |

Sin estado hover. Mensaje de error = el texto de ayuda en `text/danger/default` (#b83434 / #fce3e3).

### 12.2 Contraseña

No existe componente de contraseña en Forms (búsqueda en la librería sin resultados). El Input admite ícono derecho; la forma de mostrar u ocultar la contraseña queda por decidir.

### 12.3 Checkbox (página "Checkbox")

Sets: `Checkbox` → `🚦Status`: Default, Hover, Focus, Disabled, Error · `◻️ Default`: False, True (True = sin marcar) · `☑️ Checked`: False, True · `➖ Indeterminado`: False, True. `_base` → `👁️Show Text Helper` · `🅰️Text Helper` = "Supporting text" · `🅰️Text Label` = "Label" · `👁️Show Label` · `⚪Pill?`: false, true. `_content` → `◻️ Box`: Checkbox, Indeterminado, WrapCheckbox · `❇️ Focus?` · `⚪ Pill?`.

| Parte | Especificación |
|---|---|
| Disposición | horizontal g8: caja + columna (g4) |
| Caja | 16 × 16, radio 2 (`radius/surface/forms`) en el set público |
| Label | `Type/Label/MD/Bold` `text/primary` (#313336 / #f0f1f2) |
| Ayuda | `Type/Body/XS/Regular` `text/tertiary` (#6c6e73 / #9fa2a6) |
| Marca | check 10 × 8 o barra 9 × 2 (indeterminado), `icon/on-color` (#ffffff / #ffffff) |

| Status | Sin marcar: fondo / borde | Marcado o indeterminado: fondo |
|---|---|---|
| Default | `bg/fill/default` (#ffffff / #27292b) / `border/default` (#c6c8cc / #4d5054) | `bg/fill/brand/default` (#3658c1 / #3251b1) |
| Hover | `bg/fill/default` (#ffffff / #27292b) / `border/hover` (#85888c / #9fa2a6) | `bg/fill/brand/hover` (#3251b1 / #3658c1) |
| Focus | igual que Default + anillo 1 px OUTSIDE `border/focus` (#627dd0 / #627dd0) | igual + anillo |
| Disabled | `bg/surface/disabled` (#f7f8fa / #313336) / `border/disabled` (#d4d6d9 / #44464a); textos `text/disabled` (#babcbf / #616469) | `bg/fill/brand/disabled` (#b8c5ee / #243a80); textos `text/disabled` (#babcbf / #616469) |
| Error | `bg/fill/default` (#ffffff / #27292b) / `border/danger` (#ef4444 / #f36c6c) | no verificado |

### 12.4 Switch (control segmentado)

En Órbita, `Switch` es un control segmentado (archivo Switch). Propiedades: `Middle button` bool · `📏Size`: SM, MD · `Stage`: Default, Disabled, Loading.

| Size | Contenedor | Ítems |
|---|---|---|
| SM | alto 32, p6, g8, radio 10 (`radius/control/lg`), fondo `bg/fill/tertiary/default` (#f0f1f2 / #3a3c40) | Button color=Switch, size xxs (20, p 4/8), radio 6 |
| MD | alto 48, p8, g8, radio 10, fondo `bg/fill/tertiary/default` (#f0f1f2 / #3a3c40) | Button color=Switch, size xs (32, p 4/12), radio 6 |

Ítem activo = state selected (`bg/surface/default` (#ffffff / #27292b), `text/primary` (#313336 / #f0f1f2)); resto = default (transparente, `text/secondary` (#585a5e / #c6c8cc)). Colores completos: tabla "Switch" de §1.3. Stage Disabled: contenedor `bg/fill/disabled` (#f7f8fa / #313336), ítems `bg/fill/tertiary/default` (#f0f1f2 / #3a3c40). Stage Loading: ítems `bg/fill/tertiary/default` (#f0f1f2 / #3a3c40) con `loader`.

### 12.5 Toogle (interruptor encendido/apagado)

Archivo Button, página "Toggle ". Set `Toogle`: `Focus?` bool · `👁️Show Icon Left` bool · `Text Left` text · `Active?`: True, false · `Stroke?`: True, False · `Disabled?`: False, true · `Label?`: None, Left, Right.

| Parte | Especificación |
|---|---|
| Pista | 32 × 20, radio 16, p 0/2 |
| Perilla | 16 × 16, círculo, `bg/fill/default` (#ffffff / #27292b); a la izquierda si inactivo, a la derecha si activo |
| Label | `Type/Body/SM/Bold` `text/primary` (#313336 / #f0f1f2) (disabled `text/disabled` (#babcbf / #616469)), g8 |
| Stroke? = True | 1 px OUTSIDE `border/default` (#c6c8cc / #4d5054) en la pista |

| Estado | Pista |
|---|---|
| Activo | `bg/fill/brand/default` (#3658c1 / #3251b1) |
| Inactivo | `bg/fill/brand/disabled` (#b8c5ee / #243a80) |
| Disabled (activo o no) | `bg/fill/hover` (#f0f1f2 / #3a3c40) |

Sin estado hover.

---

## 13. Accordion

Set `Accordion`: `Show description` bool · `_content` (SLOT) · `title` text = "Titulo" · `description` text = "Descripción" · `🚦State`: open, close, empty.

| Parte | Especificación |
|---|---|
| Contenedor | ancho 430, vertical, p12, g12, radio 12 (`radius/surface/card`), fondo `bg/surface/default` (#ffffff / #27292b), borde 1 px INSIDE `border/default` (#c6c8cc / #4d5054), sombra `Shadows/Shadow 1` (estilo remoto: 0 1 2 0 #0000000d) |
| Encabezado | fila: columna (título `Type/Label/MD/Bold` `text/primary` (#313336 / #f0f1f2) + descripción `Type/Body/XS/Regular` `text/secondary` (#585a5e / #c6c8cc)) + Icon button tertiary 32 (`chevron-up` abierto, `chevron-down` cerrado, glifo 16) |
| Contenido | slot vertical, ancho 406 |
| close | alto 63 (solo encabezado) |
| empty | fondo `bg/surface/disabled` (#f7f8fa / #313336), borde `border/disabled` (#d4d6d9 / #44464a), textos `text/disabled` (#babcbf / #616469) |

---

## 14. Lightbox y Pictures

### 14.1 Picture

Set `Picture`: `⛱️ Shadow` bool · `🔳 Stroke` bool · `📐 Aspect Ratio`: 1:1, 16:9 · `⭕ Radius`: none, sm, md, pill.

| Parte | Especificación |
|---|---|
| Tamaño de muestra | 1:1 = 200 × 200; 16:9 = 354 × 200 |
| Capas | `shadow` (fondo `bg/fill/tertiary/default` (#f0f1f2 / #3a3c40) + `shadows/shadow-3`) > `mask` (`bg/fill/default` (#ffffff / #27292b)) > imagen > `stroke` (1 px INSIDE `border/default` (#c6c8cc / #4d5054)) |
| Radius | none 0 · sm 8 (`radius/image/sm`) · md 16 (`radius/image/md`) · pill 9999 (`radius/image/pill`) |
| Sin imagen (`_base` Image? = false) | fondo `bg/fill/tertiary/default` (#f0f1f2 / #3a3c40) + glifo duotono `image` 32 `icon/disabled` (#babcbf / #616469) |

### 14.2 Lightbox

Set `Lightbox`: `Dots Navigation` bool · `Controls` bool · `Property 1`: 16/9, 1/1 · `Compact?`: false, true · `Size`: SM, MD, LG.

| Size (16/9) | Total | Imagen |
|---|---|---|
| SM | 656 × 336 | 510 × 288 |
| MD | 1040 × 552 | 893 × 504 |
| LG | 1296 × 696 | 1148 × 648 |

| Parte | Especificación |
|---|---|
| Disposición | vertical g32: fila (g24: flecha izq. + Picture radius none + flecha der.) + puntos |
| Flechas | Icon button secondary lg 48 (`chevron-left` / `chevron-right`), sombra `Shadows/Shadow 3` (remota: 0 4 5 −1 #0000001a + 0 2 4 −2 #0000001a) |
| Cerrar | Icon button secondary 32 dentro de la imagen, arriba a la derecha (18 px arriba, 15 px derecha en SM) |
| Puntos (`_Dots navigation`) | 16 × 16, g5; seleccionado `Blue/blue-500` #3658c1; resto `Solids/White` #ffffff; borde 1 px INSIDE `Neutral/neutral-100` #d1d1d1. Variables de una colección antigua (`Colors`) sin modo Dark |
| Compact? = true | 512 de ancho; flechas sobre la imagen |
| Fondo de pantalla | no forma parte del componente |

---

## 15. Spinner / Loader

Sets: `Spiner` (`Property 1`: 0, Variant3) · `_loader-spinner` (`Property 1`: 1, 2, 3, 4 = cuadros de animación) · `_logo` (`Property 1`: 0, 1, 2, 3) · variantes `OBP4MO`.

| Parte | Especificación |
|---|---|
| Tamaño | 96 × 96 (único) |
| Pista | anillo completo, radio interior 0.83 (grosor ≈ 8 px), `bg/surface/brand/default` (#f1f4fe / #243a80) |
| Arco | 90°, `icon/brand/default` (#627dd0 / #b8c5ee), extremos redondeados (puntos de 8 px) |
| Centro | logo OBP 69 × 69; sus cuadros 0–3 encienden piezas del logo (#3d59a5, #ffffff, #ffe907; OBP4MO usa #252525) |
| Spinner pequeño | no existe; Button e Icon button usan el glifo FA `loader` (16) en estado loading |

---

## 16. Divider, Tooltip, Popover, Pagination y Filtros

### 16.1 Divider

Sets: `Divider Horizontal` y `Divider Vertical` (`🅰️ Text?`: False, True) · `_Base H` / `_Base V` (`🎨 Dasher`: True, False = punteada) · `_Text Divider H/V` (`🅰️Text`, `📏Size`: LG, MD, SM, XS).

| Parte | Especificación |
|---|---|
| Línea | 1 px `border/default` (#c6c8cc / #4d5054), dentro de un marco con p4 (caja de 8) |
| Con texto | fila g8: línea + texto `text/tertiary` (#6c6e73 / #9fa2a6) + línea |
| Texto por Size | LG `Type/Body/LG/Regular` · MD `Type/Body/MD/Regular` · SM `Type/Body/SM/Regular` · XS `Type/Body/XS/Regular` |

### 16.2 Tooltip

Set `Tooltip`: `Label` text · `Direction`: Bottom, Top, Side · `Alignment`: Left, Right, Center.

| Parte | Especificación |
|---|---|
| Caja | alto 24, p 4/8, radio 8 (`radius/control/sm`), fondo `text/primary` (#313336 / #f0f1f2), sombra `shadows/shadow-1` |
| Texto | `Type/Body/XS/Bold` `text/on-canvas-inverse` (#ffffff / #313336) |
| Flecha | 10 × 7, mismo color que la caja |

### 16.3 Popover

Sets: `Popover` (`Type`: Default, Info, CTA, MInimal, Warning, Steps) sobre `_Popover-base` (`Position`: 12 posiciones `Left/Right/Top/Button - Top/Center/Button/Left/Right`; booleanos `Show Header`, `Show Footer`, `Show Icon`, `Show Description`, `Show Badge`, `Show close button`, `Show Slot 1/2`, `Show Secondary Button`, `Show Primary Button`; slots de imagen y contenido).

| Parte | Especificación |
|---|---|
| Contenedor | ancho 320, radio 12 (`radius/surface/card`), fondo `bg/surface/default` (#ffffff / #27292b), borde 1 px INSIDE `border/default` (#c6c8cc / #4d5054), sombra `shadows/shadow-3` |
| Flecha (`indicador`) | 13 × 19, borde `border/default` (#c6c8cc / #4d5054) y relleno `bg/surface/default` (#ffffff / #27292b) |
| Header | alto 48, p8, g8, borde inferior 1 px `border/default` (#c6c8cc / #4d5054): círculo 32 (`bg/surface/all-colors/blue`, ícono 16 `icon/all-colors/blue`) + título `Type/Heading/H6` `text/primary` (#313336 / #f0f1f2) + descripción `Type/Body/XS/Regular` `text/tertiary` (#6c6e73 / #9fa2a6); a la derecha Badge + Icon button secondary 32 (`xmark`) |
| Contenido | vertical, p8, g8 (slots) |
| Footer | alto 48, p8, borde superior 1 px `border/default` (#c6c8cc / #4d5054): Button secondary + Button primary, g8, a todo el ancho |
| Type Warning | fondo `bg/surface/warning/default` (#fefbf1 / #806204), borde `border/warning` (#eab308 / #efc43f) |

### 16.4 Pagination

Componente `Pagination` (sin variantes).

| Parte | Especificación |
|---|---|
| Contenedor | vertical, p 4/0, g4 |
| Barra de scroll | 6 de alto, pill, pista `bg/fill/hover` (#f0f1f2 / #3a3c40), indicador `bg/fill/brand/default` (#3658c1 / #3251b1) |
| Fila | g32: texto + botones + selector |
| Texto | "Mostrando página 1 de 200" `Type/Body/XS/Bold` `text/tertiary` (#6c6e73 / #9fa2a6) |
| Botones | g4: Icon button secondary 32, pill (radio 9999): `chevron-left`, `chevrons-left`, números, `chevrons-right`, `chevron-right`; glifo y número 16 `icon/default` (#4d5054 / #d4d6d9) |
| Página actual | Icon button state selected: `bg/fill/secondary/selected` (#d4d6d9 / #4d5054) + borde `border/default` (#c6c8cc / #4d5054) |
| Filas por página | Autocomplete xs (53 × 32, radio 8) |

### 16.5 Filtros (lo esencial)

Set `Filtros avanzados` (`Stage`: Empty, And, Or, Options, Populado) y `_Columna` (`Stage`: Hover, Default).

| Parte | Especificación |
|---|---|
| Panel | ancho 500, radio 16, fondo `bg/fill/default` (#ffffff / #27292b), borde `border/default` (#c6c8cc / #4d5054); usa `_Header` y `_Footer` del Modal (64 cada uno) |
| Header | ícono de filtro + título "Filtros Avanzados" |
| Formulario | p16, g8: "Agregar filtro" + Autocomplete + Icon button "+" |
| Filtro agregado (`_Columna`) | tarjeta con fondo de marca suave y borde de marca: nombre del campo, Autocomplete "Selecciona una opción…", Input "Valor", cerrar |
| Vacío | p 32/16 |
| Footer | Icon button (limpiar) + Button secondary "Cancelar" + Button primary "Aplicar Filtros" |

---

## 17. Logo e Icon

### 17.1 Logo (versión OBP)

Sets: `OBP_logo` → `type logo`: OBP, Media Owners · `size`: 8, 10, 12, 14, 16, 18, 20, 24, 32, 40, 48 · `security area`: false, true. `_obp` → `teme`: light, dark · `style`: icon, compact, full.

| style | Caja (base 24) | Contenido |
|---|---|---|
| icon | 24 × 24 | marca circular |
| compact | 24 × 29 | marca + elemento inferior |
| full | 24 × 31 | marca + texto (en `text/primary` (#313336 / #f0f1f2)) |

Colores fijos (hex, sin variables): azul #3d59a5, blanco #ffffff, amarillo #ffe907, gris #d1d1d1, negro #010101. Con `security area` = true el componente agrega el margen de protección (ej. size 32 → 93 × 99). Para el prototipo exportar SVG desde Figma: archivo Logo, set `OBP_logo` (nodo 1:214) o `_obp` (nodo 1:8).

### 17.2 Icon

| Tema | Valor |
|---|---|
| Librería | **Font Awesome 7 Pro** (Light, Regular, Solid), **Font Awesome 7 Duotone** (Solid) y **Font Awesome 7 Brands**. Fuente única según la guía de Fundations |
| Componente | `Icon Font`: `😬 icon-name` (texto; tres capas para duotono: `shapes`, `shapes#`, `shapes##`) · `📏 Size`: 32, 24, 20, 16, 10 · `🔲 Padding?`: 0px, 2px, 4px, 8px, 12px, 16px · `⚪ Type`: Duotono, Light, Regular, Solid, brand |
| Tamaños (token) | `size/icon/xs` 10 · `sm` 16 · `md` 20 · `lg` 24 · `xl` 32. No usar `fa-sm` (≈14) |
| Equivalencias FA | 20 = `fa-lg`, 24 = `fa-xl`, 32 = `fa-2xl`; 16 con `font-size: 16px` |
| Color | siempre `color/icon/*`, no tokens de texto; si acompaña texto de estado, mismo rol (ej. `text/danger/default` con `icon/danger/default`) |
| Estilo por defecto en componentes | Regular (botones, inputs, tablas); Solid en algunos avisos; Duotono en estados vacíos |
| Reglas | no mezclar estilos de FA en un mismo componente; ícono de solo acción con `aria-label` y tooltip; ícono decorativo sin color de estado |

Guía rápida de tamaño (Fundations): botón o input sm/md → 16; control lg o junto a H3–H4 → 20; junto a Caption → 10; estado vacío → 32.

---

## No verificado

- Tabs: estados hover, pressed y disabled de la pestaña se toman de `Button` color=Tap; no se leyeron dentro del set `Tap `.
- Tag: colores de los estados hover, pressed y selected en success, warning, danger e info (solo se leyeron gray y accent); color de `border?` fuera de gray.
- Badge: `state` = disabled solo existe para info; no hay variante disabled de los otros colores.
- Cards: `Card Proveedor` y `Card Catalogo` (sin detalle); hijos del estado Disabled de la tarjeta de medio; colores de `_Estatus medio`.
- Table: `_Column Lock - Header Cell`; colores del degradado Skeleton; contenido exacto de Key Column; estilos internos del input de búsqueda del Tool Bar.
- Modal: el fondo de pantalla no está en el componente; `bg/overlay/default` (#00000066 / #00000099) es el token disponible por nombre, no por uso.
- Alerts: tema Solid en Warning y Danger; color del ícono de cada Stage.
- Notification: diferencias entre `tipo` general, usuario y sistema; set antiguo `_Notification`.
- Breadcrumbs: color del chevron.
- Header: tamaño de la caja del ícono del título; página "Header Modulos" no revisada.
- Avatar: radio con `pill?` = false fuera de XS; solapamiento del stack; colores Danger y White del punto de estado.
- Input: estilo de texto en sizes sm, md y lg (solo se leyó xs).
- Checkbox: qué valor de `⚪ Pill?` da radio 2 y cuál 0; Error marcado.
- Toogle: posición exacta del anillo de foco (capa de 20 × 20 desplazada −2).
- Lightbox: tamaños 1/1 y posiciones en Compact.
- Spinner: duración y curva de animación (Figma solo tiene cuadros).
- Logo: diferencias entre `teme` light y dark (los rellenos leídos son iguales).
- Popover: colores de los tipos Info, CTA, MInimal y Steps.
- Filtros: colores exactos de `_Columna`.
- Toast: en Warning md/sm la barra está configurada `color=brand`; solo se leyó el relleno en lg.
- Licencia de Font Awesome 7 Pro para web (kit o archivos): no está en Figma.

## Diferencias con docs/PLAN_UX.md

1. **Sombra del modal:** Figma usa `shadows/shadow-3` en Modal Template. PLAN_UX dice `shadow-5` para modales. `shadow-5` solo aparece en Toast y Notification.
2. **Radio del tooltip:** el componente usa 8 (`radius/control/sm`). PLAN_UX dice 6. El token `radius/surface/tooltip` = 6 existe pero el componente no lo usa.
3. **Radio del popover:** el componente usa 12 (`radius/surface/card`). PLAN_UX dice 8. `radius/surface/popover` = 8 existe pero no se usa.
4. **Radio por defecto de Button e Input:** `pill?` = none y `Pill?` = na dan radio 0. PLAN_UX dice 8 para controles y campos. Para obtener 8 hay que elegir `pill?` = sm / `Pill?` = 8px. `radius/surface/forms` = 2 solo aparece en la caja del Checkbox.
5. **Botón destructive:** es suave (fondo #fef1f1, texto #b83434), no rojo sólido.
6. **Estados del Stepper:** Figma tiene default (pendiente), Active (en curso) y Check (completado). PLAN_UX pide también error, y el prototipo necesita bloqueado: ninguno existe.
7. **Switch:** en Órbita es un control segmentado. El interruptor encendido/apagado se llama `Toogle` y vive en el archivo Button.
8. **Texto de estado en color:** Badge, Tag y Alerts (soft) usan `text/success/default`, `text/warning/default` y `text/info/default` como color de texto. PLAN_UX pide que el texto de estado sobre claro sea solo `text/primary` o `text/danger`.
9. **Tarjetas:** la tarjeta de medio coincide (sin sombra, borde `border/subtle`), pero en hover suma `shadow-3`, fondo `bg/surface/brand/hover` y borde `border/default`. La tarjeta KPI usa `border/default`, no `border/subtle`.
10. **Tamaños de control:** existe `xxs` = 20. El modo Compact reduce xxs a 16, xs a 28, sm a 32, md a 36 y lg a 40. PLAN_UX no lo menciona.
11. **Altura de fila:** Cell mide 56 y Header Cell 48. Los tokens `size/row/regular` (40) y `size/row/compact` (32) no se usan en Cell.
12. **Sombras en Dark:** las sombras cambian de color en OBP Dark (shadow-1 #00000066; 2 y 3 #00000080; 4 y 5 #00000099).
13. **Tipografía:** no hay Body XL; Label solo existe en MD. El tracking va en px (tight +0.5, wide +2), no en %. Captions: MD 12/17.5 y XS 10/14.5, con +2 px.
14. **Alerta informativa:** usa la superficie de marca (azul `bg/surface/brand/default`), no la de info (cian).
15. **Header:** el componente Header es un encabezado de página (título, acciones, usuario) tipo tarjeta con radio 12 y `shadow-3`. No es una barra superior con logo; esa barra no existe como componente.
16. **Íconos:** Font Awesome 7 Pro. PLAN_UX no define librería.
17. **Estilos fuera de Fundations:** Accordion usa `Shadows/Shadow 1` (#0000000d) y Lightbox usa `Shadows/Shadow 3` y colores antiguos (`Blue/blue-500`, `Neutral/neutral-100` #d1d1d1) sin modo Dark.
18. **Foco:** anillo de 2 px `border/focus` (#627dd0) a 2 px en botones, tarjetas y toggle; 1 px en checkbox; el Input no tiene anillo (usa borde `border/brand`). PLAN_UX no lo define.
19. **z-index:** PLAN_UX lo dejó pendiente; Figma tiene capas semánticas (§0.8).
20. **Avatar:** tamaños 16, 24, 32, 40, 48 y 64. PLAN_UX y el catálogo solo mencionan 32 y 40.
