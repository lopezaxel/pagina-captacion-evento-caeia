import { content } from '../content'
import { Icon } from './ui'

/** Botón fijo abajo, solo en celular. Se oculta cuando el formulario ya está a la vista. */
export function StickyCta({ visible }: { visible: boolean }) {
  return (
    <div className={`sticky ${visible ? 'sticky--on' : ''}`} aria-hidden={!visible}>
      <a className="btn btn--block" href="#inscripcion" tabIndex={visible ? 0 : -1}>
        {content.nav.cta}
        <Icon name="arrow" size={20} />
      </a>
    </div>
  )
}
