// Inspired by and simplified from https://github.com/Dynalon/mdwiki/blob/master/js/ts/stage.ts

// TODO doc

const log = debug('stage')

export const BOOT_STAGES = [
  'init', 'load', 'skel', 'render', 'ready'
]

export const RENDER_STAGES = [
  'fetch', 'transform', 'post_transform', 'pregimmick', 'gimmick', 'postgimmick'
]

let stageRegistry = null

export class StageRegistery {

  static instance () {
    stageRegistry = stageRegistry || new StageRegistery()
    return stageRegistry
  }

  constructor () {
    this.registry = {}
  }

  registerStage (name) {
    let s = this.registry[name]

    if (s == null) {
      this.registry[name] = s = new Stage(name)
    }

    return s
  }

  getStage (name) {
    return this.registry[name]
  }
}

const registerStage = (name) => {
  return StageRegistery.instance().registerStage(name)
}

export const stage = registerStage

export class StageChain {

  constructor (stageNamesInOrder) {
    this.stageNamesInOrder = stageNamesInOrder || []
    this.stageRunQueue = []
    this.isRunning = false
  }

  run () {
    if (this.isRunning) {
      throw new Error('Already running')
    }

    this.stageRunQueue = []
    this.isRunning = true

    this.stageNamesInOrder.forEach(name => {
      let s = StageRegistery.instance().getStage(name)
      if (s) {
        this.stageRunQueue.push(s)
      }
    })

    this.runOneStage(this.stageRunQueue.shift())
  }

  runOneStage (stage) {
    if (stage == null) {
      // means finished
      this.isRunning = false
      return
    }

    stage.start().then(() => {
      this.runOneStage(this.stageRunQueue.shift())
    })
  }
}

export class Stage {
  constructor (name) {
    this.name = name
    this.subscribers = []
    this.prepareForNextRun()
  }

  subscribe (fn) {
    if (this.isRunning()) {
      this.numRunning++
      this.startOne(fn)
    } else if (this.hasFinished()) {
      throw new Error('You may only subscribe to a stage before it finishes')
    } else {
      this.subscribers.push(fn)
    }

    // for chaining call
    return this
  }

  isRunning () {
    return this.numRunning > 0
  }

  hasFinished () {
    return this.numRunning === 0
  }

  start () {
    log('stage', this.name)
    this.numRunning = this.subscribers.length

    this.subscribers.forEach(fn => {
      this.startOne(fn)
    })

    return this.finished()
  }

  // returns a `all` promise
  finished () {
    return this.finishedPromise
  }

  // private:

  startOne (fn) {
    fn(() => {
      this.finishOne()
    })
  }

  finishOne () {
    this.numRunning--

    if (this.hasFinished()) {
      this.finishedResolver()
      this.prepareForNextRun()
    }
  }

  prepareForNextRun () {
    this.numRunning = -1
    this.finishedPromise = new Promise((resolve, reject) => {
      this.finishedResolver = resolve

      // TODO timeout reject
    })
  }
}
