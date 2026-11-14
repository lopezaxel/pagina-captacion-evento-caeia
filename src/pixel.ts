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

  fbq('init', content.analytics.metaPixelId)
  fbq('track', 'PageView')
}

/**
 * Descarga el script de Meta (fbevents.js). Se llama aparte de `initPixel` a propósito: `initPixel` deja lista la cola de eventos
 * al instante (cuesta nada) y esto se posterga hasta que la página ya es usable (ver `afterLoadIdle` en main.tsx), porque
 * fbevents.js y su configuración bloquean ~1,4 s el celular al arrancar. Todo lo que pase antes (PageView, clics) queda en la
 * cola y Meta lo recibe cuando el script termina de cargar: no se pierde ningún evento.
 */
export function loadPixelScript() {
  if (!enabled() || document.querySelector('script[src*="fbevents.js"]')) return
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(script)
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
 *   ClicGrupoWhatsApp   → tocó el botón grande de unirse al grupo de WhatsApp (pantalla después de anotarse)
 * «EnvioFormulario» (datos completos y válidos, se intenta guardar) se manda desde RegistrationForm.tsx, y «Lead» cuando se guardó.
 * (El cartel «¡Atención!» y sus eventos «CartelAtencion» y «CartelNoIre» se sacaron el 2026-11-14.)
 * Se engancha al documento (no a cada botón), así que sirve aunque cambien los botones o el copy.
 */
export function initFunnelTracking() {
  if (!enabled()) return

  document.addEventListener('click', (ev) => {
    const target = ev.target as Element | null
    // El botón del grupo de WhatsApp (pantalla de confirmación o botón fijo de celular).
    if (target?.closest?.('a.done__wa, a.btn--wa')) {
      trackStep('ClicGrupoWhatsApp')
      return
    }
    const link = target?.closest?.('a[href="#inscripcion"]')
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
