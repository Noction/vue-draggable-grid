import { Breakpoint, Breakpoints, findOrGenerateResponsiveLayoutFnc } from '@/types/helpers'
import { cloneLayout, compact, correctBounds } from './utils'

export const findOrGenerateResponsiveLayout: findOrGenerateResponsiveLayoutFnc = (orgLayout, layouts, breakpoints, breakpoint, lastBreakpoint, cols, verticalCompact)  => {
  if (layouts[breakpoint]) {
    return cloneLayout(layouts[breakpoint])
  }

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
  layout = cloneLayout(layout || [])

  return compact(correctBounds(layout, { cols }), verticalCompact)
}

export const getBreakpointFromWidth = (breakpoints: Breakpoints, width: number): Breakpoint => {
  const sorted = sortBreakpoints(breakpoints)
  let [matching] = sorted

  for (let i = 1, len = sorted.length; i < len; i++) {
    const breakpointName = sorted[i]

    if (width > breakpoints[breakpointName]) matching = breakpointName
  }

  return matching
}

export const getColsFromBreakpoint = (breakpoint: Breakpoint, cols: Breakpoints): number => {
  if (!cols[breakpoint]) {
    throw new Error(`ResponsiveGridLayout: \`cols\` entry for breakpoint ${  breakpoint  } is missing!`)
  }
  return cols[breakpoint]
}

export const sortBreakpoints = (breakpoints: Breakpoints): Breakpoint[] => {
  return Object.keys(breakpoints).sort((a, b) => breakpoints[a] - breakpoints[b])
}
