import { content } from './content'

const e = content.event
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

export const pad = (n: number) => String(n).padStart(2, '0')

export function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number)
  const t = h * 60 + m + mins
  return `${pad(Math.floor(t / 60) % 24)}:${pad(t % 60)}`
}

export const seminarMinutes = content.agenda.items.reduce((sum, i) => sum + i.minutes, 0)
export const totalMinutes = seminarMinutes + content.agenda.networking.minutes
export const address = `${e.street}, ${e.city}`

// Salta no usa horario de verano: el offset es siempre -03:00. Se usa para el cronómetro.
export const eventStart = new Date(`${e.dateISO}T${e.startTime}:00-03:00`)
export const eventEnd = new Date(eventStart.getTime() + totalMinutes * 60_000)

const [, monthStr, dayStr] = e.dateISO.split('-')
export const dateLabel = `${e.weekday.toLowerCase()} ${Number(dayStr)} de ${MONTHS[Number(monthStr) - 1]}`

/** Parte una cantidad de milisegundos en días, horas, minutos y segundos. */
export function splitMs(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  return {
    d: Math.floor(total / 86400),
    h: Math.floor((total % 86400) / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  }
}

/** Reemplaza {hora}, {direccion}, {duracion}, {minutos}, {fecha} y los extras que se pasen. */
export function fill(text: string, extra: Record<string, string> = {}): string {
  const vars: Record<string, string> = {
    hora: e.startTime,
    direccion: address,
    duracion: `unos ${seminarMinutes} minutos`,
    minutos: String(seminarMinutes),
    fecha: dateLabel,
    ...extra,
  }
  return text.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? `{${k}}`)
}

export function agendaRows() {
  let t = e.startTime
  const rows = content.agenda.items.map((item) => {
    const row = { ...item, time: t }
    t = addMinutes(t, item.minutes)
    return row
  })
  const networking = { ...content.agenda.networking, time: t }
  return { rows, networking, endTime: addMinutes(t, content.agenda.networking.minutes) }
}

export function calendarUrl(): string {
  const day = e.dateISO.replace(/-/g, '')
  const start = `${day}T${e.startTime.replace(':', '')}00`
  const end = `${day}T${addMinutes(e.startTime, totalMinutes).replace(':', '')}00`
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${content.hero.titleBefore}${content.hero.titleHighlight}`,
    dates: `${start}/${end}`,
    ctz: e.timezone,
    location: `${e.venueName}, ${address}`,
    details: 'Seminario gratuito de IA para negocios y lanzamiento de CAEIA.',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function eventJsonLd(origin: string) {
  const end = addMinutes(e.startTime, totalMinutes)
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${content.hero.titleBefore}${content.hero.titleHighlight}`,
    description: content.hero.subtitle,
    startDate: `${e.dateISO}T${e.startTime}:00-03:00`,
    endDate: `${e.dateISO}T${end}:00-03:00`,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    isAccessibleForFree: true,
    inLanguage: 'es-AR',
    location: {
      '@type': 'Place',
      name: e.venueName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: e.street,
        addressLocality: e.city,
        addressRegion: 'Salta',
        addressCountry: 'AR',
      },
    },
    organizer: content.organizers.items.map((o) => ({ '@type': 'Organization', name: o.name })),
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'ARS', availability: 'https://schema.org/InStock', url: origin },
  }
}
