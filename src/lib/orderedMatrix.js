const range = require('lodash.range')

module.exports = (boardSize) => {
  return range(boardSize.cols).map(col => range(boardSize.rows).map(row => null))
}
