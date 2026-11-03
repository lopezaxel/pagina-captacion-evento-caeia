import { useEffect, useState } from 'react'
import { eventJsonLd } from './lib'
import { Agenda, Closing, Facts, Faq, Footer, Hero, Organizers, Problem, Signup, Steps, Venue, WhatYouSee } from './components/Sections'
import { StickyCta } from './components/StickyCta'
import { CountdownBar } from './components/CountdownBar'

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

export default function App() {
  // El botón fijo de abajo (celular) se oculta cuando ya hay otro botón o el formulario a la vista.
  const heroCtaInView = useInView('hero-cta', 0.6)
  const signupInView = useInView('inscripcion', 0.2)

  return (
    <>
      <div className="backdrop" aria-hidden="true">
        <i className="blob blob--1" />
        <i className="blob blob--2" />
        <i className="blob blob--3" />
      </div>

      <CountdownBar />
      <Hero />
      <main>
        <Facts />
        <Problem />
        <WhatYouSee />
        <Steps />
        <Agenda />
        <Organizers />
        <Closing />
        <Venue />
        <Faq />
        <Signup />
      </main>
      <Footer />
      <StickyCta visible={!heroCtaInView && !signupInView} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd(window.location.origin)) }} />
    </>
  )
}
