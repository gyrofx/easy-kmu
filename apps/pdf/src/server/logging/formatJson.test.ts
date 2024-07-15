import { formatJson } from './formatJson'
import { LogEntry } from './logger'

describe('formatPretty', () => {
  it('formats a log entry as a JSON string', () => {
    expect(formatJson(logEntry())).toBe(
      `{"timestamp":"2020-02-01T01:01:01.001Z","level":"debug","id":"This is a message","message":"This is a message","details":{"foo":{"bar":"baz"}}}`,
    )
  })
})

function logEntry(): LogEntry {
  return {
    level: 'debug',
    timestamp: new Date(2020, 1, 1, 1, 1, 1, 1),
    id: 'This is a message',
    message: 'This is a message',
    details: {
      foo: {
        bar: 'baz',
      },
    },
  }
}
