# Página de inscripción al evento de lanzamiento de CAEIA

Prototipo de **una sola página** adonde llevan todos los canales (reels, TikToks, anuncios, flyers, la difusión de la Cámara de Comercio) y donde la gente **se inscribe**. Axel va a cambiar el copy sobre la marcha.

- **Evento:** seminario gratuito de IA para negocios + lanzamiento de CAEIA. Miércoles **18 de noviembre de 2026**, Cámara de Comercio e Industria de Salta (salón de 100 personas). Solo presencial. Entrada gratis con inscripción previa.
- **Dirección:** España 339, Salta Capital (Cámara de Comercio e Industria de Salta). Va en la sección "Dónde es" con mapa y cómo llegar.
- **Horario (confirmado por Axel, 2026-11-03):** empieza a las **19:00**; **90 minutos de seminario** (hasta 20:30) + 30 min de networking, hasta las **21:00**. En la página se comunica «90 min» para el seminario y el networking se muestra aparte, sin esconderlo. Es una variable editable (`content.event.startTime`).
- **Se filma** (material para la landing e Instagram). **Decisión de Axel (2026-11-06): la página, el formulario y las políticas ya NO lo mencionan.** Riesgo explicado a Axel: el Código Civil y Comercial (art. 53) y la Ley 11.723 (art. 31) piden consentimiento para captar y publicar la imagen de una persona, salvo eventos públicos de interés; se recomendó un cartel en la puerta del salón y un aviso al abrir el evento.
- **Meta:** 180 a 200 inscriptos para 100 sillas. No cerrar la inscripción antes del evento ni mostrar "cupos agotados" salvo que Axel lo decida.
- Hoy el repo es un proyecto nuevo, sin despliegue. **No desplegar, mandar mensajes ni escribir datos reales hasta que Axel lo pida.**

## Quién es Axel
Axel López, 25 años, Salta Capital. Desarrollador y consultor de IA (marca **NIKI Software**). Hablarle en **voseo argentino**, directo y sin rodeos. Él **decide**: lo marcado como propuesta no está aprobado hasta que lo confirme. Preguntar de a pocas cosas y esperar respuesta.

## Qué es CAEIA
SaaS de facturación electrónica con IA (caeia.app, app en mi.caeia.app): factura A/B/C contra ARCA desde la web o por un agente de WhatsApp. Mercado: NOA, base en Salta. Diferencial: **nunca pide la clave fiscal** (usa la delegación oficial de ARCA). La página **no muestra precios**.

Estado (cerebro, 2026-10-09): todo funciona en homologación; falta certificado de producción de ARCA, no hay clientes reales y el cobro con Mercado Pago está bloqueado. **Verificar con Axel el estado actual antes de afirmar nada.**

## Idea de fondo: tres escalones (hoy ya no es una sección de la página; sigue guiando el tono y el subtítulo del hero)
1. **Usarla** (dudas, flyers): donde está casi todo el mundo.
2. **Crearla** (mini apps para un sector del negocio): la IA "bajó la vara".
3. **Contratar a un experto** (software serio, IA en los procesos): entra NIKI Software. CAEIA es el ejemplo de este escalón.

**No se entra vendiendo.** Primero el tema (IA para el negocio); CAEIA aparece al final. Nada de venta antes del cierre del copy.

## Público (en este orden)
1. Dueños de negocios con local físico que emiten facturas (carnicerías, ropa, repuesteras) y Responsables Inscriptos.
2. Monotributistas emprendedores de servicios (capacitación, digital, e-commerce, programadores).
3. Contadores (no son el cliente principal, pero se espera verlos; plan futuro "próximamente", sin precio ni fecha).

## Copy: un solo archivo
Todo el texto vive en **un único archivo editable** (`src/content.ts`). Los componentes no llevan texto propio. Ahí van también las variables que pueden cambiar: fecha, horario, lugar, titular, subtítulo, FAQ, agenda.

- **Titular elegido por Axel:** «IA para comercios y emprendedores del NOA»
- Subtítulo (elegido por Axel, 2026-11-06): «Creá herramientas para tu negocio con IA»
- Línea de fecha: «Seminario gratuito · Miércoles 18 de noviembre · Cámara de Comercio de Salta»
- El copy principal es borrador de Axel. Dudas abiertas: si "Nadie te lo mostró. No es culpa tuya" suena a alivio o a reproche; si el texto nombra a NIKI y a Axel; y "Facturar tan simple como mandar un WhatsApp" solo se puede afirmar si el agente funciona en producción el 18/11.

