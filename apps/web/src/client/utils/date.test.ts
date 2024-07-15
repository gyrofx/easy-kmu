import { previousMonday } from 'date-fns'
import { addDecimalHours, startAndEndOfWeek } from './date'

describe('utils', () => {
  describe('addDecimalHours', () => {
    it('return the new date', () => {
      const day = new Date(Date.UTC(2010, 1, 1, 0, 0, 0, 0))
      expect(addDecimalHours(day, 7.25)).toEqual(new Date(Date.UTC(2010, 1, 1, 7, 15, 0, 0)))
    })
  })

  describe('startAndEndOfWeek', () => {
    it('returns the first and the last day of a week', () => {
      expect(previousMonday(new Date(Date.UTC(2023, 0, 12, 0, 0, 0)))).toEqual(
        new Date(Date.UTC(2023, 0, 9, 0, 0, 0)),
      )
      expect(startAndEndOfWeek(new Date(Date.UTC(2023, 0, 12)))).toEqual({
        startOfWeek: new Date(Date.UTC(2023, 0, 9)),
        endOfWeek: new Date(Date.UTC(2023, 0, 15)),
      })
    })
  })
})
