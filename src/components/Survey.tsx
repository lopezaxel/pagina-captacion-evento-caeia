import { useState, type FormEvent } from 'react'
import { content } from '../content'
import { Icon } from './ui'

const s = content.survey

/** Encuesta opcional que aparece en la pantalla de confirmación. Todo el texto vive en content.survey. */
export function Survey({ token }: { token: string | null }) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')

  const hasAnswer = Object.values(answers).some((v) => v.trim() !== '')
  const set = (id: string, value: string) => setAnswers((prev) => ({ ...prev, [id]: value }))

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

  return (
    <form className="survey" onSubmit={onSubmit} noValidate>
      <h4>{s.title}</h4>
      <p className="survey__intro">{s.intro}</p>
      <p className="tiny">{s.note}</p>

      {s.questions.map((q) => (
        <fieldset key={q.id} className="survey__q">
          <legend>{q.label}</legend>
          <div className="survey__opts">
            {q.options.map((opt) => (
              <label key={opt} className={`survey__opt${answers[q.id] === opt ? ' is-on' : ''}`}>
                <input type="radio" name={q.id} value={opt} checked={answers[q.id] === opt} onChange={() => set(q.id, opt)} />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      <div className="survey__q">
        <label htmlFor="survey-open" className="survey__legend">
          {s.open.label}
        </label>
        <textarea
          id="survey-open"
          rows={3}
          maxLength={500}
          placeholder={s.open.placeholder}
          value={answers[s.open.id] ?? ''}
          onChange={(ev) => set(s.open.id, ev.target.value)}
        />
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
      <button className="btn btn--block" type="submit" disabled={!hasAnswer || sending}>
        {sending ? s.sending : s.submit}
      </button>
      <p className="tiny survey__privacy">{s.privacy}</p>
    </form>
  )
}
