/* global describe, it, expect */

import Gimmick from 'src/lib/gimmick'

const GIMMICK_NAME = 'gimmick:xlspreview'

describe('Gimmick', () => {
  it('should parse no option', () => {
    let result = Gimmick.parseLink(`${GIMMICK_NAME}()`)
    expect(result).toEqual({})
  })

  it('should parse one option', () => {
    let result = Gimmick.parseLink(`${GIMMICK_NAME}(open: 'toggle')`)
    expect(result).toEqual({ open: 'toggle' })
  })

  it('should parse more options', () => {
    let result = Gimmick.parseLink(`${GIMMICK_NAME}(open: 'toggle', foo: 'bar', blah: 'buzz')`)
    expect(result).toEqual({ open: 'toggle', foo: 'bar', blah: 'buzz' })
  })

  it('should parse options with various formats', () => {
    let result = Gimmick.parseLink(`${GIMMICK_NAME}("open": 'toggle', "Foo-12_3": 126, blah: "buzz")`)
    expect(result).toEqual({ open: 'toggle', 'Foo-12_3': 126, blah: 'buzz' })
  })

  it('should not parse malformed options', () => {
    let result = Gimmick.parseLink(`${GIMMICK_NAME}(ZIRueieu989!(@*$^*#()))`)
    expect(result).toEqual({})
  })
})
