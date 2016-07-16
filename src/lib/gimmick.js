const log = debug('gimmick')

export default class Gimmick {
  static parseLink (linkGimmickSpec) {
    let opts = {}
    // A-Za-z0-9_\-\\"'
    const GIMMICK_FORMAT = /^\s*gimmick:[^(]+\((\s*([A-Za-z0-9_\-\\"']+)\s*:\s*([A-Za-z0-9_\-\\"']+)\s*[,]?)*\s*\)\s*$/
    // log('linkGimmickSpec', linkGimmickSpec)
    try {
      let m = GIMMICK_FORMAT.exec(linkGimmickSpec)
      if (m) {
        linkGimmickSpec = linkGimmickSpec.replace(/^\s*gimmick:[^(]+\(\s*/, '({').replace(/\s*\)\s*$/, '})')
        // FIXME eval is evil
        /* eslint no-eval: 'off' */
        return eval(linkGimmickSpec)
        // return m
        // log('matched', m, m.length)
        // _.forEach((e, i) => {
        //
        // })
      } else {
        // log('invalid gimmick', linkGimmickSpec)
        return opts
      }
    } catch (e) {
      log('error', e)
      return opts
    }

    // return opts
  }
}
