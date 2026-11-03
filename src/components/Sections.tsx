import { content } from '../content'
import { address, agendaRows, fill } from '../lib'
import { RegistrationForm } from './RegistrationForm'
import { Heading, Icon, PartnerLogo, Partners, Reveal, Wordmark } from './ui'

const e = content.event

export function Hero() {
  const h = content.hero
  return (
    <header className="hero" id="top">
      <div className="container nav">
        <Partners eager />
      </div>

      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="pill">
            <span className="pill__dot" />
            {h.pill}
          </p>

          <div className="datecard glass glass--blue" aria-label={`${e.weekday} ${e.day} de noviembre`}>
            <span className="datecard__num">{e.day}</span>
            <span className="datecard__side">
              <b>{e.month}</b>
              <small>
                {e.weekday} · {e.year}
              </small>
            </span>
          </div>

          <h1>
            {h.titleBefore}
            <span className="hl">{h.titleHighlight}</span>
          </h1>
          <p className="lead">{h.subtitle}</p>
          <p className="dateline">{h.dateLine}</p>
          <ul className="chips">
            {h.chips.map((c) => (
              <li key={c} className="chip glass">
                {fill(c)}
              </li>
            ))}
          </ul>
          <a className="btn hero__cta" id="hero-cta" href="#inscripcion">
            {content.nav.cta}
            <Icon name="arrow" size={20} />
          </a>
          <div className="presenter">
            <img src={h.presenter.photo} alt={h.presenter.name} width={256} height={256} />
            <div>
              <b>{h.presenter.name}</b>
              <span>{h.presenter.role}</span>
            </div>
          </div>
        </div>

        <figure className="hero__visual">
          <img
            src={h.visual.small}
            srcSet={`${h.visual.small} 780w, ${h.visual.large} 1100w`}
            sizes="(min-width: 1200px) 480px, (min-width: 900px) 520px, 100vw"
            alt={h.visual.alt}
            width={h.visual.width}
            height={h.visual.height}
            fetchPriority="high"
          />
        </figure>
      </div>
    </header>
  )
}

