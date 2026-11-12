// TODO EL TEXTO DE LA PÁGINA VIVE ACÁ. Axel edita este archivo; los componentes no llevan texto propio.
// En los títulos de sección, lo que va entre *asteriscos* se destaca con color y brillo (ej.: 'Tu lugar *te espera*').
// Los comentarios "PENDIENTE" marcan lo que todavía hay que confirmar antes de publicar.

export const content = {
  event: {
    // Fecha y hora. Horario confirmado por Axel (2026-11-03): empieza a las 19:00; 90 min de seminario + 30 min de
    // networking = termina a las 21:00. La agenda, el cronómetro, el calendario y las preguntas se ajustan solos.
    dateISO: '2026-11-18',
    startTime: '19:00',
    day: '18',
    month: 'NOV',
    weekday: 'Miércoles',
    year: '2026',
    timezone: 'America/Argentina/Salta',
    // Lugar
    venueName: 'Cámara de Comercio e Industria de Salta',
    venueShort: 'Cámara de Comercio de Salta',
    street: 'España 339',
    city: 'Salta',
    // Ubicación exacta (España 339, Salta): -24.7889107, -65.40758. Link de Google Maps sin parámetros de seguimiento.
    mapsUrl:
      'https://www.google.com/maps/place/Espa%C3%B1a+339,+A4400+Salta/@-24.7889058,-65.4101549,17z/data=!3m1!4b1!4m6!3m5!1s0x941bc3bcd5cc5c57:0x986d41aaade02366!8m2!3d-24.7889107!4d-65.40758',
    // Mapa incrustado (no necesita clave de API).
    mapEmbedUrl: 'https://www.google.com/maps?q=-24.7889107,-65.40758&z=17&hl=es&output=embed',
    // Link de invitación del grupo de WhatsApp del evento (se elimina el grupo después del 18/11).
    whatsappGroupUrl: 'https://chat.whatsapp.com/LGQYye7KWQHGHcrjltsaVP',
  },

  nav: { cta: 'Quiero mi lugar' },

  // Píxel de Meta (Facebook e Instagram) para los anuncios. El ID es público (va en el código de la página), no es un secreto.
  // Creado por Axel el 2026-11-11 en Meta Events Manager (conjunto de datos «Evento CAEIA 18-11»). Para apagarlo: dejar vacío.
  // Eventos: PageView (al abrir la página) y Lead (cuando la inscripción se guarda). Ver src/pixel.ts.
  // Microsoft Clarity (grabaciones de visitas y mapas de calor), proyecto creado por Axel el 2026-11-12. ID público. Vacío = apagado.
  // Sin aviso de cookies (recomendación de Niki, a validar con un abogado junto con el píxel de Meta). El formulario va enmascarado.
  analytics: {
    metaPixelId: '1134377065911958',
    clarityId: 'zcl6jatcuf',
  },

  // Cronómetro fijo arriba. Cuenta hasta event.dateISO + event.startTime; se oculta cuando termina el evento.
  countdown: {
    label: 'El seminario empieza en',
    labelShort: 'Faltan',
    live: 'El seminario está en curso',
    units: { d: 'días', h: 'horas', m: 'min', s: 'seg' },
    unitsShort: { d: 'd', h: 'h', m: 'm', s: 's' },
  },

  hero: {
    // Sello de arriba (como en los flyers): deja claro que es presencial y gratis. La palabra destacada va en color.
    pill: { before: 'Seminario presencial y ', highlight: 'gratuito' },
    titleBefore: 'IA para comerciantes y emprendedores del ',
    titleHighlight: 'NOA',
    // Subtítulo elegido por Axel (2026-11-06).
    subtitle: 'Creá herramientas para tu negocio con IA',
    dateLine: 'Seminario gratuito · Miércoles 18 de noviembre · Cámara de Comercio de Salta',
    // Datos clave en píldoras con ícono (la fecha va en la tarjeta grande de arriba). Íconos: clock, pin, check, calendar.
    chips: [
      { icon: 'clock', text: '{hora} hs' },
      { icon: 'pin', text: '{direccion}' },
      { icon: 'check', text: 'Gratis · cupo limitado' },
    ],
    // Imagen principal del evento (la misma de las publicidades). Para cambiarla: reemplazar los dos archivos de
    // /public manteniendo la proporción 4:5 (780 y 1100 px de ancho) y, si cambia el texto alternativo, editarlo acá.
    visual: {
      small: '/evento-780.jpg',
      large: '/evento-1100.jpg',
      alt: 'Axel López chocando el puño con un robot de inteligencia artificial',
      width: 780,
      height: 968,
    },
    // Cara del expositor: la gente confía más cuando ve quién da la charla.
    presenter: { name: 'Axel López', role: 'Consultor de IA · NIKI Software', photo: '/axel-avatar.jpg' },
  },

  // Datos de la noche (todos verificables; no inventar cifras). Tokens: {minutos}, {fecha}
  facts: {
    items: [
      { icon: 'users', value: '100', label: 'personas en el salón' },
      { icon: 'clock', value: '{minutos} min', label: 'de seminario, más networking' },
      { icon: 'check', value: 'Gratis', label: 'con inscripción previa' },
      { icon: 'calendar', value: '1 noche', label: '{fecha}' },
    ],
  },

  // Bloque "¿Es para vos?": hace que todos los anuncios (comerciantes, emprendedoras, general) aterricen en la misma página
  // y cada persona se vea nombrada. Las etiquetas del primer grupo coinciden con las opciones de "Soy…" del formulario.
  // PENDIENTE: Axel todavía no decidió si se suma "Contador/a" a las etiquetas.
  forYou: {
    kicker: 'Para quién es',
    title: '¿Tenés un negocio? Este seminario *es para vos*.',
    groups: [
      {
        label: 'Si sos',
        tone: 'violet',
        items: [{ text: 'Dueño/a de un comercio' }, { text: 'Emprendedor/a' }, { text: 'Monotributista' }, { text: 'Responsable inscripto' }],
      },
      {
        label: 'Y tu rubro es',
        tone: 'blue',
        items: [
          { text: 'Automotor' },
          { text: 'Indumentaria y calzado' },
          { text: 'Alimentos y carnicerías' },
          { text: 'Gastronomía' },
          { text: 'Ferretería y construcción' },
          { text: 'Belleza y estética' },
          { text: 'Salud y bienestar' },
          { text: 'Hotelería y turismo' },
          { text: 'E-commerce' },
          { text: 'Servicios profesionales' },
          { text: 'Tecnología' },
          { text: 'Educación y capacitación' },
          { text: 'Cualquier otro', open: true },
        ],
      },
    ],
  },

  // Reescrita el 2026-11-10 por pedido de Axel (antes: «¿Cuántas horas por semana se te van en tareas que se repiten?»).
  // Concepto: todos ya usamos la IA, pero solo para lo personal o para un flyer; nadie nos mostró cómo ponerla a trabajar
  // adentro del negocio (un agente, una app). Título A, columnas, escalera y tarjeta 2 salieron de una crítica de copy.
  // Lo que va entre *asteriscos* se resalta. Sin cifras, sin mencionar CAEIA.
  problem: {
    kicker: 'El problema',
    title: 'Ya usás la IA, pero *solo para vos*',
    // Dos columnas: lo que ya hace la gente frente a lo que casi nadie le mostró. La segunda NO usa las palabras
    // automatización, agente ni app (pedido de Axel, 2026-11-10): eso ya lo muestra «Qué vas a ver». Va por el lado de cómo
    // implementarla, llegar a más clientes y ordenar la administración, dicho como tema («cómo usarla para…») y no como
    // promesa de resultados.
    compare: {
      before: { label: 'Lo que ya hacés', items: ['Pedirle ideas', 'Preguntarle dudas', 'Hacer un flyer'] },
      after: {
        label: 'Lo que nadie te mostró',
        items: ['Cómo ponerla a trabajar en tu negocio', 'Cómo usarla para llegar a más clientes', 'Cómo usarla para ordenar tu administración'],
      },
    },
    // Tarjeta destacada. 2026-11-10: Axel aplicó la sugerencia de la crítica de copy; la versión anterior («Ya la usás en tu día a
    // día. Lo que falta es que alguien te muestre cómo meterla adentro de tu negocio») repetía el «Ya usás» del título y
    // anticipaba el «cómo» de «Qué vas a ver». Esta cierra sobre la causa y deja el «cómo» para la sección de abajo.
    callout: 'Casi todos la usamos para lo nuestro. Lo que falta es que *alguien nos muestre* el paso siguiente.',
  },

  // Sección única (fusiona "Qué vas a ver" y "Los tres escalones", decisión de Axel 2026-11-06). Se ordena por 3 clases de
  // ejemplos de IA, cada una con apps que Axel ya tiene funcionando. La tercera es CAEIA, el cierre y lanzamiento oficial.
  // PENDIENTES antes de publicar:
  //  - Ejemplo 1 (listas de precios): es la app de Tevez Repuestos. No se nombra a propósito: hablarlo con el jefe de Axel
  //    antes de mostrarla o nombrarla (ver CLAUDE.md).
  //  - Ejemplo 1 (certificados): es el generador de Fundación FIEL (no se nombra a la Fundación en este ejemplo).
  //  - Ejemplo 2 (Bella Studio): hoy figura como demo, no como negocio real; por eso la página NO dice "negocios reales".
  //  - Ejemplo 3 (CAEIA): solo afirmar lo que funcione en producción el 18/11 (falta el certificado de producción de ARCA).
  whatYouSee: {
    kicker: 'Qué vas a ver',
    title: '*Tres formas* de usar la IA en tu negocio',
    intro: 'Te mostramos un ejemplo de cada una, funcionando.',
    // Cada tarjeta dice UNA sola cosa (pedido de Axel, 2026-11-07, después de una crítica de copy): título + una línea. Se
    // sacó la etiqueta «Lo vas a ver» y la lista de ejemplos, porque repetían la frase (y una decía «meses» y otra «días»).
    items: [
      {
        n: '01',
        icon: 'repeat',
        title: 'Automatización',
        // Sin nombrar las apps de listas de precios y certificados (decisión de Axel, 2026-11-07).
        text: 'Una app que hace sola las tareas que repetís todos los días en tu negocio.',
      },
      {
        n: '02',
        icon: 'mic',
        title: 'Agente de IA',
        // Sin nombrar Bella Studio (decisión de Axel, 2026-11-07). Se sacó «clientes reales en un negocio real»: Bella Studio
        // figura como demo y no se puede afirmar. Si Axel confirma que atiende clientes de verdad, se puede volver a poner.
        text: 'Un asistente que conversa con tus clientes y resuelve por vos.',
      },
      {
        n: '03',
        icon: 'phone',
        title: 'App de IA',
        // PENDIENTE: la versión larga («una app con IA y un agente de IA por WhatsApp») solo se puede afirmar si el agente
        // funciona en producción el 18/11. Esta dice solo lo seguro: es CAEIA y se lanza esa noche.
        text: 'CAEIA, la app con IA que lanzamos oficialmente esa noche.',
        tag: 'Cierre de la noche',
        featured: true,
      },
    ],
    cta: 'Quiero mi lugar',
  },

  agenda: {
    kicker: 'La agenda',
    title: 'Cómo va a ser *la noche*',
    // Los horarios se calculan solos a partir de event.startTime. Ajuste de Axel (2026-11-07): IA aplicada 19:10 a 20:00,
    // break 20:00 a 20:15, CAEIA 20:15 a 20:45; se sacó «Preguntas». `break: true` marca la pausa: se dibuja distinto y no
    // cuenta como minutos de seminario (sí como duración total del evento).
    // PENDIENTE: «Oferta de lanzamiento» (15 min) quedó después de CAEIA (20:45 a 21:00) y el networking se corrió a 21:30;
    // Axel todavía no dijo si la oferta sigue.
    items: [
      { minutes: 10, title: 'Bienvenida y presentación de NIKI' },
      { minutes: 50, title: 'IA aplicada al trabajo, con ejemplos reales' },
      { minutes: 15, title: 'Break', break: true },
      // `featured: true` pinta la tarjeta entera de violeta: es la que más destaca (pedido de Axel, 2026-11-07, que también
      // sacó «con demo» del título; la demo ya no se anuncia en la agenda).
      { minutes: 30, title: 'Presentación de CAEIA', featured: true },
      { minutes: 15, title: 'Oferta de lanzamiento' },
    ],
    networking: { minutes: 30, title: 'Networking' },
  },

  // Fundación FIEL: Axel confirmó el 2026-11-06 que la Fundación acepta figurar como organizadora y usar su logo.
  organizers: {
    label: 'Organizan',
    kicker: 'Quiénes lo organizan',
    title: 'NIKI Software y Fundación FIEL',
    items: [
      {
        name: 'NIKI Software',
        title: 'Axel López',
        role: 'NIKI Software y Apps de I.A',
        logo: '/niki-logo.webp',
        shape: 'wide',
        width: 900,
        height: 389,
        photo: { src: '/axel-seminario.jpg', alt: 'Axel López en un seminario de IA', width: 900, height: 764 },
        // «Universy»: confirmado por Axel (2026-11-06).
        points: [
          'Consultor en Inteligencia Artificial',
          'Desarrollador de software con IA aplicada a negocios',
          'Capacitador de IA en Fundación FIEL y Universy',
        ],
      },
      {
        name: 'Fundación FIEL',
        title: 'Fundación FIEL',
        role: 'Fundación para la Formación, Inclusión y Educación Laboral',
        logo: '/fiel-logo.jpg',
        shape: 'round',
        width: 521,
        height: 521,
        // El logo va grande, en el lugar de la foto (panel del mismo gris que el fondo del logo). `panel: true` lo activa.
        photo: { src: '/fiel-logo.jpg', alt: 'Logo de la Fundación FIEL', width: 521, height: 521, panel: true },
        // Datos dictados por Axel (2026-11-06); la Fundación confirmó que figura como organizadora.
        points: [
          'Personería Jurídica Nº 862/21 otorgada por la Inspección General de Justicia - Gobierno de la Provincia de Salta',
          'Capacitación para el trabajo',
          'Formación integral con aval institucional para profesionales del norte argentino',
        ],
      },
    ],
  },

  closing: {
    kicker: 'Y esa noche',
    title: 'Presentamos',
    text: 'El facturador con IA hecho en Salta.',
    // PENDIENTE: esta frase solo se puede afirmar si para el 18/11 el agente funciona en producción.
    tagline: 'Facturar tan simple como mandar un WhatsApp.',
    cta: 'Quiero mi lugar',
  },

  venue: {
    kicker: 'Dónde es',
    title: 'Salón de la Cámara de Comercio de *Salta*',
    text: 'Entrada gratis con inscripción previa. Solo presencial, en Salta Capital.',
    button: 'Cómo llegar',
  },

  faq: {
    kicker: 'Preguntas frecuentes',
    title: 'Antes de *anotarte*',
    // Tokens: {hora}, {direccion}, {duracion}
    items: [
      { q: '¿Es gratis?', a: 'Sí. La entrada es gratuita, solo hace falta inscribirte antes.' },
      // Pedido de Axel (2026-11-11): es OPCIONAL, se pide amablemente y la entrada es gratis para todos, lleven algo o no.
      // PENDIENTE: confirmar con la Fundación FIEL que está de acuerdo con que se la nombre en este pedido (la regla del proyecto
      // es que la Fundación sepa dónde figura) y a dónde se entrega lo recolectado.
      {
        q: '¿Tengo que llevar algo?',
        a: 'No es obligatorio, pero te pedimos amablemente que, si podés, traigas un alimento no perecedero. La Fundación FIEL ayuda a los comedores comunitarios de Salta, y entre todos podemos sumar. La entrada es gratis para todos, lleves algo o no.',
      },
      { q: '¿Dónde queda?', a: 'En la Cámara de Comercio e Industria de Salta, {direccion}.' },
      {
        q: '¿Cuánto dura?',
        a: 'Empieza a las {hora} y dura {duracion}. Después hay media hora para charlar y hacer networking.',
      },
      {
        q: '¿Necesito saber de tecnología?',
        a: 'No. Está pensado para dueños de negocios y emprendedores. Vas a ver ejemplos con problemas que seguro reconocés.',
      },
    ],
  },

  form: {
    kicker: 'Inscripción',
    // Título grande de la sección (arriba de la tarjeta del formulario).
    sectionTitle: 'Tu lugar *te espera*',
    title: 'Anotate y reservá tu lugar',
    subtitle: 'Es gratis. Te pedimos solo lo necesario.',
    // El mail es obligatorio (pedido de Axel, 2026-11-03: servirá para los recordatorios por mail).
    // Para volver a hacerlo opcional: poner false y cambiar en `consent` "y por mail" por "(y por mail, si lo completé)".
    emailRequired: true,
    // Frase corta bajo el botón: baja la fricción de anotarse.
    reassurance: 'Gratis y con cupos limitados. Te anotás en menos de 30 segundos.',
    // Tarjeta suave debajo del botón (pedido de Axel, 2026-11-11; Alfredo, de la Fundación FIEL, dijo que se haga saber). Es un pedido
    // amable y opcional: la entrada es gratis para todos. Usa la misma idea que la pregunta «¿Tengo que llevar algo?» del FAQ.
    // 2026-11-11: Axel pidió destacarla más. Lo que va entre *asteriscos* se resalta en blanco y subrayado.
    donation: {
      label: 'Pedido solidario',
      text: 'Te pedimos amablemente que, si podés, traigas un *alimento no perecedero*, ya que la Fundación FIEL ayuda a los *comedores comunitarios* de la ciudad.',
    },
    labels: {
      nombre: 'Nombre y apellido',
      whatsapp: 'WhatsApp',
      tipo: 'Soy…',
      email: 'Mail',
      emailOptional: 'Mail (opcional)',
    },
    placeholders: {
      nombre: 'Ej.: María Pérez',
      whatsapp: '387 1234567',
      email: 'tu@mail.com',
    },
    hints: { whatsapp: 'Con código de área, sin 0 ni 15. Ej.: 387 1234567' },
    // "Soy…": 5 tipos de persona (decisión de Axel, 2026-11-06), por prioridad de público. Antes mezclaba rol y condición
    // fiscal. «Emprendedor» incluye a quien está por arrancar. Si se cambian, hay que cambiar también la lista TIPOS de la
    // función inscripcion-evento y la regla inscripciones_tipo_check de la tabla (si no, esos envíos se rechazan).
    tipos: ['Dueño de negocio', 'Emprendedor (o por arrancar)', 'Empleado/a o encargado/a', 'Contador/a', 'Otro'],
    // Texto provisorio: Axel decidió publicar con este texto (2026-11-06); idealmente lo valida la contadora o un abogado
    // (Ley 25.326). Se guarda tal cual en cada inscripción. Por pedido de Axel ya no menciona que el evento se filma.
    consent:
      'Acepto que me escriban por WhatsApp y por mail con información del evento y novedades del lanzamiento de CAEIA, y que mis datos se guarden en servidores del exterior, como explica la política de privacidad. Puedo pedir la baja cuando quiera.',
    privacyLink: 'Política de privacidad',
    termsLink: 'Términos y condiciones',
    submit: 'Quiero mi lugar',
    sending: 'Reservando…',
    errors: {
      nombre: 'Escribí tu nombre.',
      whatsapp: 'Escribí tu WhatsApp con código de área, sin 0 ni 15 (ej.: 387 1234567).',
      tipo: 'Elegí una opción.',
      email: 'Revisá el mail: parece que le falta algo.',
      emailRequired: 'Escribí tu mail.',
      consent: 'Necesitamos tu consentimiento para anotarte.',
      // Errores al enviar (no son del llenado): se muestran sobre el botón.
      send: 'No pudimos guardar tu inscripción. Probá de nuevo en un momento.',
      tooMany: 'Hiciste muchos intentos seguidos. Esperá unos minutos y probá de nuevo.',
    },
    // Cartel que sale al tocar «Quiero mi lugar» (con los datos ya completos), por encima de todo el formulario (pedido de
    // Axel, 2026-11-09). «Sí voy a asistir» envía la inscripción; «OK, no iré» cierra el cartel y no guarda nada.
    // Lo que va entre *asteriscos* se resalta.
    confirm: {
      title: '¡Atención!',
      text: 'Registrate solo si *REALMENTE* vas a asistir, ya que es un seminario *MUY EXCLUSIVO* y con capacidad *LIMITADA*.',
      yes: 'SÍ VOY A ASISTIR',
      no: 'OK, no iré',
      sending: 'Reservando…',
    },
    // Pantalla después de confirmar: solo el botón del grupo de WhatsApp (se sacaron «Agregar al calendario» y la encuesta).
    success: {
      title: 'Listo, {nombre}. Tu lugar está reservado.',
      text: 'Te esperamos el {fecha}, {hora} hs, en {lugar}.',
      mustJoin: 'Tenés que entrar al grupo de WhatsApp sí o sí: ahí te avisamos todo lo del evento.',
      whatsapp: 'Unirme al grupo de WhatsApp',
      whatsappNote: 'Tu número será visible para los otros integrantes. El grupo se elimina después del evento.',
    },
  },

  // Pie de página: resumen + leyenda obligatoria (Disposición DNPDP 10/2008, hoy a cargo de la AAIP) + links a las dos páginas.
  privacy: {
    id: 'privacidad',
    title: 'Aviso de privacidad',
    text: 'Usamos tus datos solo para organizar el evento y mantenerte al tanto de lo que pase antes y después. No los vendemos ni los cedemos a otras empresas. Para medir los anuncios usamos el píxel de Meta, y para ver cómo se usa la página (clics, movimiento del cursor y scroll, sin lo que escribís en el formulario) usamos Microsoft Clarity. Ninguna de las dos recibe tu nombre ni tus datos de contacto.',
    legend:
      'El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto conforme lo establecido en el artículo 14, inciso 3 de la Ley Nº 25.326. La Agencia de Acceso a la Información Pública, en su carácter de Órgano de Control de la Ley Nº 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.',
  },

  // Páginas legales: /privacidad y /terminos. Redactadas el 2026-11-06 a partir de lo que hace la página (qué datos se piden,
  // dónde se guardan, quién los ve) y de la Ley 25.326, la Disposición DNPDP 10/2008 y la Resolución AAIP 14/2018.
  // No reemplazan la revisión de un abogado. Tokens: {contacto}, {fecha}, {hora}, {direccion}.
  // Contacto del responsable cargado por Axel el 2026-11-06 (`responsible.email` y `responsible.whatsapp`); si se vacían, las
  // páginas muestran «[completar contacto]».
  legal: {
    updated: '12 de noviembre de 2026',
    backToEvent: 'Volver a la página del evento',
    otherDocs: { privacy: 'Política de privacidad', terms: 'Términos y condiciones' },
    responsible: {
      name: 'Axel López',
      brand: 'NIKI Software',
      city: 'Salta Capital, Argentina',
      email: 'lopezaxelalejandro@gmail.com',
      whatsapp: '+54 9 387 685 5489',
    },
    privacy: {
      path: '/privacidad',
      pageTitle: 'Política de privacidad · Seminario de IA en Salta',
      title: 'Política de privacidad',
      intro:
        'Acá te contamos qué datos pedimos para inscribirte al seminario, para qué los usamos, con quién los compartimos y cómo podés ejercer tus derechos.',
      sections: [
        {
          h: 'Quién es el responsable',
          p: [
            'El responsable del tratamiento de tus datos es Axel López, que trabaja bajo la marca NIKI Software, con domicilio en Salta Capital, Argentina. Organiza el seminario junto con la Fundación FIEL.',
            'Para consultas y para ejercer tus derechos: {contacto}.',
          ],
        },
        {
          h: 'Qué datos recibimos',
          list: [
            'Nombre y apellido.',
            'Número de WhatsApp.',
            'Mail.',
            'El tipo de persona que elegiste en «Soy…» (por ejemplo, dueño de negocio o emprendedor).',
            'El origen del link por el que llegaste (por ejemplo, Instagram), cuando viene en la dirección.',
            'La fecha y hora de tu inscripción y el texto del consentimiento que aceptaste.',
          ],
          p: [
            'Los datos de la inscripción son obligatorios: sin ellos no podemos anotarte. No pedimos datos sensibles, clave fiscal ni datos bancarios.',
            'Para evitar abusos en el formulario guardamos un código irreversible derivado de tu dirección IP, no la dirección en sí. Ese código se descarta al día siguiente.',
          ],
        },
        {
          h: 'Para qué los usamos',
          list: [
            'Confirmar tu inscripción y organizar el evento (lista de asistentes e ingreso).',
            'Avisarte por WhatsApp y por mail sobre el evento: recordatorios y cambios.',
            'Contarte las novedades del lanzamiento de CAEIA, porque lo aceptaste al inscribirte.',
            'Sumarte al grupo de WhatsApp del evento, donde avisamos todo lo del evento. Entrás vos, desde el botón de la pantalla de confirmación.',
            'Hacer estadísticas internas (cuántas personas se anotaron y de qué tipo).',
            'Medir el resultado de los anuncios del evento con el píxel de Meta (por ejemplo, cuántas personas visitaron la página y cuántas se inscribieron) y mostrar los anuncios a quienes la visitaron. Para eso no usamos tu nombre, tu WhatsApp ni tu mail.',
            'Ver cómo se usa la página para mejorarla, con Microsoft Clarity: se registran tus clics, el movimiento del cursor, el scroll y las páginas que visitás, y se pueden ver como una grabación de la visita. Lo que escribís en el formulario no se graba: está oculto.',
          ],
          p: ['No los usamos para otra cosa ni los vendemos. Tu consentimiento es libre y podés retirarlo cuando quieras.'],
        },
        {
          h: 'Con quién los compartimos',
          p: [
            'Para que la página funcione usamos proveedores técnicos que guardan o procesan los datos por nuestra cuenta: Supabase (base de datos), Vercel (alojamiento de la página), Google (mapa que se muestra en la página), Meta (píxel de medición de anuncios y WhatsApp, para los mensajes y el grupo del evento), Microsoft (Clarity, para ver cómo se usa la página) y un servicio de correo electrónico (avisos y, cuando los enviemos, recordatorios por mail).',
            'No cedemos tus datos a otras empresas ni personas, salvo que una autoridad competente lo exija.',
          ],
        },
        {
          h: 'Servidores en el exterior',
          p: [
            'Algunos de esos proveedores guardan los datos en servidores ubicados fuera de la Argentina, principalmente en Estados Unidos. Al inscribirte aceptás esa transferencia. Elegimos proveedores que aplican medidas de seguridad y compromisos contractuales de protección de datos.',
          ],
        },
        {
          h: 'Cookies',
          p: [
            'Esta página no usa cookies propias. Para contar las visitas (cuántas personas entran, desde qué país y dispositivo, y de qué enlace llegan) usamos Vercel Web Analytics, que no usa cookies ni guarda datos personales. Sí usa el píxel de Meta (Facebook e Instagram) para medir los anuncios del evento: Meta puede guardar cookies e identificadores en tu navegador y recibir datos como tu dirección IP, el navegador que usás, las páginas que visitás y que completaste la inscripción. No le enviamos tu nombre, tu WhatsApp ni tu mail. Para limitarlo podés cambiar tus preferencias de anuncios en tu cuenta de Facebook o Instagram, o usar un bloqueador de rastreadores en tu navegador.',
            'También usa Microsoft Clarity, que guarda un identificador en tu navegador (cookies) para seguir tu visita como una sola sesión. Podés evitarlo con un bloqueador de rastreadores.',
            'El mapa de «Dónde es» lo muestra Google, y Google puede usar cookies al cargarlo, según su propia política.',
          ],
        },
        {
          h: 'Cuánto tiempo los guardamos',
          p: [
            'Los conservamos mientras sean necesarios para esas finalidades (el evento y las comunicaciones que aceptaste recibir) y hasta que pidas la baja o la supresión.',
          ],
        },
        {
          h: 'Tus derechos',
          p: [
            'Podés pedir que te mostremos qué datos tuyos tenemos (acceso), que los corrijamos o actualicemos (rectificación) o que los eliminemos (supresión), según los artículos 14 a 16 de la Ley 25.326. Escribinos a {contacto}, desde el mismo mail o WhatsApp con el que te anotaste. Respondemos los pedidos de acceso en 10 días corridos y los de rectificación o supresión en 5 días hábiles.',
          ],
          legend: true,
        },
        {
          h: 'Cómo dejar de recibir mensajes',
          p: [
            'Respondé BAJA a cualquier mensaje por WhatsApp, o usá el enlace de baja que va en cada mail. Dejamos de escribirte.',
          ],
        },
        {
          h: 'Seguridad',
          p: [
            'La página usa conexión cifrada (HTTPS). La base de datos donde se guardan tus datos no es de acceso público: solo se escribe a través del formulario de inscripción y solo accede el responsable.',
          ],
        },
        {
          h: 'Cambios en esta política',
          p: ['Si la cambiamos, publicamos la nueva versión en esta página con su fecha de actualización.'],
        },
      ],
    },
    terms: {
      path: '/terminos',
      pageTitle: 'Términos y condiciones · Seminario de IA en Salta',
      title: 'Términos y condiciones',
      intro: 'Estas son las condiciones para inscribirte y asistir al seminario. Al inscribirte las aceptás.',
      sections: [
        {
          h: 'Qué es este evento',
          p: [
            'Es un seminario gratuito y presencial de inteligencia artificial para negocios, organizado por NIKI Software y la Fundación FIEL. Se realiza el {fecha}, a las {hora} hs, en la Cámara de Comercio e Industria de Salta ({direccion}). Incluye la presentación de CAEIA, una app de facturación electrónica con IA.',
          ],
        },
        {
          h: 'Inscripción',
          p: [
            'La inscripción es gratuita y obligatoria. Tenés que usar datos verdaderos y anotarte una sola vez. Inscribirte no te obliga a comprar ni a contratar nada.',
          ],
        },
        {
          h: 'Cupo e ingreso',
          p: [
            'El salón tiene capacidad limitada (100 personas) y recibimos más inscripciones que lugares. Por eso anotarte no garantiza una butaca: el ingreso es por orden de llegada hasta completar la capacidad. Te recomendamos llegar con tiempo.',
          ],
        },
        {
          h: 'Cambios y cancelación',
          p: [
            'Podemos cambiar la fecha, el horario, el lugar o el programa, o cancelar el evento por razones de organización o de fuerza mayor. Si pasa, te avisamos por los medios que nos dejaste. Como el evento es gratuito, no corresponde ninguna compensación.',
          ],
        },
        {
          h: 'Admisión y conducta',
          p: [
            'Pedimos respeto hacia los demás asistentes, los oradores y el lugar. Los organizadores se reservan el derecho de admisión y permanencia, y se aplican las normas de la Cámara de Comercio.',
          ],
        },
        {
          h: 'Contenido del seminario',
          p: [
            'El seminario es informativo y educativo. No es asesoramiento profesional, contable, fiscal ni legal, y no garantizamos resultados para tu negocio. Que se presente una herramienta no te obliga a contratarla.',
            'Los materiales y presentaciones son de sus autores y no se pueden reproducir ni vender sin permiso.',
          ],
        },
        {
          h: 'Mensajes y grupo de WhatsApp',
          p: [
            'Si lo aceptaste, te escribimos por WhatsApp y por mail sobre el evento. El grupo de WhatsApp es el canal donde avisamos todo lo del evento, por eso te pedimos que entres; entrás vos, desde el botón de la confirmación, y sus integrantes pueden ver los números de los demás. El grupo se elimina después del evento.',
          ],
        },
        {
          h: 'Datos personales',
          p: ['Tratamos tus datos como explica nuestra política de privacidad.'],
        },
        {
          h: 'Responsabilidad',
          p: [
            'En la medida en que la ley lo permita, los organizadores no se hacen responsables por la pérdida o el daño de objetos personales ni por situaciones ajenas a la organización.',
          ],
        },
        {
          h: 'Ley aplicable',
          p: [
            'Se aplican las leyes de la República Argentina. Cualquier controversia se somete a los tribunales ordinarios de Salta Capital, sin perjuicio de los derechos que la ley reconoce a los consumidores.',
          ],
        },
        {
          h: 'Contacto',
          p: ['Para cualquier consulta: {contacto}.'],
        },
      ],
    },
  },

  footer: {
    organizer: 'Organizan NIKI Software y Fundación FIEL',
    venue: 'En la Cámara de Comercio e Industria de Salta',
  },
}

export type Content = typeof content
