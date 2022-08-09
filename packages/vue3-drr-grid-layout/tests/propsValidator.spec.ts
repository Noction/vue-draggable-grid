// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import testsPayload from '../src/helpers/payload'
import { breakpointsValidator, keysValidator, layoutValidator, marginValidator } from '../src/helpers/propsValidators'
import { describe, expect } from 'vitest'

describe('props validators', () => {
  const {
    keysValidatorPayload,
    breakpointsValidatorPayload,
    marginValidatorPayload,
    layoutValidatorPayload
  } = testsPayload

  describe('keysValidator', () => {
    const { invalidKeys1, invalidKeys2, validKeys } = keysValidatorPayload

    it('When validKeys instance of propsKeys', () => {
      const result = keysValidator(validKeys, validKeys)

      expect(result).toBe(true)
    })

    it('When propsKeys is invalid format 1', () => {
      const result = keysValidator(validKeys, invalidKeys1)

      expect(result).toBe(false)
    })

    it('When propsKeys is invalid format 2', () => {
      const result = keysValidator(validKeys, invalidKeys2)

      expect(result).toBe(false)
    })

    it('When propKeys are valid with more keys', () => {
      const moreKeys = ['s', '1']
      const result = keysValidator(validKeys, [...validKeys, moreKeys])

      expect(result).toBe(true)
    })
  })

  describe('breakpointsValidator', () => {
    const {
      invalidBreakpointsKeys1,
      invalidBreakpointsKeys2,
      invalidBreakpointsTypes,
      validBreakpoints
    } = breakpointsValidatorPayload

    it('When breakpoints are valid', () => {
      const result = breakpointsValidator(validBreakpoints)

      expect(result).toBe(true)
    })

    it('When breakpoints are invalid (keys) 1', () => {
      const result = breakpointsValidator(invalidBreakpointsKeys1)

      expect(result).toBe(false)
    })

    it('When breakpoints are invalid (keys) 2', () => {
      const result = breakpointsValidator(invalidBreakpointsKeys2)

      expect(result).toBe(false)
    })

    it('When breakpoints are invalid (types)', () => {
      const result = breakpointsValidator(invalidBreakpointsTypes)

      expect(result).toBe(false)
    })
  })

  describe('marginValidator', () => {
    const { invalidMargin1, invalidMargin2, validMargin } = marginValidatorPayload

    it('When margin are valid', () => {
      const result = marginValidator(validMargin)

      expect(result).toBe(true)
    })

    it('When margin are invalid 1', () => {
      const result = marginValidator(invalidMargin1)

      expect(result).toBe(false)
    })

    it('When margin are invalid 2', () => {
      const result = marginValidator(invalidMargin2)

      expect(result).toBe(false)
    })
  })

  describe('layoutValidator', () => {
    const {
      invalidOptionalLayout,
      invalidRequiredLayout,
      validRequiredLayout,
      validOptionalLayout
    } = layoutValidatorPayload

    it('When layout with required keys is valid', () => {
      const data = Array.from({ length: 5 }, () => validRequiredLayout)
      const result = layoutValidator(data)

      expect(result).toBe(true)
    })

    it('When layout with required and optional keys is valid', () => {
      const result = layoutValidator([validRequiredLayout, validOptionalLayout])

      expect(result).toBe(false)
    })

    it('When layout with required and optional keys is valid', () => {
      const result = layoutValidator([validRequiredLayout, invalidOptionalLayout])

      expect(result).toBe(false)
    })

    it('When layout with required keys is invalid 1', () => {
      const data = Array.from({ length: 5 }, () => invalidRequiredLayout)
      const result = layoutValidator(data)

      expect(result).toBe(false)
    })

    it('When layout with required keys is invalid 2', () => {
      const data = Array.from({ length: 5 }, () => invalidRequiredLayout)
      const result = layoutValidator([...data, invalidRequiredLayout])

      expect(result).toBe(false)
    })

    it('When layout with required keys is invalid 3', () => {
      const data = Array.from({ length: 5 }, () => invalidRequiredLayout)
      const result = layoutValidator([...data, invalidRequiredLayout])

      expect(result).toBe(false)
    })
  })
})
