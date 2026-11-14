import { useMemo, useRef, useState, type FormEvent } from 'react'
import { content } from '../content'
import { dateLabel, fill } from '../lib'
import { InlineCountdown } from './CountdownBar'
import { Icon } from './ui'
import { trackLead, trackStep } from '../pixel'
import { markRegistered, useRegistered } from '../registration'

/** Bandera de Argentina simplificada (los emojis de banderas no se ven en Windows). */
function FlagAR() {
  return (
    <svg className="flag" width="22" height="16" viewBox="0 0 22 16" aria-hidden="true">
      <rect width="22" height="16" rx="3" fill="#fff" />
      <path d="M0 3a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v2.4H0Z" fill="#74acdf" />
      <path d="M0 10.6h22V13a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3Z" fill="#74acdf" />
      <circle cx="11" cy="8" r="1.7" fill="#f6b40e" />
    </svg>
  )
}

/**
 * Deja solo el número nacional de 10 dígitos (código de área + número): saca 54, 0, el 9 de WhatsApp y el «15».
 * El «15» es como se escribe el celular en Argentina («387 15 4123456», «0387 15-4123456»): si sobran dígitos y hay un 15 justo
 * después del código de área (3 dígitos como Salta, 4 como Tartagal o 2 como Buenos Aires), se saca en vez de rechazar el número.
 */
function nationalNumber(raw: string): string {
  let d = raw.replace(/\D/g, '')
  if (d.startsWith('54') && d.length > 10) d = d.slice(2)
  if (d.startsWith('0')) d = d.slice(1)
  if (d.startsWith('9') && d.length === 11) d = d.slice(1)
  if (d.length === 12) {
    for (const area of [3, 4, 2]) {
      if (d.startsWith('15', area)) {
        d = d.slice(0, area) + d.slice(area + 2)
        break
      }
    }
  }
  return d
}

type Values = {
  nombre: string
  whatsapp: string
  consent: boolean
  email: string
}
type Errors = Partial<Record<'nombre' | 'whatsapp' | 'email' | 'consent', string>>

const EMPTY: Values = { nombre: '', whatsapp: '', consent: false, email: '' }
const f = content.form
const e = content.event

function validate(v: Values): Errors {
  const errors: Errors = {}
  if (v.nombre.trim().length < 2) errors.nombre = f.errors.nombre
  if (nationalNumber(v.whatsapp).length !== 10) errors.whatsapp = f.errors.whatsapp
  if (!v.email.trim()) {
    if (f.emailRequired) errors.email = f.errors.emailRequired
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) {
    errors.email = f.errors.email
  }
  if (!v.consent) errors.consent = f.errors.consent
  return errors
}

/**
 * Marca la inscripción como hecha y deja la tarjeta de confirmación centrada en pantalla. El formulario es mucho más alto que la
 * confirmación: sin esto, al achicarse la página todo lo de abajo sube y la pantalla «salta» (se vio en un celular real).
 * Salto instantáneo y no animado, para que no se note.
 */
function finishRegistration(nombre: string, id: string) {
  markRegistered(nombre)
  window.requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'center', behavior: 'instant' }))
}

