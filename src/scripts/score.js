// @TODO: This has been deprecated. Remove in future.
const keys = {
  increase: 'score-increase',
  reset: 'score-reset'
}

const increaseEvent = new Event(keys.increase)
const resetEvent = new Event(keys.reset)

export default {
  increase: () => document.dispatchEvent(increaseEvent),
  reset: () => document.dispatchEvent(resetEvent),
  keys
}
