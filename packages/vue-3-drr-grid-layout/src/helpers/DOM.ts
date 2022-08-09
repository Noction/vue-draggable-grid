const hasWindow = () => typeof window !== 'undefined'

export const addWindowEventListener = (event:string, callback: () => void) => {
  if (!hasWindow) return callback()

  window.addEventListener(event, callback)
}

export const removeWindowEventListener = (event:string, callback: () => void) => {
  if (!hasWindow) return

  window.removeEventListener(event, callback)
}