## Reglas de contenido (la página NO puede...)
- Decir "el facturador con IA más grande del NOA". Alternativa válida: "hecho en Salta, para el NOA".
- Decir "aprobado", "homologado" o "certificado por ARCA". Homologación es el ambiente de pruebas de ARCA.
- Mostrar o prometer nada que no esté en producción ese día.
- Prometer "no se graba" (el evento se filma). El aviso de filmación se sacó de la página a pedido de Axel (2026-11-06); ver el riesgo arriba.
- Pedir más datos que los necesarios. Decir para qué se usan y pedir **consentimiento explícito** (Ley 25.326; verificar el texto con la contadora o un abogado). Para escribirles por WhatsApp hace falta consentimiento previo.
- Usar la base de clientes de Tevez Repuestos sin hablarlo antes con el jefe de Axel.
- Mostrar material o el logo de la Fundación FIEL sin que la Fundación lo sepa (relación pausada según el cerebro). Axel decidió el 2026-11-03 mostrarla como co-organizadora y el 2026-11-06 confirmó que la Fundación acepta figurar y usar su logo.
- **Poner claves de API en el código del navegador.** Nunca (en dos repos de demo la clave de Gemini quedó expuesta).

## Marca
Seguir el brand book vigente de CAEIA (`WIKI/caeia-brief-marca.md` en el segundo cerebro):
- Wordmark **"CAE" en azul `#0ea5e9` + "IA" en violeta `#8b5cf6`** (split de color, nunca degradé), fondo oscuro `#0a0e1a`.
- Marketing: sans bold geométrica. La app usa Space Grotesk para display.
- **Estilo de la página (decisión de Axel, 2026-11-02):** vidrio (glassmorphism) con look de IA/tecnología, potente e impactante, igual que la app de CAEIA: superficies translúcidas con blur, bordes luminosos azul/violeta, fondo oscuro con manchas de luz que "respiran", (el piso con cuadrícula en perspectiva y los paneles de vidrio flotantes del hero se sacaron por pedido de Axel, 2026-11-03: no le gustaban; no volver a ponerlos). Referencia: una captura de Pinterest (estilo, no el color verde). **Esto levanta el "no glow" del brand book solo para esta página**; el wordmark sigue en split azul/violeta sin degradé.
- **Imagen principal del evento (decisión de Axel, 2026-11-03):** la imagen de Axel chocando el puño con un robot, con resplandor violeta (la misma de las publicidades). Es la imagen del hero: en celular ocupa todo el ancho arriba y el título se apoya sobre su parte oscura; en pantallas de 900 px o más va a la derecha del texto, con los bordes difuminados. Archivos: `public/evento-780.jpg` y `public/evento-1100.jpg` (versiones livianas del original de 1856×2304 px que está fuera del repo, en el chat de Axel); configurada en `content.hero.visual`. **Es la única excepción a «sin robots»**: sigue prohibido agregar otros robots, mascotas o ilustraciones de IA. Pendiente: usarla como imagen para compartir en redes (`og:image` necesita la dirección final de la página).
- **Sigue descartado:** sparkles de 4 puntas, circuitos PCB, símbolo $, otros robots/mascotas, cerebros, fotos de stock, estética cyberpunk/gamer, logos o cifras inventadas.
- NIKI Software (rojo, logo metálico) es otra marca: aparece solo en la sección "quién lo da", con su logo, sin mezclar su estilo.
- Logos oficiales en `caeia/src/assets/logos/` (repo hermano), incluido `niki-logo.webp`.

