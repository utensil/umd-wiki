import {stage} from './lib/stage'

export const init = () => {
  if (window.$ == null) {
    throw new Error('jQuery or Zepto not found!')
  }
  window.$.md = {
    stage (name) {
      return stage(name)
    }
  }
}
