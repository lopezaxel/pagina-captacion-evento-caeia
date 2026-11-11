import { content } from './content'

// Píxel de Meta (Facebook e Instagram) para medir los anuncios del evento.
// Es el mismo código que da Meta, pero cargado desde un archivo propio y no pegado en el HTML: la página tiene una política de
// seguridad (CSP) que no deja correr scripts pegados, y solo autoriza el dominio connect.facebook.net (ver vercel.json).
// No se manda ningún dato personal (ni nombre, ni WhatsApp, ni mail): solo la visita y el hecho de que alguien se inscribió.

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void
  queue: unknown[]
  loaded: boolean
  version: string
  push: unknown
}

declare global {
  interface Window {
    fbq?: Fbq
    _fbq?: Fbq
  }
}

/** Solo corre en la página publicada: no en desarrollo ni en localhost, para no ensuciar las estadísticas de Meta. */
function enabled(): boolean {
  const host = window.location.hostname
  return Boolean(content.analytics.metaPixelId) && !import.meta.env.DEV && host !== 'localhost' && host !== '127.0.0.1'
}

/** Carga el píxel y registra la visita (PageView). Se llama una sola vez al abrir la página. */
export function initPixel() {
  if (!enabled() || window.fbq) return

  // Misma cola de eventos que el código oficial de Meta: los eventos se guardan hasta que termina de cargar fbevents.js.
  const fbq = function () {
    // eslint-disable-next-line prefer-rest-params
    if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments as unknown as unknown[])
    // eslint-disable-next-line prefer-rest-params
    else fbq.queue.push(arguments)
  } as Fbq
  window.fbq = fbq
  if (!window._fbq) window._fbq = fbq
  fbq.push = fbq
  fbq.loaded = true
  fbq.version = '2.0'
  fbq.queue = []

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(script)

  fbq('init', content.analytics.metaPixelId)
  fbq('track', 'PageView')
}

/** Avisa a Meta que alguien completó la inscripción (evento estándar «Lead»). Sin datos personales. */
export function trackLead() {
  if (!enabled()) return
  window.fbq?.('track', 'Lead')
}
