import { Breakpoints, Layout } from '@/types/helpers'

export const breakpointsValidator = (cols: Breakpoints): boolean => {
  const colsKeys = ['lg', 'md', 'sm', 'xs', 'xxs']
  const propColsKeys = Object.keys(cols)
  const colsValues = propColsKeys.map(k => typeof cols[k] === 'number')

  return keysValidator(colsKeys, propColsKeys) && colsValues.indexOf(false) === -1
}

export const keysValidator = (requiredKeys: any[], propsKeys: any[]): boolean => {
  const coincidenceKeys = propsKeys.filter(k => requiredKeys.indexOf(k) >= 0)

  return propsKeys.length >= requiredKeys.length && coincidenceKeys.length === requiredKeys.length
}

export const layoutValidation = (layout: Layout) => {
  const requiredKeys = ['w', 'h', 'x', 'y', 'i']
  // const keysValid = layout.map(l => keysValidator(requiredKeys))
}

export const marginValidator = (value: [number, number]): boolean => {
  const values = value.map(v => typeof v === 'number')
  const isLength = value.length === 2

  return values.indexOf(false) === -1 && isLength
}
