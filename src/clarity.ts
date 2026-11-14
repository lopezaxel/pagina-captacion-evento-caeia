import Clarity from '@microsoft/clarity'
import { content } from './content'

// Microsoft Clarity: grabaciones de las visitas y mapas de calor, para ver dónde frena o se va la gente.
// El ID es público (va en el código de la página), no es un secreto. Para apagarlo: dejar `analytics.clarityId` vacío.
//
// Privacidad: el formulario y la pantalla de confirmación llevan `data-clarity-mask="True"`, así que en las grabaciones
// se ve el movimiento y los clics pero NO lo que la persona escribe (nombre, WhatsApp, mail). No se manda ningún dato
// personal a Clarity: tampoco se usa su API `identify`.

/** Solo corre en la página publicada: no en desarrollo ni en localhost, para no ensuciar las grabaciones. */
function enabled(): boolean {
  const host = window.location.hostname
  return Boolean(content.analytics.clarityId) && !import.meta.env.DEV && host !== 'localhost' && host !== '127.0.0.1'
}

// Clarity se carga cuando la página ya es usable (ver `afterLoadIdle` en main.tsx). Los pasos del embudo que ocurran antes
// se guardan acá y se marcan en la grabación apenas Clarity arranca.
let started = false
const pending: string[] = []

/** Carga Clarity. Se llama una sola vez, cuando la página ya es usable. */
export function initClarity() {
  if (!enabled() || started) return
  started = true
  Clarity.init(content.analytics.clarityId)
  pending.splice(0).forEach((name) => Clarity.event(name))
}

/** Marca un paso del embudo en la grabación, para poder filtrar sesiones (por ejemplo, «tocó el botón pero no se inscribió»). */
export function clarityEvent(name: string) {
  if (!enabled()) return
  if (started) Clarity.event(name)
  else pending.push(name)
}
