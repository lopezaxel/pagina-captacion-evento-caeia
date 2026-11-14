import { content } from '../content'
import { useRegistered } from '../registration'
import { Icon } from './ui'

/**
 * Botón fijo abajo, solo en celular y tablet (en escritorio ya está el botón del cronómetro fijo arriba). Está a la vista todo el
 * tiempo mientras se scrollea y lleva directo al formulario (`#inscripcion`); solo se oculta cuando un formulario ya está en pantalla.
 * Es llamativo a propósito (pedido de Axel, 2026-11-14): grande, con destello y una pulsación suave.
 * Si la persona ya se anotó, en vez de «Quiero mi lugar» ofrece entrar al grupo de WhatsApp (el único paso que le queda).
 */
export function StickyCta({ visible }: { visible: boolean }) {
  const registered = useRegistered()
  const group = content.event.whatsappGroupUrl
  const joinGroup = Boolean(registered && group)

  return (
    <div className={`sticky ${visible ? 'sticky--on' : ''}`} aria-hidden={!visible}>
      {joinGroup ? (
        <a className="btn btn--block btn--wa btn--sticky" href={group} target="_blank" rel="noreferrer" tabIndex={visible ? 0 : -1}>
          <Icon name="message" size={24} />
          {content.form.success.whatsapp}
        </a>
      ) : (
        <a className="btn btn--block btn--submit btn--sticky" href="#inscripcion" tabIndex={visible ? 0 : -1}>
          {content.nav.cta}
          <Icon name="arrow" size={22} />
        </a>
      )}
    </div>
  )
}
