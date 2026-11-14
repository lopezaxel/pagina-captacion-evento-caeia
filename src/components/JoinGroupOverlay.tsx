import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { content } from '../content'
import { dateLabel, fill } from '../lib'
import { markJoined, useRegistered } from '../registration'
import { Icon } from './ui'

/**
 * Pantalla completa que sale apenas se guarda la inscripción (pedido de Axel, 2026-11-14): muestra el botón para unirse al grupo
 * de WhatsApp y NO deja seguir navegando la página hasta que la persona lo toca. No tiene botón de cerrar ni se cierra con
 * Escape o tocando afuera; al tocar el botón se abre WhatsApp y la pantalla se va (la persona vuelve a ver la página).
 *
 * Detalles:
 *  - Se dibuja fuera de #root (portal al body) y se marca #root como `inert`: así no se puede tocar, ni llegar con Tab, a lo de atrás.
 *  - El botón es el mismo `.done__wa` de la tarjeta de confirmación, así el píxel lo cuenta como `ClicGrupoWhatsApp`.
 *  - Lleva data-clarity-mask: Clarity no graba el nombre.
 *  - Si no hay link del grupo cargado (`event.whatsappGroupUrl`), no se muestra (no habría nada que tocar).
 */
export function JoinGroupOverlay() {
  const registered = useRegistered()
  const group = content.event.whatsappGroupUrl
  const open = Boolean(registered && !registered.joined && group)
  const button = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!open) return
    const root = document.getElementById('root')
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    root?.setAttribute('inert', '')
    button.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      root?.removeAttribute('inert')
    }
  }, [open])

  if (!open || !registered) return null

  const s = content.form.success
  const firstName = registered.nombre.split(/\s+/)[0]

  return createPortal(
    <div className="join" role="dialog" aria-modal="true" aria-labelledby="join-title" data-clarity-mask="True">
      <div className="join__box">
        <span className="done__icon">
          <Icon name="check" size={28} />
        </span>
        <p className="done__step">{s.lastStep}</p>
        <h2 id="join-title">{fill(s.title, { nombre: firstName })}</h2>
        <p className="done__must">{s.mustJoin}</p>
        <a ref={button} className="done__wa" href={group} target="_blank" rel="noreferrer" onClick={markJoined}>
          <span className="done__wa-icon">
            <Icon name="message" size={30} />
          </span>
          <span className="done__wa-text">{s.whatsapp}</span>
          <span className="done__wa-arrow">
            <Icon name="arrow" size={26} />
          </span>
        </a>
        <p className="join__hint">{s.overlayHint}</p>
        <p className="tiny">{s.whatsappNote}</p>
        <p className="muted done__when">{fill(s.text, { fecha: dateLabel, lugar: content.event.venueShort })}</p>
      </div>
    </div>,
    document.body,
  )
}
