import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { content } from '../content'
import { dateLabel, fill } from '../lib'
import { InlineCountdown } from './CountdownBar'
import { Icon } from './ui'
import { trackLead, trackStep } from '../pixel'

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

/** Deja solo el número nacional de 10 dígitos (código de área + número): saca 54, 0 y el 9 de WhatsApp. */
function nationalNumber(raw: string): string {
  let d = raw.replace(/\D/g, '')
  if (d.startsWith('54') && d.length > 10) d = d.slice(2)
  if (d.startsWith('0')) d = d.slice(1)
  if (d.startsWith('9') && d.length === 11) d = d.slice(1)
  return d
}

type Values = {
  nombre: string
  whatsapp: string
  tipo: string
  consent: boolean
  email: string
}
type Errors = Partial<Record<'nombre' | 'whatsapp' | 'tipo' | 'email' | 'consent', string>>

const EMPTY: Values = { nombre: '', whatsapp: '', tipo: '', consent: false, email: '' }
const f = content.form
const e = content.event

function validate(v: Values): Errors {
  const errors: Errors = {}
  if (v.nombre.trim().length < 2) errors.nombre = f.errors.nombre
  if (nationalNumber(v.whatsapp).length !== 10) errors.whatsapp = f.errors.whatsapp
  if (!v.tipo) errors.tipo = f.errors.tipo
  if (!v.email.trim()) {
    if (f.emailRequired) errors.email = f.errors.emailRequired
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) {
    errors.email = f.errors.email
  }
  if (!v.consent) errors.consent = f.errors.consent
  return errors
}

export function RegistrationForm({ id }: { id: string }) {
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [sendError, setSendError] = useState('')
  // Cartel «¡Atención!» que se muestra antes de enviar: solo se envía si la persona confirma que va a asistir.
  const [confirming, setConfirming] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const origin = useMemo(() => new URLSearchParams(window.location.search).get('o') ?? '', [])

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  // Al tocar «Quiero mi lugar» solo se valida: el envío real pasa cuando confirman en el cartel.
  function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const found = validate(values)
    setErrors(found)
    setSendError('')
    if (Object.keys(found).length > 0) return
    trackStep('CartelAtencion') // Llegó al cartel «¡Atención!» (datos completos), todavía sin confirmar.
    setConfirming(true)
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
          setConfirming(false)
          setStatus('done')
        }, 700)
      } else {
        setSendError(f.errors.send)
        setConfirming(false)
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
          tipo: values.tipo,
          origen: origin,
          consentimiento: values.consent,
          // Se guarda el texto exacto que la persona aceptó.
          consentimiento_texto: f.consent,
          website: trap ?? '',
        }),
      })
      if (res.ok) {
        trackLead() // Le avisa a Meta que alguien se inscribió (sin datos personales), para medir los anuncios.
        setConfirming(false)
        setStatus('done')
        return
      }
      setSendError(res.status === 429 ? f.errors.tooMany : f.errors.send)
    } catch {
      setSendError(f.errors.send)
    }
    // Si falló, se cierra el cartel para que el error se vea sobre el botón del formulario.
    setConfirming(false)
    setStatus('idle')
  }

  if (status === 'done') {
    const firstName = values.nombre.trim().split(/\s+/)[0]
    const s = f.success
    return (
      <div className="glass glass--glow form form--done" id={id}>
        <span className="done__icon">
          <Icon name="check" size={28} />
        </span>
        <h3>{fill(s.title, { nombre: firstName })}</h3>
        <p className="muted">{fill(s.text, { fecha: dateLabel, lugar: e.venueShort })}</p>
        <p className="done__must">{s.mustJoin}</p>
        <div className="done__actions">
          {e.whatsappGroupUrl ? (
            <a className="btn btn--lg" href={e.whatsappGroupUrl} target="_blank" rel="noreferrer">
              <Icon name="message" size={22} />
              {s.whatsapp}
            </a>
          ) : (
            import.meta.env.DEV && (
              <span className="dev-note">[solo en desarrollo] Falta el link del grupo de WhatsApp en content.ts</span>
            )
          )}
        </div>
        {(e.whatsappGroupUrl || import.meta.env.DEV) && <p className="tiny">{s.whatsappNote}</p>}
      </div>
    )
  }

  const fid = (name: string) => `${id}-${name}`
  const sending = status === 'sending'

  return (
    <>
    <form className="glass glass--glow form" id={id} onSubmit={onSubmit} noValidate ref={formRef}>
      <div className="form__head">
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
        <label htmlFor={fid('tipo')}>{f.labels.tipo}</label>
        <select id={fid('tipo')} value={values.tipo} onChange={(ev) => set('tipo', ev.target.value)} aria-invalid={!!errors.tipo}>
          <option value="">Elegí una opción</option>
          {f.tipos.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        {errors.tipo && <span className="error">{errors.tipo}</span>}
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

      <button className="btn btn--block" type="submit" disabled={sending}>
        {sending ? f.sending : f.submit}
        {!sending && <Icon name="arrow" size={20} />}
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
    {confirming && <ConfirmDialog sending={sending} onYes={send} onNo={() => { trackStep('CartelNoIre'); setConfirming(false) }} />}
    </>
  )
}

/** Resalta lo que va entre *asteriscos* como con marcador (en el cartel no sirve el degradé de los títulos). */
function Marked({ text, cls = 'modal__em' }: { text: string; cls?: string }) {
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

/** Cartel «¡Atención!» por encima de todo el formulario: «SÍ VOY A ASISTIR» envía la inscripción, «OK, no iré» la cancela. */
function ConfirmDialog({ sending, onYes, onNo }: { sending: boolean; onYes: () => void; onNo: () => void }) {
  const c = f.confirm
  const box = useRef<HTMLDivElement>(null)
  // Se guardan en refs para que el efecto de abajo corra una sola vez (si no, cada render volvería a mover el foco).
  const sendingRef = useRef(sending)
  const onNoRef = useRef(onNo)
  sendingRef.current = sending
  onNoRef.current = onNo

  useEffect(() => {
    // El foco va al cartel (no a un botón), para que un Enter o un espacio de más no confirme sin querer.
    box.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape' && !sendingRef.current) onNoRef.current()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [])

  return createPortal(
    <div
      className="modal"
      onMouseDown={(ev) => {
        if (ev.target === ev.currentTarget && !sending) onNo()
      }}
    >
      <div className="modal__box" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-text" tabIndex={-1} ref={box}>
        <span className="modal__icon">
          <Icon name="alert" size={32} />
        </span>
        <h3 id="confirm-title">{c.title}</h3>
        <p id="confirm-text" className="modal__text">
          <Marked text={c.text} />
        </p>
        <div className="modal__actions">
          <button type="button" className="btn btn--lg" onClick={onYes} disabled={sending}>
            {sending ? c.sending : c.yes}
          </button>
          <button type="button" className="btn btn--ghost" onClick={onNo} disabled={sending}>
            {c.no}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
