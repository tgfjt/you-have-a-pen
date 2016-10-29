const config = require('../lib/config')
const rand = require('../lib/randInt')

const chars = config.chars
const colors = config.colors
const boardSize = config.boardSize

function newBlock (opts) {
  return {
    charactor: chars[rand(chars.length - 1)],
    color: colors[rand(colors.length - 1)],
    x: boardSize.rows / 2,
    y: boardSize.cols - 1,
    current: !!opts && !!opts.current
  }
}

module.exports = newBlock
