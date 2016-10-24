const words = require('../lib/config').words

module.exports = (newBlocks) => {
  return newBlocks.map((col, i) => {
    const rowString = col.map(row => row ? row.charactor : ' ').join('')

    return words.map(word => ({ str: word, index: rowString.indexOf(word) }))
  })
}