## Estructura (aprobada por Axel, 2026-11-02)
1. **Hero:** titular, subtítulo, fecha, hora, lugar, "Gratis · cupo limitado", botón "Quiero mi lugar" (lleva al formulario de abajo) y, a la derecha en escritorio (arriba en celular), la imagen principal del evento. **El hero no tiene formulario: hay UN SOLO formulario en toda la página, el de la sección 10 (decisión de Axel, 2026-11-03).** Todos los botones («Quiero mi lugar» del cronómetro, del hero, de los escalones, del cierre y el fijo de celular) llevan a `#inscripcion`. No volver a agregar un segundo formulario.
2. **Para quién es** (agregada 2026-11-06, fondo claro): «¿Tenés un negocio? Este seminario es para vos», con etiquetas de quién sos y de qué rubro; hace que todos los anuncios (comerciantes, emprendedoras, general) aterricen en la misma página (`content.forYou`). 3. El problema (se sacó «Nadie te lo mostró. No es culpa tuya», decisión de Axel 2026-11-06). 4. **Qué vas a ver** (fusiona las antiguas «Qué vas a ver» y «Los tres escalones», decisión de Axel 2026-11-06; fondo claro; botón repetido al final): 3 clases de IA con ejemplos que Axel ya tiene funcionando: **automatización** (app que filtra listas de precios de repuestos y app de certificados masivos), **agente de IA** (el agente de voz de Bella Studio) y **app de IA** (CAEIA, el cierre y lanzamiento oficial de la noche, tarjeta destacada). Todo en `content.whatYouSee`. Ojo: Bella Studio figura como demo, así que la página no dice «negocios reales»; la app de listas es de Tevez Repuestos (no se nombra hasta hablarlo con el jefe de Axel) y la de certificados es de FIEL (no se nombra hasta confirmar). 5. Agenda.
6. **Quiénes lo organizan** (decisión de Axel, 2026-11-03): **NIKI Software y Fundación FIEL**, con los dos logos. La barra «Organizan NIKI + FIEL» va arriba de todo (reemplazó al wordmark de CAEIA en el menú, para no entrar vendiendo) y en el pie; la sección 6 son dos tarjetas: «Axel López · NIKI Software y Apps de I.A» y «Fundación FIEL» (capacitación laboral en Salta y Jujuy, según su sitio). Prueba real, nada inventado. **PENDIENTE importante:** el cerebro dice que la relación con FIEL está pausada desde el 23/09 y que el vínculo es personal con su presidente (Alfredo Leyes, tío de Axel): confirmar con él que FIEL acepta figurar como organizadora y que usen su logo; ajustar la palabra «Organizan» si solo acompaña. Todo vive en `content.organizers`. El logo de FIEL es `public/fiel-logo.jpg` (JPG con fondo gris, copiado de `pagina-fundacionfiel`; se muestra recortado en círculo; conviene pedir una versión PNG sin fondo).
7. Cierre con adelanto de CAEIA (sin precios ni venta dura).
8. **Dónde es:** España 339, con mapa de Google Maps incrustado (coordenadas -24.7889107, -65.40758, de un link que pasó Axel; `content.event.mapEmbedUrl`, sin clave de API) y botón «Cómo llegar» que abre Google Maps (`content.event.mapsUrl`).
9. FAQ (¿gratis?, ¿dónde?, ¿cuánto dura?, ¿necesito saber de tecnología?; la pregunta «¿se filma?» se sacó del FAQ a pedido de Axel el 2026-11-06, el aviso sigue en el consentimiento del formulario y en el aviso de privacidad del pie).
10. Formulario completo y pie con aviso de privacidad.

**Cronómetro fijo arriba (pedido de Axel, 2026-11-03):** barra de vidrio con días, horas, minutos y segundos hasta `event.dateISO` + `event.startTime` (offset -03:00); en escritorio lleva el botón «Quiero mi lugar». **Es roja a propósito (pedido de Axel, 2026-11-03: el rojo da urgencia)**: es el único elemento fuera de la paleta azul/violeta de CAEIA y no hay que extender el rojo a otras partes. Durante el evento dice «El seminario está en curso» y al terminar desaparece. Textos en `content.countdown`; si cambia el horario, el cronómetro se ajusta solo. Usa la hora del dispositivo de cada visitante.

**Ajustes sacados de páginas de referencia (2026-11-03; Headroom Club, Product Direction y Mestres, capturas en `Imagenes/Inspiracion de paginas de eventos`):**
- **Cronómetro también junto al formulario** (`InlineCountdown`), además de la barra de arriba.
- **Frase bajo el botón** (`content.form.reassurance`): «Gratis y con cupos limitados. Te anotás en menos de 30 segundos.»
- **WhatsApp con +54 fijo y bandera**: acepta 387 1234567, 0387…, +54 9 387…; rechaza el «15» y números cortos. Se guarda como `+54` + 10 dígitos (los links wa.me de Argentina llevan 549).
- **Datos de la noche** (`content.facts`, sección `Facts` justo debajo del hero): 100 personas en el salón · 90 min · Gratis · 1 noche. Solo datos verificables. Ojo: se anotan 180 a 200 personas para 100 lugares; si se decide mostrar "100", tener en cuenta que "cupo limitado" no debe prometer entrada a todos los inscriptos.
- **Cara del expositor**: avatar en el hero (`content.hero.presenter`) y foto grande en la tarjeta de NIKI (`organizers.items[0].photo`). Fotos recortadas de `Seminarios de IA/Fotos de seminarios/1775610847649.png` (sin el dedo de la esquina): `public/axel-avatar.jpg` y `public/axel-seminario.jpg`.
- Quedan para después, si Axel los quiere: «Lo que te llevás de la noche» (necesita saber qué se entrega), capturas reales de sus apps y el logo de la Cámara (requiere autorización).

