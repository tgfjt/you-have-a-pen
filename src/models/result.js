const xtend = require('xtend')

const words = require('../lib/config').words
const scores = require('../lib/config').scores

module.exports = {
  namespace: 'result',
  state: {
    totalscore: 0,
    details: {
      PINEAPPLE: 0,
      APPLE: 0,
      PEN: 0
    }
  },
  reducers: {
    addScore: (data, state) => ({
      totalscore: data.total,
      details: xtend(state.details, data.details)
    })
  },
  effects: {
    remove: (targetWord, state, send, done) => {
      console.log('result:remove', targetWord, scores[targetWord])

      console.assert(typeof targetWord === 'string', 'targetWord is not string')
      console.assert(typeof (state.details[targetWord] + scores[targetWord]) === 'number', 'score is not number')

      send('result:addScore', {
        total: state.totalscore + scores[targetWord],
        details: {
          [targetWord]: state.details[targetWord] + scores[targetWord]
        }
      }, done)
    }
  }
}
