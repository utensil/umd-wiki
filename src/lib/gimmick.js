const log = debug('gimmick')

export default class Gimmick {
  static parse (gimmickSpec) {
    let opts = {}
    const GIMMICK_FORMAT = /^\s*gimmick:[^(]+\((([^:]+)\s*:\s*([^,]+)\s*[,]?)+\)\s*$/g
    // log('gimmickSpec', gimmickSpec)
    try {
      let m = GIMMICK_FORMAT.test(gimmickSpec)
      if (m) {
        gimmickSpec = gimmickSpec.replace(/^\s*gimmick:[^(]+\(/, '({').replace(/\)\s*$/, '})')
        // FIXME eval is evil
        /* eslint no-eval: 'off' */
        return eval(gimmickSpec)
        // return m
        // log('matched', m, m.length)
        // _.forEach((e, i) => {
        //
        // })
      }
    } catch (e) {
      log('error', e)
      return opts
    }

    return opts
  }
}
