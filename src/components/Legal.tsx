import { useEffect } from 'react'
import { content } from '../content'
import { contactLine, fill } from '../lib'
import { Backdrop, Partners } from './ui'

export type LegalDoc = 'privacy' | 'terms'

type Section = { h: string; p?: string[]; list?: string[]; legend?: boolean }

/** Página legal (política de privacidad o términos). Todo el texto vive en content.legal. */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  const l = content.legal
  const d = l[doc]
  const other: LegalDoc = doc === 'privacy' ? 'terms' : 'privacy'

  useEffect(() => {
    const prev = document.title
    document.title = d.pageTitle
    window.scrollTo(0, 0)
    return () => {
      document.title = prev
    }
  }, [d.pageTitle])

  const sections: Section[] = d.sections
  const text = (t: string) => fill(t, { contacto: contactLine() })

  return (
    <>
      <Backdrop />
      <div className="container container--narrow legal__top">
        <a className="legal__back" href="/">
          ← {l.backToEvent}
        </a>
        <Partners eager />
      </div>
      <main className="container container--narrow legal">
        <article className="glass legal__card">
          <h1>{d.title}</h1>
          <p className="legal__updated">Última actualización: {l.updated}</p>
          <p className="legal__intro">{text(d.intro)}</p>
          {sections.map((sec, i) => (
            <section key={sec.h} className="legal__sec">
              <h2>
                <span className="legal__n">{i + 1}</span>
                {sec.h}
              </h2>
              {sec.list && (
                <ul className="legal__list">
                  {sec.list.map((li) => (
                    <li key={li}>{text(li)}</li>
                  ))}
                </ul>
              )}
              {sec.p?.map((para) => (
                <p key={para}>{text(para)}</p>
              ))}
              {sec.legend && <p className="legal__legend">{content.privacy.legend}</p>}
            </section>
          ))}
          <p className="legal__other">
            <a href={l[other].path}>{l.otherDocs[other]} →</a>
          </p>
        </article>
      </main>
    </>
  )
}
