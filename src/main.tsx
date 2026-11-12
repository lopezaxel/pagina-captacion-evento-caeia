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
import { initFunnelTracking, initPixel } from './pixel'

// Píxel de Meta para medir los anuncios (solo en la página publicada). Ver src/pixel.ts.
initPixel()
initFunnelTracking()

// Vercel Web Analytics: visitas, países, dispositivos y de dónde llegan. Sin cookies y sin datos personales.
// Solo en la página publicada (no en desarrollo ni en localhost). Hay que activarlo una vez en el panel de Vercel:
// proyecto → Analytics → Enable. Los scripts salen del mismo dominio (/_vercel/insights), así que la CSP no cambia.
if (import.meta.env.PROD && !['localhost', '127.0.0.1'].includes(window.location.hostname)) inject()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
