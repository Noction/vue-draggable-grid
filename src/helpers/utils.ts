export const IS_UNITLESS = {
  animationIterationCount: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  fillOpacity: true,
  flex: true,
  flexGrow: true,
  flexNegative: true,
  flexOrder: true,
  flexPositive: true,
  flexShrink: true,
  fontWeight: true,
  gridColumn: true,
  gridRow: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  stopOpacity: true,
  strokeDashoffset: true,
  strokeOpacity: true,
  strokeWidth: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true
}

export type Layout = LayoutItem[]

export type LayoutItem = LayoutItemRequired &
  {minW?: number, minH?: number, maxW?: number, maxH?: number,
    moved?: boolean, static?: boolean,
    isDraggable?: boolean, isResizable?: boolean}

export type LayoutItemRequired = {w: number, h: number, x: number, y: number, i: string}

export type Size = {width: number, height: number}

export function addPx (name: string, value: any | number) {
  if (typeof value === 'number' && !IS_UNITLESS[ name ]) {
    return `${value}px`
  } else {
    return value
  }
}

export function autoBindHandlers (el: any, fns: Array<string>): void {
  fns.forEach(key => el[key] = el[key].bind(el))

}

export function bottom (layout: Layout): number {
  let max = 0

  let bottomY: number

  for (let i = 0, len = layout.length; i < len; i++) {

    bottomY = layout[i].y + layout[i].h
    if (bottomY > max) {
      max = bottomY
    }

  }
  return max

}

export function cloneLayout (layout: Layout): Layout {
  const newLayout = Array(layout.length)

  for (let i = 0, len = layout.length; i < len; i++) {
    newLayout[i] = cloneLayoutItem(layout[i])
  }
  return newLayout
}
// Fast path to cloning, since this is monomorphic
export function cloneLayoutItem (layoutItem: LayoutItem): LayoutItem {
  return JSON.parse(JSON.stringify(layoutItem))

}
export function collides (l1: LayoutItem, l2: LayoutItem): boolean {
  if (l1 === l2) return false // same element
  if (l1.x + l1.w <= l2.x) return false // l1 is left of l2
  if (l1.x >= l2.x + l2.w) return false // l1 is right of l2
  if (l1.y + l1.h <= l2.y) return false // l1 is above l2
  if (l1.y >= l2.y + l2.h) return false // l1 is below l2
  return true // boxes overlap

}
export function compact (layout: Layout, verticalCompact: boolean): Layout {
  // Statics go in the compareWith array right away so items flow around them.
  const compareWith = getStatics(layout)
  // We go through the items by row and column.
  const sorted = sortLayoutItemsByRowCol(layout)
  // Holding for new items.

  const out = Array(layout.length)

  for (let i = 0, len = sorted.length; i < len; i++) {

    let l = sorted[i]
    // Don't move static elements

    if (!l.static) {

      l = compactItem(compareWith, l, verticalCompact)
      // Add to comparison array. We only collide with items before this one.
      // Statics are already in this array.
      compareWith.push(l)

    }
    // Add to output array to make sure they still come out in the right order.

    out[layout.indexOf(l)] = l
    // Clear moved flag, if it exists.
    l.moved = false

  }
  return out

}
export function compactItem (compareWith: Layout, l: LayoutItem, verticalCompact: boolean): LayoutItem {
  if (verticalCompact) {
    // Move the element up as far as it can go without colliding.
    while (l.y > 0 && !getFirstCollision(compareWith, l)) {
      l.y--

    }
  }

  // Move it down, and keep moving it down if it's colliding.

  let collides

  while ((collides = getFirstCollision(compareWith, l))) {
    l.y = collides.y + collides.h
  }

  return l
}

export function correctBounds (layout: Layout, bounds: {cols: number}): Layout {

  const collidesWith = getStatics(layout)

  for (let i = 0, len = layout.length; i < len; i++) {

    const l = layout[i]
    // Overflows right

    if (l.x + l.w > bounds.cols) l.x = bounds.cols - l.w
    // Overflows left
    if (l.x < 0) {
      l.x = 0
      l.w = bounds.cols
    }
    if (!l.static) collidesWith.push(l)
    else {
      // If this is static and collides with other statics, we must move it down.
      // We have to do something nicer than just letting them overlap.
      while (getFirstCollision(collidesWith, l)) {
        l.y++
      }
    }
  }

  return layout
}

export function createMarkup (obj: any) {

  const keys = Object.keys(obj)

  if (!keys.length) return ''

  const len = keys.length

  let result = ''

  for (let i = 0; i < len; i++) {

    const key = keys[i]

    const val = obj[key]

    result += `${hyphenate(key)  }:${  addPx(key, val)  };`
  }

  return result
}

export function findAndRemove (array: any, property: any, value: any) {
  array.forEach((result: any, index: any) => {
    if (result[property] === value) {
      array.splice(index, 1)
    }
  })
}

