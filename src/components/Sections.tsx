import { content } from '../content'
import { address, agendaRows, fill } from '../lib'
import { RegistrationForm } from './RegistrationForm'
import { Heading, Icon, PartnerLogo, Partners, Reveal, Rich, Wordmark } from './ui'

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
            <span>
              {h.pill.before}
              <b>{h.pill.highlight}</b>
            </span>
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
              <li key={c.text} className="chip glass">
                <Icon name={c.icon} size={17} />
                {fill(c.text)}
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

export function ForYou() {
  const f = content.forYou
  return (
    <section className="section section--light">
      <div className="container">
        <Reveal>
          <div className="glass glass--violet foryou">
            <Heading kicker={f.kicker} title={f.title} intro={f.intro} />
            <div className="foryou__groups">
              {f.groups.map((g) => (
                <div key={g.label}>
                  <p className="foryou__label">{g.label}</p>
                  <ul className="tags">
                    {g.items.map((item) => (
                      <li key={item.text} className={`tag tag--${g.tone}${item.open ? ' tag--open' : ''}`}>
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/** Gráfico animado: una semana donde las mismas tareas vuelven a aparecer cada día, con un reloj que gira rápido. */
function LoopVisual() {
  const p = content.problem
  return (
    <div className="loopviz" role="img" aria-label={p.visual.caption}>
      <div className="loopviz__top">
        <svg className="loopviz__clock" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="44" className="loopviz__face" />
          <path d="M50 10v7M90 50h-7M50 90v-7M10 50h7" className="loopviz__ticks" />
          <line x1="50" y1="50" x2="50" y2="29" className="loopviz__hand loopviz__hand--hour" />
          <line x1="50" y1="50" x2="50" y2="16" className="loopviz__hand loopviz__hand--min" />
          <circle cx="50" cy="50" r="3.5" className="loopviz__pin" />
        </svg>
        <p className="loopviz__caption">{p.visual.caption}</p>
      </div>
      <div className="loopviz__week" aria-hidden="true">
        {p.visual.days.map((d, i) => (
          <div key={d} className="loopviz__day">
            <b className="loopviz__label">{d}</b>
            {p.items.map((t, j) => (
              <span key={t} className="loopviz__block" style={{ '--i': i, '--j': j } as React.CSSProperties} />
            ))}
          </div>
        ))}
      </div>
    </div>
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
            <h2 className="statement__title">
              <Rich text={p.title} />
            </h2>
            <div className="statement__grid">
              <div className="statement__copy">
                <ul className="crosses">
                  {p.items.map((item) => (
                    <li key={item} className="cross">
                      <span className="cross__x">
                        <Icon name="x" size={16} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <LoopVisual />
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <aside className="callout">
            <p>
              {p.callout.split(/\*(.+?)\*/g).map((part, i) =>
                i % 2 === 1 ? (
                  <strong key={i} className="callout__em">
                    {part}
                  </strong>
                ) : (
                  part
                ),
              )}
            </p>
          </aside>
        </Reveal>
      </div>
    </section>
  )
}

export function WhatYouSee() {
  const w = content.whatYouSee
  return (
    <section className="section section--light">
      <div className="container">
        <Reveal>
          <Heading kicker={w.kicker} title={w.title} intro={w.intro} />
        </Reveal>
        <div className="grid3">
          {w.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 90}>
              <article className={`glass show${item.featured ? ' show--featured' : ''}`}>
                <div className="show__top">
                  <span className="show__icon">
                    <Icon name={item.icon} size={26} />
                  </span>
                  <span className="show__n">{item.n}</span>
                </div>
                {item.tag && <span className="show__tag">{item.tag}</span>}
                <h3>{item.title}</h3>
                <p className="muted">{item.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="center">
          <a className="btn" href="#inscripcion">
            {w.cta}
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
                <div className={`glass slot${r.break ? ' slot--break' : ''}${r.featured ? ' slot--featured' : ''}`}>
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
                {item.photo &&
                  (item.photo.panel ? (
                    <div className="org__photo org__photo--logo">
                      <img src={item.photo.src} alt={item.photo.alt} width={item.photo.width} height={item.photo.height} loading="lazy" />
                    </div>
                  ) : (
                    <img className="org__photo" src={item.photo.src} alt={item.photo.alt} width={item.photo.width} height={item.photo.height} loading="lazy" />
                  ))}
                <div className="org__top">
                  <div>
                    <h3>{item.title}</h3>
                    <p className="org__role">{item.role}</p>
                  </div>
                  {/* Si el logo ya va grande arriba, no se repite la plaquita chica. */}
                  {!item.photo?.panel && <PartnerLogo item={item} />}
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
      <div className="container">
        <Reveal>
          <div className="glass glass--violet closing">
            <p className="kicker">{c.kicker}</p>
            <h2>{c.title}</h2>
            <Wordmark className="wordmark--xl" />
            <p className="closing__text">{c.text}</p>
            <p className="closing__tagline">{c.tagline}</p>
            <a className="btn btn--lg" href="#inscripcion">
              {c.cta}
              <Icon name="arrow" size={22} />
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
              <h2>
                <Rich text={v.title} />
              </h2>
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
    <section className="section section--signup section--light" id="inscripcion">
      <div className="container container--narrow">
        <Reveal>
          <Heading kicker={content.form.kicker} title={content.form.sectionTitle} />
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
  const l = content.legal
  return (
    <footer className="footer">
      <div className="container container--narrow">
        <Partners />
        <p className="footer__line">{content.footer.organizer}</p>
        <p className="footer__line">{content.footer.venue}</p>
        <div className="privacy" id={p.id}>
          <h3>{p.title}</h3>
          <p>{p.text}</p>
          <p className="privacy__legend">{p.legend}</p>
          <p className="privacy__links">
            <a href={l.privacy.path}>{l.otherDocs.privacy}</a>
            <span aria-hidden="true"> · </span>
            <a href={l.terms.path}>{l.otherDocs.terms}</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