Reglas de la página: botón fijo abajo en celular, sin menú de navegación, una sola acción, carga rápida. El formulario está al final de la página (es el único); por eso los botones de arriba tienen que llevar siempre a él. Cupo limitado sí; "quedan X lugares" no, salvo que Axel lo decida. Prueba social siempre real: nunca inventar cifras ni logos sin permiso (el logo de la Cámara requiere autorización).

## Inscripción
- **Obligatorios:** nombre, WhatsApp, **mail**, tipo («Soy…»: dueño de negocio, emprendedor (o por arrancar), empleado/a o encargado/a, contador/a, otro; decisión de Axel 2026-11-06, antes mezclaba rol y condición fiscal), consentimiento.
- **Mail obligatorio (pedido de Axel, 2026-11-03):** campo visible en el formulario, para los recordatorios por mail. Es un solo interruptor: `content.form.emailRequired` (si se vuelve opcional, ajustar también el texto del consentimiento). Cada campo extra baja las inscripciones: medir.
- **Opcionales:** ninguno. El bloque «Contanos un poco más» (rubro, facturas por mes, cómo factura hoy, tarea repetitiva) se sacó el 2026-11-06 a pedido de Axel para que el formulario sea más corto. Las columnas siguen en la tabla `evento_caeia.inscripciones` (vacías) por si se vuelve a sumar alguna.
- **Origen:** un solo link con `?o=camara|instagram|contadores|tarjeta|whatsapp`; se guarda en cada inscripción.
- **Métricas:** inscriptos → asistentes (check-in con QR personal) → altas en CAEIA.
- **Backend:** Supabase, una tabla de inscriptos, **sin login**. RLS: el público solo inserta, nunca lee. Evitar duplicados por WhatsApp o mail. Ninguna clave secreta en el cliente.
- Después de inscribirse: pantalla de confirmación con "agregar al calendario" y botón para sumarse al canal de WhatsApp del evento.
- **WhatsApp [Axel decidió, 2026-11-02]:** un **grupo** (no canal) donde solo habla Axel (solo admins escriben y editan info), con contenido hasta el evento; se elimina después. Axel lo prefiere porque queda en la lista de chats. Entrar es voluntario: link en la pantalla de confirmación; nunca agregar a nadie a mano. Link cargado en `whatsappGroupUrl` (2026-11-03). Como el link queda en el código de la página, cualquiera que mire el código puede verlo: **activar "aprobar nuevos participantes"** en el grupo. Los integrantes ven los números de los demás: el botón lleva el aviso "Tu número será visible para los otros integrantes. El grupo se elimina después del evento." y el consentimiento lo cubre.
- **Recordatorios por mail [Axel lo pidió; se hace al FINAL, después de página + base]:** Resend desde un proyecto Supabase propio de este repo (no el de CAEIA), remitente tipo `evento@caeia.app`. Calendario propuesto: confirmación al inscribirse, 11/11, 15/11, 17/11, mañana del 18/11 y mail de gracias el 19/11 (el último). Baja automática pasado el 19/11 y link de baja en cada mail. El consentimiento tiene que cubrir recordatorios y contenido comercial (validar el texto con la contadora o un abogado). El calendario no está aprobado todavía.

## Orden de trabajo
1. Página con `content.ts` y formulario simulado. 2. Supabase: tabla de inscriptos, RLS, origen `?o=`, duplicados. 3. Revisión de seguridad (`/cso`). 4. Despliegue (solo cuando Axel lo pida). 5. Automatización de mails con Resend.
- Fase 2 (opcional, no ahora): mini app de calentamiento con diagnóstico (`WIKI/caeia-idea-mini-app-prelanzamiento.md`).
- Fuera de esta página por ahora: demo de factura B por WhatsApp para todos los presentes (requiere un modo demo que no existe), mini app en vivo, lista de espera para contadores.