export function findItemInArray (array: any, property: any, value: any) {
  for (let i = 0; i < array.length; i++)
    if (array[i][property] === value)
      return true

  return false
}
export function getAllCollisions (layout: Layout, layoutItem: LayoutItem): Array<LayoutItem> {

  return layout.filter(l => collides(l, layoutItem))
}
export function getFirstCollision (layout: Layout, layoutItem: LayoutItem): LayoutItem | void {
  for (let i = 0, len = layout.length; i < len; i++) {
    if (collides(layout[i], layoutItem)) return layout[i]

  }
}
export function getLayoutItem (layout: Layout, id: string): LayoutItem | void {
  for (let i = 0, len = layout.length; i < len; i++) {
    if (layout[i].i === id) return layout[i]

  }
}
export function getStatics (layout: Layout): Array<LayoutItem> {

  return layout.filter(l => l.static)

}

export function hyphenate (str: string) {

  return str.replace(hyphenateRE, '$1-$2').toLowerCase()
}

export const hyphenateRE = /([a-z\d])([A-Z])/g

export function moveElement (layout: Layout, l: LayoutItem, x: number, y: number, isUserAction: boolean, preventCollision?: boolean): Layout {
  if (l.static) return layout

  const oldX = l.x

  const oldY = l.y

  const movingUp = y && l.y > y

  if (typeof x === 'number') l.x = x
  if (typeof y === 'number') l.y = y

  l.moved = true

  let sorted = sortLayoutItemsByRowCol(layout)

  if (movingUp) sorted = sorted.reverse()

  const collisions = getAllCollisions(sorted, l)

  if (preventCollision && collisions.length) {
    l.x = oldX
    l.y = oldY
    l.moved = false

    return layout
  }

  for (let i = 0, len = collisions.length; i < len; i++) {

    const collision = collisions[i]

    if (collision.moved) continue

    if (l.y > collision.y && l.y - collision.y > collision.h / 4) continue

    if (collision.static) {
      layout = moveElementAwayFromCollision(layout, collision, l, isUserAction)
    } else {
      layout = moveElementAwayFromCollision(layout, l, collision, isUserAction)

    }
  }

  return layout
}
export function moveElementAwayFromCollision (layout: Layout, collidesWith: LayoutItem,
  itemToMove: LayoutItem, isUserAction?: boolean): Layout {

  const preventCollision = false

  if (isUserAction) {

    const fakeItem: LayoutItem = {
      h: itemToMove.h,
      i: '-1',
      w: itemToMove.w,
      x: itemToMove.x,
      y: itemToMove.y
    }

    fakeItem.y = Math.max(collidesWith.y - itemToMove.h, 0)
    if (!getFirstCollision(layout, fakeItem)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return moveElement(layout, itemToMove, undefined, fakeItem.y, preventCollision)
    }

  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return moveElement(layout, itemToMove, undefined, itemToMove.y + 1, preventCollision)

}
export function perc (num: number): string {
  return `${num * 100  }%`

}
export function setTopLeft (top: number, left: number, width: number, height: number): any {
  return {
    height: `${height  }px`,
    left: `${left  }px`,
    position: 'absolute',
    top: `${top  }px`,
    width: `${width  }px`
  }

}
export function setTopRight (top: number, right: number, width: number, height: number): any {
  return {
    height: `${height  }px`,
    position: 'absolute',
    right: `${right }px`,
    top: `${top  }px`,
    width: `${width  }px`
  }

}
export function setTransform (top: number, left: number, width: number, height: number): any {
  // Replace unitless items with px

  const translate = `translate3d(${  left  }px,${  top  }px, 0)`

  return {
    MozTransform: translate,
    OTransform: translate,
    WebkitTransform: translate,
    height: `${height  }px`,
    msTransform: translate,
    position: 'absolute',
    transform: translate,
    width: `${width  }px`
  }

}

export function setTransformRtl (top: number, right: number, width: number, height: number): any {
  // Replace unitless items with px

  const translate = `translate3d(${  right * -1  }px,${  top  }px, 0)`

  return {
    MozTransform: translate,
    OTransform: translate,
    WebkitTransform: translate,
    height: `${height  }px`,
    msTransform: translate,
    position: 'absolute',
    transform: translate,
    width: `${width  }px`
  }

}

export function sortLayoutItemsByRowCol (layout: Layout): Layout {
  return [...layout].sort(function (a, b) {
    if (a.y === b.y && a.x === b.x) {
      return 0
    }

    if (a.y > b.y || (a.y === b.y && a.x > b.x)) {
      return 1
    }

    return -1
  })

}
export function validateLayout (layout: Layout, contextName: string): void {
  contextName = contextName || 'Layout'

  const subProps = ['x', 'y', 'w', 'h']

  if (!Array.isArray(layout)) throw new Error(`${contextName  } must be an array!`)
  for (let i = 0, len = layout.length; i < len; i++) {

    const item = layout[i]

    for (let j = 0; j < subProps.length; j++) {

      if (typeof item[subProps[j]] !== 'number') {
        throw new Error(`VueGridLayout: ${  contextName  }[${  i  }].${  subProps[j]  } must be a number!`)
      }
    }
    if (item.i && typeof item.i !== 'string') {
      // number is also ok, so comment the error
      // TODO confirm if commenting the line below doesn't cause unexpected problems
      // throw new Error('VueGridLayout: ' + contextName + '[' + i + '].i must be a string!');
    }
    if (item.static !== undefined && typeof item.static !== 'boolean') {
      throw new Error(`VueGridLayout: ${  contextName  }[${  i  }].static must be a boolean!`)
    }
  }
}
