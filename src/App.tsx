import { useEffect, useState } from 'react'
import { eventJsonLd } from './lib'
import { Agenda, Closing, Facts, Faq, Footer, ForYou, Hero, Organizers, Problem, Signup, SignupTop, Venue, WhatYouSee } from './components/Sections'
import { StickyCta } from './components/StickyCta'
import { CountdownBar } from './components/CountdownBar'
import { LegalPage } from './components/Legal'
import { Backdrop } from './components/ui'
import { content } from './content'

function useInView(id: string, threshold: number) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = document.getElementById(id)
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [id, threshold])
  return visible
}

function Landing() {
  // El botón fijo de abajo (celular) se oculta cuando ya hay otro botón o el formulario a la vista.
  const heroCtaInView = useInView('hero-cta', 0.6)
  // Hay dos formularios (arriba y al final): el botón fijo se oculta cuando cualquiera de los dos está a la vista.
  const signupTopInView = useInView('inscripcion', 0.2)
  const signupEndInView = useInView('inscripcion-final', 0.2)

  return (
    <>
      <Backdrop />

      <CountdownBar />
      <Hero />
      <main>
        <Facts />
        <SignupTop />
        <ForYou />
        <Problem />
        <WhatYouSee />
        <Agenda />
        <Organizers />
        <Closing />
        <Venue />
        <Faq />
        <Signup />
      </main>
      <Footer />
      <StickyCta visible={!heroCtaInView && !signupTopInView && !signupEndInView} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd(window.location.origin)) }} />
    </>
  )
}

/** Rutas: la página del evento y las dos páginas legales (el servidor reenvía /privacidad y /terminos a esta misma app). */
export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '')
  if (path === content.legal.privacy.path) return <LegalPage doc="privacy" />
  if (path === content.legal.terms.path) return <LegalPage doc="terms" />
  return <Landing />
}
