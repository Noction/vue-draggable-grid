const hasWindow = () => typeof window !== 'undefined'

export const addWindowEventListener = (event:string, callback: () => void) => {
  if (!hasWindow) {
    callback()
    return
  }

  window.addEventListener(event, callback)
}

export const removeWindowEventListener = (event:string, callback: () => void) => {
  if (!hasWindow) return

  window.removeEventListener(event, callback)
}
