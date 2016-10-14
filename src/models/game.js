const buildBoard = require('../utils/buildBoard')

const rand = require('../utils/randInt')
const words = require('../utils/words')

const chars = [
  'A', 'E', 'P', 'L', 'N', 'I'
]
const colors = [
  'black',
  'lgreen',
  'dgreen',
  'lgray'
]

module.exports = {
  namespace: 'game',
  state: {
    next: {
      char: chars[rand(5)],
      color: colors[rand(3)]
    }
  },
  reducers: {
    updateNext: (data, state) => ({
      next: data
    })
  },
  effects: {
    next: (data, state, send, done) => {
      const n = { char: chars[rand(5)], color: colors[rand(3)]}
      send('game:updateNext', n, done)
    }
  },
  subscriptions: [
    (send, done) => {
      setInterval(() => {
        send('game:next', {}, (err) => {
          if (err) return done(err)
        })
      }, 1500)
    }
  ]
}
