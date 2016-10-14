const buildBoard = require('../utils/buildBoard')

module.exports = {
  namespace: 'board',
  state: {
    blocks: buildBoard(12, 9)
  }
}
