import {
  optionalEnvBoolean,
  optionalEnvNumber,
  parseTrustedProxySubnets,
  requiredEnvNumber,
  requiredEnvSplitString,
} from './optsHelpers'

describe('numbers', () => {
  describe('optionalEnvNumber', () => {
    it('parses an valid number', () => {
      expect(optionalEnvNumber('VAR', 10, { VAR: '5' })).toBe(5)
    })

    it('parses 0', () => {
      expect(optionalEnvNumber('VAR', 10, { VAR: '0' })).toBe(0)
    })

    it('uses the default if value is not available', () => {
      expect(optionalEnvNumber('VAR', 10, {})).toBe(10)
    })

    it('throws on non number value', () => {
      expect(() => optionalEnvNumber('VAR', 10, { VAR: 'string' })).toThrow(Error)
    })
  })

  describe('requiredEnvNumber', () => {
    it('parses a valid number', () => {
      expect(requiredEnvNumber('VAR', { VAR: '5' })).toBe(5)
    })

    it('parses 0', () => {
      expect(requiredEnvNumber('VAR', { VAR: '0' })).toBe(0)
    })

    it('throws on float value', () => {
      expect(() => requiredEnvNumber('VAR', { VAR: '50.25' })).toThrow(Error)
    })

    it('throws if value is not available', () => {
      expect(() => requiredEnvNumber('VAR', {})).toThrow(Error)
    })

    it('throws if value is not a valid number', () => {
      expect(() => requiredEnvNumber('ENV', { VAR: 'string' })).toThrow(Error)
    })
  })
})

describe('requiredBoolNumber', () => {
  it("parses 'ture'", () => {
    expect(optionalEnvBoolean('VAR', false, { VAR: 'true' })).toBe(true)
  })

  it("parses 'false'", () => {
    expect(optionalEnvBoolean('VAR', false, { VAR: 'false' })).toBe(false)
  })

  it('uses the default', () => {
    expect(optionalEnvBoolean('VAR', false, {})).toBe(false)
  })

  it('throws on uppercase value', () => {
    expect(() => optionalEnvBoolean('VAR', false, { VAR: 'TRUE' })).toThrow(Error)
  })

  it('throws on arbitrary values', () => {
    expect(() => optionalEnvBoolean('VAR', false, { VAR: '1' })).toThrow(Error)
    expect(() => optionalEnvBoolean('VAR', false, { VAR: '0' })).toThrow(Error)
  })

  it('uses the default (false) on empty value', () => {
    expect(optionalEnvBoolean('VAR', false, { VAR: '' })).toBe(false)
  })

  it('uses the default (true) on empty value', () => {
    expect(optionalEnvBoolean('VAR', true, { VAR: '' })).toBe(true)
  })
})

describe('requiredEnvSplitString', () => {
  it('splits single strings', () => {
    expect(
      requiredEnvSplitString('VAR', { VAR: 'abc' }, { split: ',', minSingleWordLength: 3 }),
    ).toMatchInlineSnapshot(`
      [
        "abc",
      ]
    `)
  })

  it('splits multiple strings', () => {
    expect(() =>
      requiredEnvSplitString('VAR', { VAR: 'abc,abcd' }, { split: ',', minSingleWordLength: 3 }),
    ).toMatchInlineSnapshot('[Function]')
  })

  it('throws if env variable is not declared', () => {
    expect(() =>
      requiredEnvSplitString('VAR', {}, { split: ',', minSingleWordLength: 1 }),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: Invalid config value for env variable VAR. See .env.example to setup .env, or set the env variable VAR]',
    )
  })

  it('throws if one string is too short', () => {
    expect(() =>
      requiredEnvSplitString('VAR', { VAR: 'abc,abcd' }, { split: ',', minSingleWordLength: 4 }),
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: Invalid config value for env variable VAR. See .env.example to setup .env, or set the env variable VAR. Expected each part to be at least 4 characters long, but was "abc,abcd"]`,
    )
  })

  it('throws if no parts are returned', () => {
    expect(() =>
      requiredEnvSplitString('VAR', { VAR: ',' }, { split: ',', minSingleWordLength: 4 }),
    ).toThrowErrorMatchingInlineSnapshot(`[Error: Expected at least one value after split, but was ","]`)
  })
})

describe('parseTrustedProxySubnets', () => {
  it('is optional', () => {
    const env = { TEST_TRUSTED_PROXY_SUBNETS: undefined }
    expect(parseTrustedProxySubnets('TEST_TRUSTED_PROXY_SUBNETS', env)).toBeUndefined()
  })

  it('parses single IP', () => {
    const env = { TEST_TRUSTED_PROXY_SUBNETS: '172.21.0.2' }
    expect(parseTrustedProxySubnets('TEST_TRUSTED_PROXY_SUBNETS', env)).toEqual(['172.21.0.2'])
  })

  it('parses single CIDR block', () => {
    const env = { TEST_TRUSTED_PROXY_SUBNETS: '172.21.0.0/22' }
    expect(parseTrustedProxySubnets('TEST_TRUSTED_PROXY_SUBNETS', env)).toEqual(['172.21.0.0/22'])
  })

  it('parses multiple values', () => {
    const env = {
      TEST_TRUSTED_PROXY_SUBNETS: '172.21.0.2,172.21.3.0/26,172.21.3.64/26,172.21.3.128/26',
    }
    expect(parseTrustedProxySubnets('TEST_TRUSTED_PROXY_SUBNETS', env)).toEqual([
      '172.21.0.2',
      '172.21.3.0/26',
      '172.21.3.64/26',
      '172.21.3.128/26',
    ])
  })

  it('trims whitespace', () => {
    const env = {
      TEST_TRUSTED_PROXY_SUBNETS: '   172.21.0.2, 172.21.3.0/26  ,172.21.3.64/26,172.21.3.128/26   ',
    }
    expect(parseTrustedProxySubnets('TEST_TRUSTED_PROXY_SUBNETS', env)).toEqual([
      '172.21.0.2',
      '172.21.3.0/26',
      '172.21.3.64/26',
      '172.21.3.128/26',
    ])
  })

  it('rejects invalid values', () => {
    const env = { TEST_TRUSTED_PROXY_SUBNETS: '172.21.0.2,172.21.3.0/26,172.0.0' }
    expect(() =>
      parseTrustedProxySubnets('TEST_TRUSTED_PROXY_SUBNETS', env),
    ).toThrowErrorMatchingInlineSnapshot('[Error: Invalid trusted proxy subnet]')
  })
})
