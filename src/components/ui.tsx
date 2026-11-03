import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import { content } from '../content'

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`} aria-label="CAEIA">
      <span className="wordmark__cae">CAE</span>
      <span className="wordmark__ia">IA</span>
    </span>
  )
}

export type Organizer = (typeof content.organizers.items)[number]

export function PartnerLogo({ item, eager = false }: { item: Organizer; eager?: boolean }) {
  return (
    <span className={`plate plate--${item.shape}`}>
      <img src={item.logo} alt={item.name} width={item.width} height={item.height} loading={eager ? 'eager' : 'lazy'} />
    </span>
  )
}

/** Barra "Organizan NIKI + FIEL": va arriba de todo y en el pie. */
export function Partners({ eager = false }: { eager?: boolean }) {
  const o = content.organizers
  return (
    <div className="partners">
      <span className="partners__label">{o.label}</span>
      {o.items.map((item, i) => (
        <Fragment key={item.name}>
          {i > 0 && (
            <span className="partners__plus" aria-hidden="true">
              +
            </span>
          )}
          <PartnerLogo item={item} eager={eager} />
        </Fragment>
      ))}
    </div>
  )
}

const PATHS: Record<string, ReactNode> = {
  eye: (
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="m16 11 2 2 4-4" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  message: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
}

export function Icon({ name, size = 22 }: { name: string; size?: number }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  )
}

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true)
          io.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal ${on ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

export function Heading({ kicker, title, intro }: { kicker: string; title: string; intro?: string }) {
  return (
    <div className="heading">
      <p className="kicker">{kicker}</p>
      <h2>{title}</h2>
      {intro && <p className="heading__intro">{intro}</p>}
    </div>
  )
}
