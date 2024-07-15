import { SpyInstance, vi } from 'vitest'
import { initLogger, logger, uninitializeLogger } from './logger'

beforeAll(() => {
  uninitializeLogger()
  initLogger()
})

afterAll(() => {
  uninitializeLogger()
  initLogger()
})

describe('logging', () => {
  describe('info', () => {
    it('writes a log message to the console', () => {
      const spy = spyConsole()

      logger().info('hello world 1')

      expect(loggedObject(spy)).toEqual({
        level: 'info',
        id: 'hello world 1',
        message: 'hello world 1',
        timestamp: expect.any(String),
      })
    })

    it('writes a log message to the console with serialized object', () => {
      const spy = spyConsole()

      logger().info('hello world 2', { foo: { bar: 'baz' } })

      expect(loggedObject(spy)).toEqual({
        level: 'info',
        id: 'hello world 2',
        message: "hello world 2: { foo: { bar: 'baz' } }",
        timestamp: expect.any(String),
        details: { foo: { bar: 'baz' } },
      })
    })
  })

  describe('warn', () => {
    it('writes a log message with level "warn" to the console', () => {
      const spy = spyConsole()

      logger().warn('hello world 3', { foo: { bar: 'baz' } })

      expect(loggedObject(spy)).toEqual({
        level: 'warn',
        id: 'hello world 3',
        message: "hello world 3: { foo: { bar: 'baz' } }",
        timestamp: expect.any(String),
        details: { foo: { bar: 'baz' } },
      })
    })
  })

  describe('error', () => {
    it('writes a log message with level "error" to the console', () => {
      const spy = spyConsole()

      logger().error('hello world 4', { foo: { bar: 'baz' } })

      expect(loggedObject(spy)).toEqual({
        level: 'error',
        id: 'hello world 4',
        message: "hello world 4: { foo: { bar: 'baz' } }",
        timestamp: expect.any(String),
        details: { foo: { bar: 'baz' } },
      })
    })

    it('writes a log message with an serialized error', () => {
      const spy = spyConsole()

      logger().error('Just an error', new Error('an error 2'))

      expect(loggedObject(spy)).toEqual({
        level: 'error',
        id: 'Just an error',
        message: expect.stringMatching(/Just an error: \{ name: 'Error', message: 'an error 2', stack:/),
        timestamp: expect.any(String),
        details: {
          stack: expect.any(String),
          cause: '',
          name: 'Error',
          message: 'an error 2',
          stringified: 'Error: an error 2',
          type: 'error',
        },
      })
    })

    it('writes a info log and overrides the message with a string', () => {
      const spy = spyConsole()

      const details = { request: { foo: { bar: 'baz' } }, hello: { world: false } }
      logger().info('hello world 5', details, 'hahahaha')

      expect(loggedObject(spy)).toEqual({
        timestamp: expect.any(String),
        level: 'info',
        id: 'hello world 5',
        message: 'hahahaha',
        details,
      })
    })

    it('writes a info log and overrides the message with an array of values', () => {
      const spy = spyConsole()

      const details = { request: { foo: { bar: 'baz' } }, hello: { world: false } }
      logger().info('hello world 5', details, [0, 'test', false])

      expect(loggedObject(spy)).toEqual({
        timestamp: expect.any(String),
        level: 'info',
        id: 'hello world 5',
        message: "hello world 5: [ 0, 'test', false ]",
        details,
      })
    })

    it('writes a info log and overrides the message with an object', () => {
      const spy = spyConsole()

      const details = { request: { foo: { bar: 'baz' } }, hello: { world: false } }
      logger().info('hello world 5', details, { foo: 'test' })

      expect(loggedObject(spy)).toEqual({
        timestamp: expect.any(String),
        level: 'info',
        id: 'hello world 5',
        message: "hello world 5: { foo: 'test' }",
        details,
      })
    })
  })
})

function spyConsole() {
  return vi.spyOn(console, 'log').mockImplementation(() => undefined)
}

function loggedObject(spy: SpyInstance) {
  expect(spy).toHaveBeenCalledTimes(1)
  const loggedString = spy.mock.calls[0]?.[0]
  expect(loggedString).toEqual(expect.any(String))
  return JSON.parse(loggedString as string)
}
