import { ErrorWithDetails } from './errors'
import { catchErrorForTest, catchErrorForTestAsync } from './testHelpers'

describe('catchErrorForTest', () => {
  it('renders the inline error message', () => {
    expect(
      catchErrorForTest(() => {
        throw new ErrorWithDetails('test error', {
          details: { errorDetailKeyA: 'errorDetailValueA', errorDetailKeyB: 'errorDetailValueB' },
          cause: new ErrorWithDetails('inner test error', {
            details: {
              innerErrorDetailKeyA: 'inner errorDetailValueA',
              innerErrorDetailKeyB: 'inner errorDetailValueB',
            },
          }),
        })
      }),
    ).toMatchInlineSnapshot(`
      {
        "cause": {
          "cause": "",
          "details": {
            "innerErrorDetailKeyA": "inner errorDetailValueA",
            "innerErrorDetailKeyB": "inner errorDetailValueB",
          },
          "message": "inner test error",
          "name": "Error",
          "stack": undefined,
          "stringified": undefined,
          "type": "error",
        },
        "details": {
          "errorDetailKeyA": "errorDetailValueA",
          "errorDetailKeyB": "errorDetailValueB",
        },
        "message": "test error",
        "name": "Error",
        "stack": undefined,
        "stringified": undefined,
        "type": "error",
      }
    `)
  })
})

describe('catchErrorForTestAsync', () => {
  it('renders the inline error message', async () => {
    await expect(
      catchErrorForTestAsync(() => {
        return Promise.reject(
          new ErrorWithDetails('test error', {
            details: { errorDetailKeyA: 'errorDetailValueA', errorDetailKeyB: 'errorDetailValueB' },
            cause: new ErrorWithDetails('inner test error', {
              details: {
                innerErrorDetailKeyA: 'inner errorDetailValueA',
                innerErrorDetailKeyB: 'inner errorDetailValueB',
              },
            }),
          }),
        )
      }),
    ).resolves.toMatchInlineSnapshot(`
      {
        "cause": {
          "cause": "",
          "details": {
            "innerErrorDetailKeyA": "inner errorDetailValueA",
            "innerErrorDetailKeyB": "inner errorDetailValueB",
          },
          "message": "inner test error",
          "name": "Error",
          "stack": undefined,
          "stringified": undefined,
          "type": "error",
        },
        "details": {
          "errorDetailKeyA": "errorDetailValueA",
          "errorDetailKeyB": "errorDetailValueB",
        },
        "message": "test error",
        "name": "Error",
        "stack": undefined,
        "stringified": undefined,
        "type": "error",
      }
    `)
  })
})
