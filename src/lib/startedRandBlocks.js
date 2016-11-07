const shuffle = require('lodash.shuffle')
const range = require('lodash.range')

const config = require('../lib/config')
const randInt = require('../lib/randInt')

const words = config.words.join('').split('')
const colors = config.colors
const boardSize = config.boardSize

function startBlocks () {
  const y0 = shuffle(range(boardSize.rows))
  const y1 = shuffle(range(boardSize.rows))
  const orderX = (a, b) => a.x - b.x

  const r = [
    y0.map((n, i) => ({
      charactor: words[i],
      color: colors[0],
      x: n,
      y: 0,
      current: false
    })).sort(orderX),
    y1.map((n, i) => {
      return {
        charactor: words[i],
        color: colors[0],
        x: n,
        y: 1,
        current: false
      }
    }).sort(orderX)
  ]

  r[1][randInt(boardSize.rows)] = null

  return r
}

module.exports = startBlocks
