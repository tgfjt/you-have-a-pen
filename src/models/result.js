const xtend = require('xtend')

const scores = require('../lib/config').scores

module.exports = {
  namespace: 'result',
  state: {
    totalscore: 0,
    details: { PINEAPPLE: 0, APPLE: 0, PEN: 0 }
  },
  reducers: {
    addScore: (data, state) => ({
      totalscore: data.total,
      details: xtend(state.details, data.details)
    }),
    reset: (data, state) => ({
      totalscore: 0,
      details: { PINEAPPLE: 0, APPLE: 0, PEN: 0 }
    })
  },
  effects: {
    // TODO: to be double score with chain removing
    remove: (targetWord, state, send, done) => {
      console.assert(typeof targetWord === 'string', 'targetWord is not string')
      console.assert(typeof (state.details[targetWord] + scores[targetWord]) === 'number', 'score is not number')

      const total = state.totalscore + scores[targetWord]

      send('result:addScore', {
        total,
        details: { [targetWord]: state.details[targetWord] + scores[targetWord] }
      }, done)

      if (total >= 100) {
        send('game:speedup', total, done)
      }
    }
  }
}
