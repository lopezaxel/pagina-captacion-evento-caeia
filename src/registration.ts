import { useSyncExternalStore } from 'react'

// Estado compartido de «ya se anotó». La página tiene el formulario dos veces (arriba, antes de «Para quién es», y al final):
// cuando la persona se anota en uno, el otro también pasa a mostrar el botón del grupo de WhatsApp (y el botón fijo de celular
// cambia a lo mismo), para que nadie vea un formulario vacío después de haberse anotado.
// Solo vive en memoria mientras la página está abierta: no se guarda nada en el navegador.

type Registered = { nombre: string } | null

let registered: Registered = null
const listeners = new Set<() => void>()

export function markRegistered(nombre: string) {
  registered = { nombre }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Devuelve `{ nombre }` si la persona ya se anotó en esta visita, o `null`. */
export function useRegistered(): Registered {
  return useSyncExternalStore(subscribe, () => registered)
}
