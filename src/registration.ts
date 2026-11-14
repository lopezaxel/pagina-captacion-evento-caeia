import { useSyncExternalStore } from 'react'

// Estado compartido de «ya se anotó». La página tiene el formulario dos veces (arriba, antes de «Para quién es», y al final):
// cuando la persona se anota en uno, el otro también pasa a mostrar el botón del grupo de WhatsApp (y el botón fijo de celular
// cambia a lo mismo), para que nadie vea un formulario vacío después de haberse anotado.
// `joined` pasa a true cuando toca el botón del grupo: hasta entonces la pantalla completa del grupo (JoinGroupOverlay) no la deja
// seguir navegando (pedido de Axel, 2026-11-14).
// Solo vive en memoria mientras la página está abierta: no se guarda nada en el navegador.

type Registered = { nombre: string; joined: boolean } | null

let registered: Registered = null
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

export function markRegistered(nombre: string) {
  registered = { nombre, joined: false }
  emit()
}

/** La persona tocó el botón de unirse al grupo: ya puede seguir navegando la página. */
export function markJoined() {
  if (!registered || registered.joined) return
  registered = { ...registered, joined: true }
  emit()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Devuelve `{ nombre, joined }` si la persona ya se anotó en esta visita, o `null`. */
export function useRegistered(): Registered {
  return useSyncExternalStore(subscribe, () => registered)
}
