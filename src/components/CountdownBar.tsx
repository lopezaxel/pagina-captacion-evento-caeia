import { useEffect, useState } from 'react'
import { content } from '../content'
import { eventEnd, eventStart, splitMs } from '../lib'

const c = content.countdown
const pad2 = (n: number) => String(n).padStart(2, '0')

/** Hora actual, actualizada cada segundo. */
function useNow() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

/** Barra fija arriba de todo con el tiempo que falta para el evento. */
export function CountdownBar() {
  const now = useNow()
  const start = eventStart.getTime()
  const end = eventEnd.getTime()

  // Terminado el evento, la barra desaparece.
  if (now >= end) return null

  if (now >= start) {
    return (
      <div className="countdown countdown--live" role="timer" aria-label={c.live}>
        <div className="container countdown__inner">
          <span className="countdown__label">
            <span className="countdown__dot" />
            {c.live}
          </span>
        </div>
      </div>
    )
  }

  const t = splitMs(start - now)
  const units: Array<[string, number, string]> = [
    ['d', t.d, c.units.d],
    ['h', t.h, c.units.h],
    ['m', t.m, c.units.m],
    ['s', t.s, c.units.s],
  ]
  const spoken = `${c.label}: ${t.d} días, ${t.h} horas y ${t.m} minutos`

  return (
    <div className="countdown" role="timer" aria-label={spoken}>
      <div className="container countdown__inner">
        <span className="countdown__label">
          <span className="countdown__long">{c.label}</span>
          <span className="countdown__short">{c.labelShort}</span>
        </span>
        <div className="countdown__units" aria-hidden="true">
          {units.map(([key, value, label]) => (
            <span key={key} className="cu">
              <b>{key === 'd' ? value : pad2(value)}</b>
              <i>{label}</i>
            </span>
          ))}
        </div>
        <a className="countdown__cta" href="#inscripcion">
          {content.nav.cta}
        </a>
      </div>
    </div>
  )
}

/** Cronómetro chico que va pegado al formulario: repite la urgencia justo donde se decide. */
export function InlineCountdown() {
  const now = useNow()
  const start = eventStart.getTime()
  if (now >= start) return null

  const t = splitMs(start - now)
  const parts: Array<[keyof typeof c.unitsShort, number]> = [
    ['d', t.d],
    ['h', t.h],
    ['m', t.m],
    ['s', t.s],
  ]

  return (
    <div className="inline-cd" aria-hidden="true">
      <span className="inline-cd__label">{c.label}</span>
      <div className="inline-cd__row">
        {parts.map(([key, value]) => (
          <span key={key} className="inline-cd__part">
            <b>{key === 'd' ? value : pad2(value)}</b>
            <i>{c.unitsShort[key]}</i>
          </span>
        ))}
      </div>
    </div>
  )
}
