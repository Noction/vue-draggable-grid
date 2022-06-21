export function createCoreData (lastX: number, lastY: number, x: number, y: number) {
  // State changes are often (but not always!) async. We want the latest value.
  const isStart = !isNum(lastX)

  if (isStart) {
    // If this is our first move, use the x and y as last coords.
    return {
      deltaX: 0, deltaY: 0,
      lastX: x, lastY: y,
      x, y
    }
  } else {
    // Otherwise calculate proper values.
    return {
      deltaX: x - lastX, deltaY: y - lastY,
      lastX, lastY,
      x, y
    }
  }
}

export function getControlPosition (e: any) {
  return offsetXYFromParentOf(e)
}

export function offsetXYFromParentOf (evt: any) {
  const offsetParent = evt.target.offsetParent || document.body
  const offsetParentRect = evt.offsetParent === document.body ? { left: 0, top: 0 } : offsetParent.getBoundingClientRect()

  const x = evt.clientX + offsetParent.scrollLeft - offsetParentRect.left
  const y = evt.clientY + offsetParent.scrollTop - offsetParentRect.top

  return { x, y }
}

function isNum (num: any)  {
  return typeof num === 'number' && !isNaN(num)
}
