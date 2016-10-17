const key = require('keymaster')
const xtend = require('xtend')
const flatten = require('lodash.flatten')

const rand = require('../utils/randInt')
const words = require('../utils/words')

const chars = [
  'A', 'E', 'P', 'L', 'N', 'I'
]
const colors = [
  'light-red',
  'light-green',
  'light-blue',
  'gray'
]

const boardSize = {
  rows: 10,
  cols: 15
}

function newBlock () {
  return {
    charactor: chars[rand(5)],
    color: colors[rand(3)],
    x: boardSize.rows / 2,
    y: boardSize.cols - 1
  }
}

const orderedMatrix = Array.from(Array(boardSize.cols)).map((col) => {
  return Array.from(Array(boardSize.rows)).map(row => null)
})

module.exports = {
  namespace: 'game',
  state: {
    timer: null,
    pause: false,
    looptime: 750,
    size: 34,
    board: boardSize,
    nextBlock: {
      charactor: null,
      color: null
    },
    currentBlock: {
      charactor: null,
      color: null
    },
    orderedBlocks: orderedMatrix
  },
  reducers: {
    newGame: (data, state) => ({
      timer: null,
      nextBlock: newBlock(),
      currentBlock: newBlock()
    }),
    saveBlock: (data, state) => ({
      orderedBlocks: data
    }),
    updateNext: (data, state) => ({
      nextBlock: data,
      currentBlock: state.nextBlock
    }),
    updateCurrent: (data, state) => ({
      currentBlock: data
    }),
    setPause: (data, state) => ({
      pause: data
    }),
    changeBlocks: (data, state) => ({
      orderedBlocks: data
    })
  },
  effects: {
    start: (data, state, send, done) => {
      clearTimeout(state.timer)
      send('game:newGame', done)
      send('game:mainLoop', done)
    },
    pause: (data, state, send, done) => {
      if (!state.pause) {
        clearTimeout(state.timer)
        send('game:setPause', true, done)
      } else {
        send('game:setPause', false, done)
        send('game:mainLoop', done)
      }
    },
    removeBlocks: (data, state, send, done) => {
      console.log('揃った', data)

      data.forEach((line, i) => {
        line.forEach((index) => {
          if (index > -1) {
            // TODO: 最初の文字だけ分かってもな…最初だけしか消せないからな…
            console.log(state.orderedBlocks[i][index])
          }
        })
      })

    // send('game:changeBlocks', blocks, done)
    },
    mainLoop: (data, state, send, done) => {
      state.timer = setTimeout(() => {
        send('game:loop', done)
      }, state.looptime)
    },
    loop: (data, state, send, done) => {
      if (state.currentBlock.y > 0) {
        if (!flatten(state.orderedBlocks).filter(item => !!item).every((b) => {
            if (state.currentBlock.x === b.x && state.currentBlock.y - 1 === b.y) {
              return false
            } else {
              return true
            }
          })) {
          send('game:next', done)
        } else {
          send('game:handleDown', done)
          send('game:mainLoop', done)
        }
      } else {
        send('game:next', done)
      }
    },
    next: (data, state, send, done) => {
      clearTimeout(this.timer)

      const newBlocks = state.orderedBlocks.slice()
      newBlocks[state.currentBlock.y][state.currentBlock.x] = state.currentBlock

      send('game:saveBlock', newBlocks, done)

      window.blocks = newBlocks
      window.words = words

      // TODO: row と col をしょっちゅう混同してる気がするが大丈夫か

      const indexOfLines = newBlocks.map((col, i) => {
        const rowString = col.map((row) => {
          if (row) return row.charactor
          else return ' '
        }).join('')

        return words.map(word => rowString.indexOf(word))
      })

      const isGotWord = indexOfLines.some((row) => {
        return row.some(i => i > -1)
      })

      if (isGotWord) {
        send('game:removeBlocks', indexOfLines, done)
        return
      }

      // Block出現場所を埋めるとゲームオーバー。
      // TODO: 毎回割り算したりする必要はないけど
      if (flatten(state.orderedBlocks)
          .filter(item => !!item)
          .findIndex(b => b.x === boardSize.rows / 2 && b.y === (boardSize.cols - 1)) > 0) {
        send('game:over', done)
      } else {
        send('game:updateNext', newBlock(), done)
        send('game:mainLoop', done)
      }
    },
    over: (data, state) => {
      clearTimeout(state.timer)
      alert('akan')
    },
    handleDown: (data, state, send, done) => {
      if (state.currentBlock.y > 0) {
        if (flatten(state.orderedBlocks).filter(item => !!item).every((b) => {
            return !(state.currentBlock.x === b.x && state.currentBlock.y - 1 === b.y);
          })) {
          send('game:updateCurrent', xtend(state.currentBlock, { y: state.currentBlock.y - 1}), done)
        }
      }
    },
    handleLeft: (data, state, send, done) => {
      if (state.currentBlock.x > 0) {
        if (flatten(state.orderedBlocks).filter(item => !!item).every((b) => {
            return !(state.currentBlock.y === b.y && state.currentBlock.x - 1 === b.x)
          })) {
          send('game:updateCurrent', xtend(state.currentBlock, { x: state.currentBlock.x - 1}), done)
        }
      }
    },
    handleRight: (data, state, send, done) => {
      if (state.currentBlock.x < (state.board.rows - 1)) {
        if (flatten(state.orderedBlocks).filter(item => !!item).every((b) => {
            return !(state.currentBlock.y === b.y && state.currentBlock.x + 1 === b.x)
          })) {
          send('game:updateCurrent', xtend(state.currentBlock, { x: state.currentBlock.x + 1}), done)
        }
      }
    }
  },
  subscriptions: [
    (send, done) => {
      key('down', () => {
        send('game:handleDown', done)
      })
      key('left', () => {
        send('game:handleLeft', done)
      })
      key('right', () => {
        send('game:handleRight', done)
      })
      key('esc', () => {
        send('game:pause', done)
      })
    }
  ]
}
