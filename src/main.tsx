import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// Fuentes alojadas en la propia página (sin pedirlas a Google): Space Grotesk (títulos), Geist (texto), JetBrains Mono (horarios).
import '@fontsource/space-grotesk/latin-500.css'
import '@fontsource/space-grotesk/latin-700.css'
import '@fontsource/geist/latin-400.css'
import '@fontsource/geist/latin-500.css'
import '@fontsource/geist/latin-600.css'
import '@fontsource/geist/latin-700.css'
import '@fontsource/jetbrains-mono/latin-500.css'
import '@fontsource/jetbrains-mono/latin-700.css'
import './index.css'
import { inject } from '@vercel/analytics'
import { initFunnelTracking, initPixel, loadPixelScript } from './pixel'
import { initClarity } from './clarity'

/**
 * Corre `fn` cuando la página terminó de cargar y el navegador está libre (máximo ~2,5 s después). Sirve para no hacer
 * competir a los scripts de medición con el primer pintado: en celulares medios fbevents.js, su configuración y Clarity
 * sumaban ~2 s de bloqueo al arrancar (Lighthouse móvil, 2026-11-13).
 */
function afterLoadIdle(fn: () => void) {
  let done = false
  const once = () => {
    if (done) return
    done = true
    fn()
  }
  const run = () => {
    // Safari de iPhone no trae requestIdleCallback: ahí se usa un temporizador corto.
    if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(once, { timeout: 2500 })
    else window.setTimeout(once, 1200)
  }
  if (document.readyState === 'complete') run()
  else window.addEventListener('load', run, { once: true })
  // Red de seguridad: si «load» tarda (por ejemplo, una imagen colgada con mala señal), la medición arranca igual.
  window.setTimeout(once, 6000)
}

// Píxel de Meta para medir los anuncios (solo en la página publicada). Ver src/pixel.ts.
// La cola de eventos queda lista ya (PageView y clics se guardan) y el script de Meta se descarga después.
initPixel()
initFunnelTracking()
// Microsoft Clarity: grabaciones y mapas de calor (solo en la página publicada). Ver src/clarity.ts.
afterLoadIdle(() => {
  loadPixelScript()
  initClarity()
})

// Vercel Web Analytics: visitas, países, dispositivos y de dónde llegan. Sin cookies y sin datos personales.
// Solo en la página publicada (no en desarrollo ni en localhost). Hay que activarlo una vez en el panel de Vercel:
// proyecto → Analytics → Enable. Los scripts salen del mismo dominio (/_vercel/insights), así que la CSP no cambia.
if (import.meta.env.PROD && !['localhost', '127.0.0.1'].includes(window.location.hostname)) inject()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
