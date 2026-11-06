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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
