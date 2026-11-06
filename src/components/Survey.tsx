import { useEffect, useRef, useState, type FormEvent } from 'react'
import { content } from '../content'
import { Icon } from './ui'

const s = content.survey

type Question = { id: string; label: string; options?: string[]; placeholder?: string }

// Las preguntas de opciones y, al final, la abierta (texto libre).
const QUESTIONS: Question[] = [...s.questions, { id: s.open.id, label: s.open.label, placeholder: s.open.placeholder }]
const LAST = QUESTIONS.length - 1
/** Tiempo que se ve la opción elegida antes de pasar sola a la pregunta siguiente. */
const ADVANCE_MS = 320

/** Encuesta opcional de la pantalla de confirmación, como carrusel: una pregunta por vez. Todo el texto vive en content.survey. */
export function Survey({ token }: { token: string | null }) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')
  const timer = useRef<number | undefined>(undefined)
  const stage = useRef<HTMLDivElement>(null)
  const moved = useRef(false)

  const hasAnswer = Object.values(answers).some((v) => v.trim() !== '')
  const q = QUESTIONS[step]
  const set = (id: string, value: string) => setAnswers((prev) => ({ ...prev, [id]: value }))

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Al cambiar de pregunta, el foco pasa al contenedor para que los lectores de pantalla anuncien la nueva pregunta.
  useEffect(() => {
    if (moved.current) stage.current?.focus({ preventScroll: true })
    moved.current = true
  }, [step])

  const go = (next: number) => {
    window.clearTimeout(timer.current)
    setStep(Math.max(0, Math.min(LAST, next)))
  }

  function choose(id: string, option: string) {
    set(id, option)
    window.clearTimeout(timer.current)
    if (step < LAST) timer.current = window.setTimeout(() => setStep((st) => Math.min(LAST, st + 1)), ADVANCE_MS)
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    if (!hasAnswer || status === 'sending') return
    setStatus('sending')
    setError('')

    // La dirección de la función de la encuesta se deduce de la de inscripción (o se fija con VITE_ENCUESTA_URL).
    const base = import.meta.env.VITE_INSCRIPCION_URL as string | undefined
    const endpoint = (import.meta.env.VITE_ENCUESTA_URL as string | undefined) ?? base?.replace(/inscripcion-evento$/, 'encuesta-evento')
    const trap = new FormData(ev.currentTarget).get('website')

    // Sin dirección o sin código solo se simula en desarrollo; en la página publicada nunca se finge que se guardó.
    if (!endpoint || !token) {
      if (import.meta.env.DEV) {
        console.info('[desarrollo] encuesta simulada', answers)
        window.setTimeout(() => setStatus('done'), 500)
      } else {
        setError(s.error)
        setStatus('idle')
      }
      return
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...answers, website: trap ?? '' }),
      })
      if (res.ok) {
        setStatus('done')
        return
      }
    } catch {
      /* se muestra el mismo mensaje de error */
    }
    setError(s.error)
    setStatus('idle')
  }

  if (status === 'done') {
    return (
      <div className="survey survey--done" role="status">
        <span className="survey__ok">
          <Icon name="check" size={20} />
        </span>
        <p>{s.thanks}</p>
      </div>
    )
  }

  const sending = status === 'sending'
  const progress = s.progress.replace('{n}', String(step + 1)).replace('{total}', String(QUESTIONS.length))

  return (
    <form className="survey" onSubmit={onSubmit} noValidate>
      <h4>{s.title}</h4>
      {step === 0 && (
        <>
          <p className="survey__intro">{s.intro}</p>
          <p className="tiny">{s.note}</p>
        </>
      )}

      <div className="survey__bar" role="progressbar" aria-valuemin={1} aria-valuemax={QUESTIONS.length} aria-valuenow={step + 1} aria-label={progress}>
        {QUESTIONS.map((item, i) => (
          <span key={item.id} className={i <= step ? 'is-on' : ''} />
        ))}
      </div>
      <p className="survey__count">{progress}</p>

      <div className="survey__stage" key={q.id} ref={stage} tabIndex={-1} aria-live="polite">
        {q.options ? (
          <fieldset className="survey__q">
            <legend>{q.label}</legend>
            <div className="survey__opts">
              {q.options.map((opt) => (
                <label key={opt} className={`survey__opt${answers[q.id] === opt ? ' is-on' : ''}`}>
                  <input type="radio" name={q.id} value={opt} checked={answers[q.id] === opt} onChange={() => choose(q.id, opt)} />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : (
          <div className="survey__q">
            <label htmlFor="survey-open" className="survey__legend">
              {q.label}
            </label>
            <textarea
              id="survey-open"
              rows={4}
              maxLength={500}
              placeholder={q.placeholder}
              value={answers[q.id] ?? ''}
              onChange={(ev) => set(q.id, ev.target.value)}
            />
          </div>
        )}
      </div>

      {/* Campo trampa anti-bots: fuera de pantalla y sin foco. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="survey-website">No completar</label>
        <input id="survey-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <p className="error error--send" role="alert">
          {error}
        </p>
      )}

      {step === LAST ? (
        <>
          <button className="btn btn--block" type="submit" disabled={!hasAnswer || sending}>
            {sending ? s.sending : s.submit}
          </button>
          {!hasAnswer && <p className="tiny survey__privacy">{s.needOne}</p>}
        </>
      ) : null}

      <div className="survey__nav">
        {step > 0 ? (
          <button type="button" className="survey__link" onClick={() => go(step - 1)}>
            ← {s.back}
          </button>
        ) : (
          <span />
        )}
        {step < LAST && (
          <button type="button" className="survey__link" onClick={() => go(step + 1)}>
            {s.skip} →
          </button>
        )}
      </div>

      <p className="tiny survey__privacy">{s.privacy}</p>
    </form>
  )
}
