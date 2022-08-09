import testsPayload from './payload'
import { Breakpoints, Layout } from '../types/helpers'

const { keysValidatorPayload, layoutValidatorPayload } = testsPayload

export const breakpointsValidator = (cols: Breakpoints): boolean => {
  const propColsKeys = (Object.keys(cols) as (keyof typeof cols)[])
  const colsValues = propColsKeys.map(k => typeof cols[k] === 'number')

  return keysValidator(keysValidatorPayload.validKeys, propColsKeys) && colsValues.indexOf(false) === -1
}

export const keysValidator = (requiredKeys: string[], propsKeys: string[]): boolean => {
  const coincidenceKeys = propsKeys.filter(k => requiredKeys.indexOf(k) >= 0)

  return propsKeys.length >= requiredKeys.length && coincidenceKeys.length === requiredKeys.length
}

const x = [{
  _listeners: [],
  x: 0,
  y: 0,
  w: 1,
  h: 1,
  i: 1,
  _records: -1,
  _timeSlug: null,
  _meta: {},
  _parameters: {},
  _options: {
    legend: {
      align: 'left',
      enabled: true,
      floating: false,
      useHtml: true,
      verticalAlign: 'bottom'
    },
    measure: 'bits',
    stacked: false,
    type: 'area'
  },
  _additional: {
    device: [],
    site: []
  },
  _tokens: {},
  _busy: false,
  _error: '',
  _placeholder: false,
  _original: {
    h: 1,
    id: 1,
    x: 0,
    y: 0,
    w: 1
  },
  moved: false
}]

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const layoutValidator = (layout: Layout = x) => {
  const { validOptionalLayout, validRequiredLayout } = layoutValidatorPayload
  const validLayout = { ...validRequiredLayout, ...validOptionalLayout }
  const requiredKeys = Object.keys(validRequiredLayout)
  const requiredKeysValid = layout.map(l => keysValidator(requiredKeys, Object.keys(l)))

  if (requiredKeysValid.includes(false)) return false

  const validTypes = layout.map(l => {
    const layoutItemKeys = (Object.keys(l) as (keyof typeof l)[])

    return layoutItemKeys
      .map(k => k === 'i' ? !isNaN(parseInt(l.i)) : validLayout[k] ? typeof l[k] === typeof validLayout[k] : true)
      .includes(false)
  })

  return !validTypes.includes(true)
}

export const marginValidator = (value: [number, number]): boolean => {
  const values = value.map(v => typeof v === 'number')
  const isLength = value.length === 2

  return values.indexOf(false) === -1 && isLength
}