export function Facts() {
  return (
    <section className="section section--tight">
      <div className="container">
        <Reveal>
          <div className="glass glass--blue facts">
            {content.facts.items.map((item) => (
              <div key={item.label} className="fact">
                <span className="fact__icon">
                  <Icon name={item.icon} size={24} />
                </span>
                <b>{fill(item.value)}</b>
                <span className="fact__label">{fill(item.label)}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Problem() {
  const p = content.problem
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div className="glass glass--violet statement">
            <p className="kicker">{p.kicker}</p>
            <h2 className="statement__title">{p.title}</h2>
            {p.paragraphs.map((t) => (
              <p key={t} className="statement__text">
                {t}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function WhatYouSee() {
  const w = content.whatYouSee
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <Heading kicker={w.kicker} title={w.title} intro={w.intro} />
        </Reveal>
        <div className="grid3">
          {w.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 90}>
              <article className="glass card">
                <span className="card__icon">
                  <Icon name={item.icon} size={26} />
                </span>
                <h3>{item.title}</h3>
                <p className="muted">{item.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Steps() {
  const s = content.steps
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <Heading kicker={s.kicker} title={s.title} intro={s.intro} />
        </Reveal>
        <ol className="steps">
          {s.items.map((item, i) => (
            <li key={item.n} className="steps__item">
              <Reveal delay={i * 110}>
                <article className={`glass step ${i === 2 ? 'glass--violet' : 'glass--blue'}`}>
                  <span className="step__title">{item.title}</span>
                  <p className="muted">{item.text}</p>
                </article>
                <div className={`pedestal ${i === 2 ? 'pedestal--violet' : ''}`}>
                  <span>{item.n}</span>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
        <Reveal className="center">
          <a className="btn" href="#inscripcion">
            {s.cta}
            <Icon name="arrow" size={20} />
          </a>
        </Reveal>
      </div>
    </section>
  )
}

export function Agenda() {
  const a = content.agenda
  const { rows, networking, endTime } = agendaRows()
  return (
    <section className="section">
      <div className="container container--narrow">
        <Reveal>
          <Heading kicker={a.kicker} title={a.title} />
        </Reveal>
        <ol className="timeline">
          {rows.map((r, i) => (
            <li key={r.title}>
              <Reveal delay={i * 60}>
                <div className="glass slot">
                  <span className="slot__time">{r.time}</span>
                  <span className="slot__title">{r.title}</span>
                  <span className="slot__min">{r.minutes} min</span>
                </div>
              </Reveal>
            </li>
          ))}
          <li>
            <Reveal delay={rows.length * 60}>
              <div className="glass glass--blue slot slot--net">
                <span className="slot__time">{networking.time}</span>
                <span className="slot__title">{networking.title}</span>
                <span className="slot__min">hasta {endTime}</span>
              </div>
            </Reveal>
          </li>
        </ol>
      </div>
    </section>
  )
}

export function Organizers() {
  const o = content.organizers
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <Heading kicker={o.kicker} title={o.title} />
        </Reveal>
        <div className="orgs">
          {o.items.map((item, i) => (
            <Reveal key={item.name} delay={i * 110}>
              <article className={`glass org ${i === 0 ? 'glass--blue' : 'glass--violet'}`}>
                {item.photo && (
                  <img className="org__photo" src={item.photo.src} alt={item.photo.alt} width={item.photo.width} height={item.photo.height} loading="lazy" />
                )}
                <div className="org__top">
                  <div>
                    <h3>{item.title}</h3>
                    <p className="org__role">{item.role}</p>
                  </div>
                  <PartnerLogo item={item} />
                </div>
                <ul className="points">
                  {item.points.map((p) => (
                    <li key={p}>
                      <span className="points__check">
                        <Icon name="check" size={16} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Closing() {
  const c = content.closing
  return (
    <section className="section">
      <div className="container container--narrow">
        <Reveal>
          <div className="glass glass--violet closing">
            <p className="kicker">{c.kicker}</p>
            <h2>{c.title}</h2>
            <Wordmark className="wordmark--xl" />
            <p className="closing__text">{c.text}</p>
            <p className="closing__tagline">{c.tagline}</p>
            <a className="btn" href="#inscripcion">
              {c.cta}
              <Icon name="arrow" size={20} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Venue() {
  const v = content.venue
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div className="glass venue">
            <div className="venue__map">
              <iframe
                title={`Mapa de ${e.venueShort}, ${address}`}
                src={e.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="venue__info">
              <p className="kicker">{v.kicker}</p>
              <h2>{v.title}</h2>
              <p className="venue__addr">{address}</p>
              <p className="muted">{v.text}</p>
              <a className="btn btn--ghost" href={e.mapsUrl} target="_blank" rel="noreferrer">
                <Icon name="pin" size={20} />
                {v.button}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Faq() {
  const f = content.faq
  return (
    <section className="section">
      <div className="container container--narrow">
        <Reveal>
          <Heading kicker={f.kicker} title={f.title} />
        </Reveal>
        <div className="faq">
          {f.items.map((item) => (
            <details key={item.q} className="glass faq__item">
              <summary>
                <span>{item.q}</span>
                <Icon name="plus" size={20} />
              </summary>
              <p className="muted">{fill(item.a)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Signup() {
  return (
    <section className="section section--signup" id="inscripcion">
      <div className="container container--narrow">
        <Reveal>
          <Heading kicker={content.form.kicker} title="Tu lugar te espera" />
        </Reveal>
        <Reveal>
          <RegistrationForm id="inscripcion-form" />
        </Reveal>
      </div>
    </section>
  )
}

export function Footer() {
  const p = content.privacy
  const contact = [p.contact.whatsapp && `WhatsApp ${p.contact.whatsapp}`, p.contact.email].filter(Boolean).join(' · ')
  return (
    <footer className="footer">
      <div className="container container--narrow">
        <Partners />
        <p className="footer__line">{content.footer.organizer}</p>
        <p className="footer__line">{content.footer.venue}</p>
        <div className="privacy" id={p.id}>
          <h3>{p.title}</h3>
          <p>{p.text}</p>
          {contact && <p>{contact}</p>}
        </div>
      </div>
    </footer>
  )
}
