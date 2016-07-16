/* global describe, it, expect */

import Gimmick from 'src/lib/gimmick'

describe('Gimmick', () => {
  it('should parse no option', () => {
    let result = Gimmick.parse('gimmick:xlspreview()')
    expect(result).toEqual({})
  })

  it('should parse one option', () => {
    let result = Gimmick.parse("gimmick:xlspreview(open: 'toggle')")
    expect(result).toEqual({ open: 'toggle' })
  })

  it('should parse more options', () => {
    let result = Gimmick.parse("gimmick:xlspreview(open: 'toggle', foo: 'bar', blah: 'buzz')")
    expect(result).toEqual({ open: 'toggle', foo: 'bar', blah: 'buzz' })
  })
})