/** Resalta lo que va entre *asteriscos* como con marcador. */
function Marked({ text, cls }: { text: string; cls: string }) {
  return (
    <>
      {text.split(/\*(.+?)\*/g).map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className={cls}>
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  )
}

export function RegistrationForm({ id }: { id: string }) {
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending'>('idle')
  const [sendError, setSendError] = useState('')
  // Si la persona ya se anotó (en este formulario o en el otro de la página), se muestra el botón del grupo de WhatsApp.
  const registered = useRegistered()
  const formRef = useRef<HTMLFormElement>(null)
  const origin = useMemo(() => new URLSearchParams(window.location.search).get('o') ?? '', [])

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  // Al tocar «Quiero mi lugar» con los datos completos la inscripción se envía directo (desde el 2026-11-14 ya no hay cartel
  // de confirmación) y sale la pantalla del grupo de WhatsApp.
  function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const found = validate(values)
    setErrors(found)
    setSendError('')
    if (Object.keys(found).length > 0) return
    trackStep('EnvioFormulario') // Datos completos y válidos: se intenta guardar la inscripción.
    void send()
  }

  async function send() {
    setStatus('sending')

    // Dirección de la función `inscripcion-evento` (ver .env.example). No lleva ninguna clave.
    const endpoint = import.meta.env.VITE_INSCRIPCION_URL as string | undefined
    // Campo trampa anti-bots: las personas no lo ven, así que va vacío.
    const trap = formRef.current ? new FormData(formRef.current).get('website') : ''

    // Sin dirección configurada solo se simula en desarrollo. En la página publicada NUNCA se finge
    // que se guardó: si falta la dirección, se muestra el error y no se pierde una inscripción en silencio.
    if (!endpoint) {
      if (import.meta.env.DEV) {
        console.info('[desarrollo] inscripción simulada (falta VITE_INSCRIPCION_URL)', {
          ...values,
          whatsapp: `+54${nationalNumber(values.whatsapp)}`,
          origen: origin || null,
        })
        window.setTimeout(() => {
          setStatus('idle')
          finishRegistration(values.nombre.trim(), id)
        }, 700)
      } else {
        setSendError(f.errors.send)
        setStatus('idle')
      }
      return
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: values.nombre,
          // Se guarda como +54 + 10 dígitos. Ojo: los links wa.me de Argentina llevan 549 + número.
          whatsapp: `+54${nationalNumber(values.whatsapp)}`,
          email: values.email,
          origen: origin,
          consentimiento: values.consent,
          // Se guarda el texto exacto que la persona aceptó.
          consentimiento_texto: f.consent,
          website: trap ?? '',
        }),
      })
      if (res.ok) {
        trackLead() // Le avisa a Meta que alguien se inscribió (sin datos personales), para medir los anuncios.
        setStatus('idle')
        finishRegistration(values.nombre.trim(), id)
        return
      }
      setSendError(res.status === 429 ? f.errors.tooMany : f.errors.send)
    } catch {
      setSendError(f.errors.send)
    }
    setStatus('idle')
  }

  if (registered) {
    const firstName = registered.nombre.split(/\s+/)[0]
    const s = f.success
    return (
      <div className="glass glass--glow form form--hot form--done" id={id} data-clarity-mask="True">
        <span className="done__icon">
          <Icon name="check" size={28} />
        </span>
        <p className="done__step">{s.lastStep}</p>
        <h3>{fill(s.title, { nombre: firstName })}</h3>
        <p className="done__must">{s.mustJoin}</p>
        {e.whatsappGroupUrl ? (
          <a className="done__wa" href={e.whatsappGroupUrl} target="_blank" rel="noreferrer">
            <span className="done__wa-icon">
              <Icon name="message" size={30} />
            </span>
            <span className="done__wa-text">{s.whatsapp}</span>
            <span className="done__wa-arrow">
              <Icon name="arrow" size={26} />
            </span>
          </a>
        ) : (
          import.meta.env.DEV && <span className="dev-note">[solo en desarrollo] Falta el link del grupo de WhatsApp en content.ts</span>
        )}
        {(e.whatsappGroupUrl || import.meta.env.DEV) && <p className="tiny">{s.whatsappNote}</p>}
        <p className="muted done__when">{fill(s.text, { fecha: dateLabel, lugar: e.venueShort })}</p>
      </div>
    )
  }

  const fid = (name: string) => `${id}-${name}`
  const sending = status === 'sending'

  // OJO: el formulario y la pantalla de confirmación llevan data-clarity-mask="True" para que Microsoft Clarity no grabe
  // lo que se escribe (ver src/clarity.ts). No sacarlo.
  return (
    <form className="glass glass--glow form form--hot" id={id} onSubmit={onSubmit} noValidate ref={formRef} data-clarity-mask="True">
      <div className="form__head">
        <p className="form__badge">{f.badge}</p>
        <h3>{f.title}</h3>
        <p className="muted">{f.subtitle}</p>
      </div>

      <div className="field">
        <label htmlFor={fid('nombre')}>{f.labels.nombre}</label>
        <input
          id={fid('nombre')}
          type="text"
          autoComplete="name"
          placeholder={f.placeholders.nombre}
          value={values.nombre}
          onChange={(ev) => set('nombre', ev.target.value)}
          aria-invalid={!!errors.nombre}
        />
        {errors.nombre && <span className="error">{errors.nombre}</span>}
      </div>

      <div className="field">
        <label htmlFor={fid('whatsapp')}>{f.labels.whatsapp}</label>
        <div className="phone">
          <span className="phone__cc" aria-hidden="true">
            <FlagAR />
            +54
          </span>
          <input
            id={fid('whatsapp')}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder={f.placeholders.whatsapp}
            value={values.whatsapp}
            onChange={(ev) => set('whatsapp', ev.target.value)}
            aria-invalid={!!errors.whatsapp}
            aria-describedby={fid('whatsapp-hint')}
          />
        </div>
        {errors.whatsapp ? (
          <span className="error" id={fid('whatsapp-hint')}>
            {errors.whatsapp}
          </span>
        ) : (
          <span className="hint" id={fid('whatsapp-hint')}>
            {f.hints.whatsapp}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor={fid('email')}>{f.emailRequired ? f.labels.email : f.labels.emailOptional}</label>
        <input
          id={fid('email')}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={f.placeholders.email}
          value={values.email}
          onChange={(ev) => set('email', ev.target.value)}
          aria-invalid={!!errors.email}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="field">
        <label className="check" htmlFor={fid('consent')}>
          <input id={fid('consent')} type="checkbox" checked={values.consent} onChange={(ev) => set('consent', ev.target.checked)} aria-invalid={!!errors.consent} />
          <span>
            {f.consent}{' '}
            <a href={content.legal.privacy.path} target="_blank" rel="noopener noreferrer">
              {f.privacyLink}
            </a>
            {' · '}
            <a href={content.legal.terms.path} target="_blank" rel="noopener noreferrer">
              {f.termsLink}
            </a>
          </span>
        </label>
        {errors.consent && <span className="error">{errors.consent}</span>}
      </div>

      {/* Campo trampa: fuera de pantalla y sin foco; si algo lo completa, es un bot. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor={fid('website')}>No completar</label>
        <input id={fid('website')} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {sendError && (
        <p className="error error--send" role="alert">
          {sendError}
        </p>
      )}

      <button className="btn btn--block btn--submit" type="submit" disabled={sending}>
        {sending ? f.sending : f.submit}
        {!sending && <Icon name="arrow" size={22} />}
      </button>
      <InlineCountdown />
      <p className="reassure">{f.reassurance}</p>
      <aside className="donation">
        <span className="donation__icon">
          <Icon name="heart" size={24} />
        </span>
        <div>
          <p className="donation__label">{f.donation.label}</p>
          <p className="donation__text">
            <Marked text={f.donation.text} cls="donation__em" />
          </p>
        </div>
      </aside>
    </form>
  )
}
