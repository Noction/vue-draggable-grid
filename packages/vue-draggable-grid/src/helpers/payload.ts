export default {
  breakpointsValidatorPayload: {
    invalidBreakpointsKeys1: { lg: 0, md: 0, sm: 0, xs: 0, xx: 0 },
    invalidBreakpointsKeys2: { lg: 0, md: 0, sm: 0, xs: 0 },
    invalidBreakpointsTypes: { lg: '0', md: 0, sm: 0, xs: 0, xx: 0 },
    validBreakpoints: { lg: 0, md: 0, sm: 0, xs: 0, xxs: 0 }
  },
  intersectionObserverConfig: { root: null, rootMargin: '8px', threshold: 0.40 },
  keysValidatorPayload: {
    invalidKeys1: ['lg', 'md', 'sm', 'xs', 'xxw'],
    invalidKeys2: ['1', '2', '3', '4', '5'],
    validKeys: ['lg', 'md', 'sm', 'xs', 'xxs']
  },
  layoutValidatorPayload: {
    invalidOptionalLayout: {
      isDraggable: true,
      isResizable: false,
      maxH: 0,
      maxW: '0',
      minH: 0,
      minW: 0,
      moved: true,
      static: false
    },
    invalidRequiredLayout: { h: 0, i: 'string', w: 0, x: 0, y: 0 },
    validOptionalLayout: {
      isDraggable: true,
      isResizable: false,
      maxH: 0,
      maxW: 0,
      minH: 0,
      minW: 0,
      moved: true,
      static: false
    },
    validRequiredLayout: { h: 0, i: -1, w: 0, x: 0, y: 0 }
  },
  marginValidatorPayload: {
    invalidMargin1: [0, 0, 0],
    invalidMargin2: ['0', 0],
    validMargin: [0, 0]
  }
}
