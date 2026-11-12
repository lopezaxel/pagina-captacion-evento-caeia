import { content } from './content'
import { clarityEvent } from './clarity'

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

/**
 * Evento propio del embudo (por ejemplo «ClicQuieroMiLugar»). Solo lleva el nombre y, a lo sumo, de qué botón vino:
 * nunca datos de la persona. En Meta aparecen como «eventos personalizados».
 */
export function trackStep(name: string, params?: Record<string, string>) {
  clarityEvent(name) // El mismo paso queda marcado en la grabación de Clarity.
  if (!enabled()) return
  window.fbq?.('trackCustom', name, params)
}

/**
 * Mide el recorrido dentro de la página para ver dónde se cae la gente:
 *   VerFormulario       → el formulario entró en pantalla (una vez por visita)
 *   ClicQuieroMiLugar   → tocó cualquier botón que lleva al formulario (con `lugar`: cronometro, hero, boton_fijo o seccion)
 *   EmpezoFormulario    → tocó el primer campo (una vez por visita)
 * Los otros dos pasos («CartelAtencion» y «CartelNoIre») se mandan desde RegistrationForm.tsx.
 * Se engancha al documento (no a cada botón), así que sirve aunque cambien los botones o el copy.
 */
export function initFunnelTracking() {
  if (!enabled()) return

  document.addEventListener('click', (ev) => {
    const link = (ev.target as Element | null)?.closest?.('a[href="#inscripcion"]')
    if (!link) return
    const lugar = link.closest('.countdown')
      ? 'cronometro'
      : link.closest('.sticky')
        ? 'boton_fijo'
        : link.closest('.hero')
          ? 'hero'
          : 'seccion'
    trackStep('ClicQuieroMiLugar', { lugar })
  })

  let started = false
  document.addEventListener('focusin', (ev) => {
    const el = ev.target as HTMLElement | null
    // El campo «website» es la trampa anti-bots: no cuenta.
    if (started || !el?.closest?.('form.form') || (el as HTMLInputElement).name === 'website') return
    started = true
    trackStep('EmpezoFormulario')
  })

  // El formulario se dibuja después de cargar el script, así que se lo busca cuando termina de cargar la página.
  window.addEventListener('load', () => {
    const section = document.getElementById('inscripcion')
    if (!section || !('IntersectionObserver' in window)) return
    const seen = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        seen.disconnect()
        trackStep('VerFormulario')
      },
      { threshold: 0.25 },
    )
    seen.observe(section)
  })
}
