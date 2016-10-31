const words = require('../lib/config').words
const colors = require('../lib/config').colors

module.exports = (newBlocks) => {
  return newBlocks.map((col, i) => {
    const colorWords = colors.map((color) => {
      return col.map(row => (row && row.color === color) ? row.charactor : ' ').join('')
    })

    return words.map((word) => {
      return { str: word, index: colorWords.reduce((w1, w2) => Math.max(w1.indexOf(word), w2.indexOf(word))) }
    })
  })
}
