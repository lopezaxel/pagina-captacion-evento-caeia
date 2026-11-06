// TODO EL TEXTO DE LA PÁGINA VIVE ACÁ. Axel edita este archivo; los componentes no llevan texto propio.
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

  // Cronómetro fijo arriba. Cuenta hasta event.dateISO + event.startTime; se oculta cuando termina el evento.
  countdown: {
    label: 'El seminario empieza en',
    labelShort: 'Faltan',
    live: 'El seminario está en curso',
    units: { d: 'días', h: 'horas', m: 'min', s: 'seg' },
    unitsShort: { d: 'd', h: 'h', m: 'm', s: 's' },
  },

  hero: {
    pill: 'Seminario gratuito · Salta',
    titleBefore: 'IA para comercios y emprendedores del ',
    titleHighlight: 'NOA',
    // PENDIENTE: subtítulo propuesto, sin confirmar.
    subtitle: 'De usar la IA para hacer flyers a crear herramientas para tu negocio',
    dateLine: 'Seminario gratuito · Miércoles 18 de noviembre · Cámara de Comercio de Salta',
    chips: ['{hora} hs', '{direccion}', 'Gratis · cupo limitado'],
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

  problem: {
    kicker: 'El problema',
    title: 'Todos usan la IA. Casi nadie la usa para trabajar.',
    paragraphs: [
      'La mayoría la abrió para hacer un flyer, una foto de producto o sacarse una duda, y ahí se quedó. Mientras tanto, la IA ya puede resolver cosas que a tu negocio le cuestan horas todos los meses: filtrar listas de miles de productos, ordenar turnos, armar reportes, responderle a tus clientes.',
      // PENDIENTE: Axel duda si esta frase suena a alivio o a reproche.
      'Nadie te lo mostró. No es culpa tuya: la IA cambió más rápido de lo que alguien tuvo tiempo de explicártela.',
    ],
  },

  whatYouSee: {
    kicker: 'Qué vas a ver',
    title: 'IA en negocios reales, de acá del norte',
    intro:
      'El 18 de noviembre vas a ver cómo se usa la IA en negocios reales. Apps que ya funcionan, con problemas que seguro reconocés.',
    items: [
      {
        icon: 'eye',
        title: 'Apps reales funcionando',
        text: 'Las vas a ver andando, en negocios de acá, con problemas que seguro reconocés.',
      },
      {
        icon: 'search',
        title: 'Qué se puede resolver en tu negocio',
        text: 'Salís sabiendo detectar qué tareas repetitivas de tu negocio se pueden resolver con IA.',
      },
      {
        icon: 'users',
        title: 'Cuándo conviene un experto',
        text: 'Qué podés armar vos con las herramientas que ya existen, y dónde conviene que lo haga alguien que sabe.',
      },
    ],
  },

  steps: {
    kicker: 'Los tres escalones',
    title: 'De usar la IA a crear con IA',
    intro: 'Lo que podés armar vos, y lo que conviene que arme un experto.',
    items: [
      {
        n: '01',
        title: 'Usarla',
        text: 'Dudas, flyers, fotos de producto. Donde está casi todo el mundo hoy.',
      },
      {
        n: '02',
        title: 'Crearla',
        text: 'Mini apps para un sector de tu negocio. La IA bajó la vara: hoy cualquiera puede crear algo útil.',
      },
      {
        n: '03',
        title: 'Sumar un experto',
        text: 'Cuando necesitás algo serio, con IA metida en los procesos de tu negocio, hace falta alguien que sepa.',
      },
    ],
    cta: 'Quiero mi lugar',
  },

  agenda: {
    kicker: 'La agenda',
    title: 'Cómo va a ser la noche',
    // Los horarios se calculan solos a partir de event.startTime. PENDIENTE: agenda propuesta, sin confirmar.
    items: [
      { minutes: 10, title: 'Bienvenida y presentación de NIKI' },
      { minutes: 30, title: 'IA aplicada al trabajo, con ejemplos reales' },
      // PENDIENTE: la demo solo se puede prometer si el agente funciona en producción el 18/11.
      { minutes: 25, title: 'Presentación de CAEIA, con demo' },
      { minutes: 10, title: 'Preguntas' },
      { minutes: 15, title: 'Oferta de lanzamiento' },
    ],
    networking: { minutes: 30, title: 'Networking' },
  },

  // PENDIENTE (importante): la Fundación FIEL figura como organizadora y se usa su logo. Confirmar con su presidente
  // que está de acuerdo con el texto "Organizan" (si solo acompaña, cambiar a "Con el respaldo de" o "En alianza con").
  // Confirmar también cada frase de abajo antes de publicar (no inventar prueba social).
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
        points: [
          'Desarrolla apps y software con IA para negocios de Salta y el NOA.',
          'Ya dio seminarios de IA para negocios, junto a la Fundación FIEL.',
          'Las apps que vas a ver ya funcionan en negocios reales.',
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
        photo: null,
        points: [
          'Da capacitaciones laborales en Salta y Jujuy.',
          'Tiene cursos de tecnología, como uso de la IA, agentes de IA y programación con IA.',
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
    title: 'Cámara de Comercio de Salta',
    text: 'Entrada gratis con inscripción previa. Solo presencial, en Salta Capital.',
    button: 'Cómo llegar',
  },

  faq: {
    kicker: 'Preguntas frecuentes',
    title: 'Antes de anotarte',
    // Tokens: {hora}, {direccion}, {duracion}
    items: [
      { q: '¿Es gratis?', a: 'Sí. La entrada es gratuita, solo hace falta inscribirte antes.' },
      { q: '¿Dónde queda?', a: 'En la Cámara de Comercio e Industria de Salta, {direccion}.' },
      {
        q: '¿Cuánto dura?',
        a: 'Empieza a las {hora} y dura {duracion}. Después hay media hora para charlar y hacer networking.',
      },
      {
        q: '¿Necesito saber de tecnología?',
        a: 'No. Está pensado para dueños de negocios y emprendedores. Vas a ver ejemplos con problemas que seguro reconocés.',
      },
      {
        q: '¿Se filma?',
        a: 'Sí. Vamos a filmar el evento y parte del material se va a publicar en la web y en Instagram. Por eso te lo avisamos acá y al inscribirte.',
      },
    ],
  },

  form: {
    kicker: 'Inscripción',
    title: 'Anotate y reservá tu lugar',
    subtitle: 'Es gratis. Te pedimos solo lo necesario.',
    // El mail es obligatorio (pedido de Axel, 2026-11-03: servirá para los recordatorios por mail).
    // Para volver a hacerlo opcional: poner false y cambiar en `consent` "y por mail" por "(y por mail, si lo completé)".
    emailRequired: true,
    // Frase corta bajo el botón: baja la fricción de anotarse.
    reassurance: 'Gratis y con cupos limitados. Te anotás en menos de 30 segundos.',
    labels: {
      nombre: 'Nombre y apellido',
      whatsapp: 'WhatsApp',
      tipo: 'Soy…',
      email: 'Mail',
      emailOptional: 'Mail (opcional)',
      rubro: 'Rubro de tu negocio (opcional)',
      facturas: '¿Cuántas facturas emitís por mes? (opcional)',
      como: '¿Cómo facturás hoy? (opcional)',
      tarea: '¿Qué tarea repetitiva te quita más tiempo? (opcional)',
    },
    placeholders: {
      nombre: 'Ej.: María Pérez',
      whatsapp: '387 1234567',
      email: 'tu@mail.com',
      rubro: 'Ej.: indumentaria, repuestos, carnicería',
      tarea: 'Contanos y quizás lo resolvemos en vivo',
    },
    hints: { whatsapp: 'Con código de área, sin 0 ni 15. Ej.: 387 1234567' },
    tipos: ['Comerciante', 'Monotributista', 'Responsable Inscripto', 'Contador/a', 'Otro'],
    facturas: ['No facturo', 'Menos de 10', 'Entre 10 y 50', 'Más de 50'],
    como: ['Desde el portal de ARCA', 'Con una planilla de Excel', 'Con otro sistema o app', 'Me factura mi contador', 'Otra forma'],
    moreToggle: 'Contanos un poco más (opcional)',
    // PENDIENTE: validar el texto del consentimiento con la contadora o un abogado (Ley 25.326).
    consent:
      'Acepto que me escriban por WhatsApp y por mail con información del evento y novedades del lanzamiento de CAEIA. Sé que el evento se filma y que puedo pedir la baja cuando quiera.',
    privacyLink: 'Aviso de privacidad',
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
    success: {
      title: 'Listo, {nombre}. Tu lugar está reservado.',
      text: 'Te esperamos el {fecha}, {hora} hs, en {lugar}.',
      calendar: 'Agregar al calendario',
      whatsapp: 'Sumarme al grupo de WhatsApp',
      whatsappNote: 'Tu número será visible para los otros integrantes. El grupo se elimina después del evento.',
    },
  },

  privacy: {
    id: 'privacidad',
    title: 'Aviso de privacidad',
    // PENDIENTE: texto provisorio. Validar con la contadora o un abogado (Ley 25.326) y completar el contacto.
    text: 'Usamos tus datos solo para organizar el evento y mantenerte al tanto de lo que pase antes y después. No los compartimos con terceros ni los usamos para otra cosa. Podés pedir que los corrijamos o los borremos cuando quieras. El evento se filma y parte del material se publica en la web y en redes.',
    contact: { whatsapp: '', email: '' },
  },

  footer: {
    organizer: 'Organizan NIKI Software y Fundación FIEL',
    venue: 'En la Cámara de Comercio e Industria de Salta',
  },
}

export type Content = typeof content
