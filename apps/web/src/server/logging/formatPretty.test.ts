import { formatPretty } from './formatPretty'
import type { LogEntry } from './logger'

describe('formatPretty', () => {
  it('formats a LogEntry', () => {
    const formattedString = formatPretty(logEntry())
    expect(formattedString).toContain('2022-02-01T00:00:00.000Z')
    expect(formattedString).toContain('test')
    expect(formattedString).toContain('DEBUG')
    expect(formattedString).toContain('foo: ')
  })

  it('ignores the message property of LogEntry', () => {
    expect(formatPretty(logEntry())).not.toContain('message')
  })
})

function logEntry() {
  return {
    id: 'test',
    level: 'debug',
    message: 'message',
    timestamp: new Date(2022, 1, 1),
    details: { foo: 'bar' },
  } as LogEntry
}
