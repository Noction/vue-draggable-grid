import { Layout } from './utils'
import { cloneLayout, compact, correctBounds } from './utils'

export type ResponsiveLayout = {lg?: Layout, md?: Layout, sm?: Layout, xs?: Layout, xxs?: Layout}

type Breakpoint = string

type Breakpoints = {lg?: number, md?: number, sm?: number, xs?: number, xxs?: number}

export function findOrGenerateResponsiveLayout (orgLayout: Layout, layouts: ResponsiveLayout, breakpoints: Breakpoints,
  breakpoint: Breakpoint, lastBreakpoint: Breakpoint,
  cols: number, verticalCompact: boolean): Layout {
  // If it already exists, just return it.
  if (layouts[breakpoint]) return cloneLayout(layouts[breakpoint])
  // Find or generate the next layout
  let layout = orgLayout

  const breakpointsSorted = sortBreakpoints(breakpoints)
  const breakpointsAbove = breakpointsSorted.slice(breakpointsSorted.indexOf(breakpoint))

  for (let i = 0, len = breakpointsAbove.length; i < len; i++) {
    const b = breakpointsAbove[i]

    if (layouts[b]) {
      layout = layouts[b]
      break
    }
  }
  layout = cloneLayout(layout || []) // clone layout so we don't modify existing items
  return compact(correctBounds(layout, { cols }), verticalCompact)
}

export function generateResponsiveLayout (layout: Layout, breakpoints: Breakpoints,
  breakpoint: Breakpoint, lastBreakpoint: Breakpoint,
  cols: number, verticalCompact: boolean): Layout {
  // If it already exists, just return it.
  /*if (layouts[breakpoint]) return cloneLayout(layouts[breakpoint]);
  // Find or generate the next layout
  let layout = layouts[lastBreakpoint];*/
  /*const breakpointsSorted = sortBreakpoints(breakpoints);
  const breakpointsAbove = breakpointsSorted.slice(breakpointsSorted.indexOf(breakpoint));
  for (let i = 0, len = breakpointsAbove.length; i < len; i++) {
    const b = breakpointsAbove[i];
    if (layouts[b]) {
      layout = layouts[b];
      break;
    }
  }*/
  layout = cloneLayout(layout || []) // clone layout so we don't modify existing items
  return compact(correctBounds(layout, { cols }), verticalCompact)
}

export function getBreakpointFromWidth (breakpoints: Breakpoints, width: number): Breakpoint {
  const sorted = sortBreakpoints(breakpoints)
  let [matching] = sorted

  for (let i = 1, len = sorted.length; i < len; i++) {
    const breakpointName = sorted[i]

    if (width > breakpoints[breakpointName]) matching = breakpointName
  }

  return matching
}

export function getColsFromBreakpoint (breakpoint: Breakpoint, cols: Breakpoints): number {
  if (!cols[breakpoint]) {
    throw new Error(`ResponsiveGridLayout: \`cols\` entry for breakpoint ${  breakpoint  } is missing!`)
  }
  return cols[breakpoint]
}

/**
 * Given breakpoints, return an array of breakpoints sorted by width. This is usually
 * e.g. ['xxs', 'xs', 'sm', ...]
 *
 * @param  {Object} breakpoints Key/value pair of breakpoint names to widths.
 * @return {Array}              Sorted breakpoints.
 */
export function sortBreakpoints (breakpoints: Breakpoints): Breakpoint[] {
  const keys: Array<string> = Object.keys(breakpoints)

  return keys.sort(function (a, b) {
    return breakpoints[a] - breakpoints[b]
  })
}
