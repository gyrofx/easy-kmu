import { timeZoneExists } from './date'

describe('timeZoneExists', () => {
  it.each([
    'Africa/Abidjan',
    'Europe/Zurich',
    'Europe/Berlin',
    'Europe/Paris',
    'America/Santiago',
    'Asia/Shanghai',
    'Australia/Sydney',
    'America/New_York',
    'Europe/Dublin',
  ])('checks that %s is a valid timeZone', (timeZone) => {
    expect(timeZoneExists(timeZone)).toBeTruthy()
  })

  it.each([
    'America/Not_A_Timezone',
    'Europe/Zuerich',
    'Europe/Bern',
    'invalid',
    '',
    'Zurich',
    null as any as string,
    undefined as any as string,
  ])('checks that %s is an invalid timeZone', (timeZone) => {
    expect(timeZoneExists(timeZone)).toBeFalsy()
  })
})
