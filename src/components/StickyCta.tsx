import { content } from '../content'
import { useRegistered } from '../registration'
import { Icon } from './ui'

/**
 * Botón fijo abajo, solo en celular. Se oculta cuando un formulario ya está a la vista.
 * Si la persona ya se anotó, en vez de «Quiero mi lugar» ofrece entrar al grupo de WhatsApp (el único paso que le queda).
 */
export function StickyCta({ visible }: { visible: boolean }) {
  const registered = useRegistered()
  const group = content.event.whatsappGroupUrl
  const joinGroup = Boolean(registered && group)

  return (
    <div className={`sticky ${visible ? 'sticky--on' : ''}`} aria-hidden={!visible}>
      {joinGroup ? (
        <a className="btn btn--block btn--wa" href={group} target="_blank" rel="noreferrer" tabIndex={visible ? 0 : -1}>
          <Icon name="message" size={22} />
          {content.form.success.whatsapp}
        </a>
      ) : (
        <a className="btn btn--block" href="#inscripcion" tabIndex={visible ? 0 : -1}>
          {content.nav.cta}
          <Icon name="arrow" size={20} />
        </a>
      )}
    </div>
  )
}