## Stack
Vite 6 + React 19 + TypeScript (mismas versiones que `caeia`), Supabase y Vercel. **Sin Tailwind**: el estilo vidrio es casi todo CSS a medida, así que va en un solo `src/index.css` con tokens. Fuentes: Space Grotesk (títulos), Geist (texto), JetBrains Mono (horarios), autoalojadas con `@fontsource` (importadas en `src/main.tsx`; ya no se piden a Google).

## Estado (2026-11-02)
Prototipo visual completo y funcionando, con el formulario **simulado** (no guarda nada; Supabase es la etapa 2).
- `src/content.ts`: todo el texto y las variables (fecha, horario, lugar, FAQ, agenda). Los comentarios `PENDIENTE` marcan lo que falta confirmar.
- `src/lib.ts`: horarios de la agenda calculados desde `startTime`, link de "agregar al calendario", JSON-LD de Event.
- `src/components/`: `Sections.tsx` (las 10 secciones), `RegistrationForm.tsx` (el único formulario), `StickyCta.tsx` (botón fijo en celular), `ui.tsx`.
- `public/`: `niki-logo.webp` y `favicon.png` copiados de `caeia/src/assets/logos/`.
- Correr: `npm run dev` (edición con recarga en vivo), `npm run build` y `npm run preview` (puerto 4173).
- Probado en navegador a 390 px y 1360 px: sin errores de consola; validación y confirmación del formulario OK; el origen `?o=` se lee.
- **Páginas legales (2026-11-06):** `/privacidad` y `/terminos` (componente `Legal.tsx`, texto en `content.legal`), con la leyenda obligatoria de la Disposición DNPDP 10/2008 (hoy AAIP) también en el pie, enlaces desde el pie y desde el consentimiento del formulario, y consentimiento que cubre el guardado en servidores del exterior (Supabase y Vercel, EE.UU.). Texto redactado a partir de la Ley 25.326; **no es asesoramiento legal**. Axel decidió publicar con el texto provisorio. Contacto cargado por Axel el 2026-11-06 en `content.legal.responsible` (mail y WhatsApp); si se vacía, las páginas muestran «[completar contacto]». Pendiente de revisar con un abogado: inscripción de la base en el Registro Nacional de Bases de Datos de la AAIP (trámite en TAD, gratuito) y transferencia internacional a EE.UU.
- **Publicación:** `vercel.json` (rutas de las páginas legales y cabeceras de seguridad: CSP, nosniff, DENY, referrer, permisos), `public/robots.txt`, `public/sitemap.xml`, `public/og.jpg` (1200×630) y metas para redes. Dominio: `evento.caeia.app`. La función `inscripcion-evento` necesita en Supabase los secretos `ALLOWED_ORIGINS` (`https://evento.caeia.app,http://localhost:5173,http://localhost:4173`) e `IP_SALT`; y Vercel necesita la variable `VITE_INSCRIPCION_URL` (ver `.env.example`).
- **Pendientes antes de publicar:** verificar que "Facturar tan simple como mandar un WhatsApp" (Axel decidió dejarla) y la demo estén en producción el 18/11; secretos de la función; variable en Vercel; dominio; mails con Resend (al final).

## Skills cargadas (en `.claude/skills/`, solo de este proyecto)
`copywriting`, `copy-editing`, `humanizer` (texto) · `cro`, `signup`, `marketing-psychology` (conversión del formulario) · `frontend-design` (UI) · `supabase`, `security` (tabla, RLS, formulario) · `site-architecture`, `seo-audit`, `schema` (estructura, SEO, JSON-LD de Event y FAQ).
No se copió `scroll-craft` (trae scripts, ffmpeg y Playwright) ni `supabase-postgres-best-practices` (de sobra para una tabla). También están las skills de gstack (`/design-shotgun`, `/design-html`, `/plan-eng-review`, `/cso`, `/qa`, `/review`, `/ship`).

## Segundo cerebro
Está en `Segundo-cerebro/WIKI/` (y por el MCP `segundo-cerebro`). Notas útiles: `evento-lanzamiento-caeia`, `caeia`, `caeia-brief-marca`, `marketing-caeia`, `caeia-idea-mini-app-prelanzamiento`, `marca-niki-software`.
**Las decisiones del 2026-11-02 todavía no están asentadas ahí** (titular, público, promesa, copy, seña del salón del 26/10, registro). Si el cerebro y este archivo se contradicen sobre el evento, vale este archivo. Cuando se cierre algo importante, dejarlo en `WIKI/evento-lanzamiento-caeia.md`.
