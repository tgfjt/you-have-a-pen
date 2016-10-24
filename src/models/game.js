const key = require('keymaster')
const xtend = require('xtend')
const flatten = require('lodash.flatten')
const cloneDeep = require('lodash.cloneDeep')

const config = require('../lib/config')
const getIndexOfLines = require('../lib/indexOfLines')
const isGotWord = require('../lib/isGotWord')
const newBlock = require('../lib/newBlock')
const orderedMatrix = require('../lib/orderedMatrix')

const boardSize = config.boardSize

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
    orderedBlocks: orderedMatrix(boardSize)
  },
  reducers: {
    newGame: (data, state) => ({
      timer: null,
      nextBlock: newBlock(),
      currentBlock: newBlock({ current: true }),
      orderedBlocks: orderedMatrix(boardSize)
    }),
    makeCurrentEmpty: () => ({
      currentBlock: {
        charactor: null,
        color: null
      }
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
      const newData = cloneDeep(state.orderedBlocks)

      let rows = []
      let isGotLine = null

      data.forEach((line, i) => {
        line.forEach((word) => {
          if (word.index > -1) {
            isGotLine = i;
            [].forEach.call(word.str, (s, index) => {
              if (newData[i][word.index + index].current) {
                send('game:makeCurrentEmpty', done)
              }

              rows.push(word.index + index)

              newData[i][word.index + index] = null
            })
          }
        })
      })

      setTimeout(() => {
        for (let i = isGotLine + 1; i < newData.length; i++) {
          rows.forEach((r) => {
            if (newData[i][r]) newData[i][r].y = newData[i][r].y - 1
          })
        }
        console.log('Change: moveDown', newData)
        send('game:changeBlocks', newData, done)

        const indexOfLines = getIndexOfLines(newData)

        if (isGotWord(indexOfLines)) {
          console.log('まだある')
          // send('game:removeBlocks', indexOfLines, done)
        } else {
          setTimeout(() => {
            send('game:updateNext', newBlock(), done)
            send('game:mainLoop', done)
          }, 500)
        }
      }, 500)

      console.log('Change: Remove', newData)
      send('game:changeBlocks', newData, done)
    },
    mainLoop: (data, state, send, done) => {
      state.timer = setTimeout(() => {
        console.log('MAINLOOP')
        send('game:loop', done)
      }, state.looptime)
    },
    loop: (data, state, send, done) => {
      if (state.currentBlock.y > 0) {
        if (!flatten(state.orderedBlocks).filter(item => !!item).every((b) => {
          return !(state.currentBlock.x === b.x && state.currentBlock.y - 1 === b.y)
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

      const newBlocks = cloneDeep(state.orderedBlocks)
      newBlocks[state.currentBlock.y][state.currentBlock.x] = state.currentBlock

      send('game:saveBlock', newBlocks, done)

      const indexOfLines = getIndexOfLines(newBlocks)

      if (isGotWord(indexOfLines)) {
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
          return !(state.currentBlock.x === b.x && state.currentBlock.y - 1 === b.y)
        })) {
          send('game:updateCurrent', xtend(state.currentBlock, { y: state.currentBlock.y - 1 }), done)
        }
      }
    },
    handleLeft: (data, state, send, done) => {
      if (state.currentBlock.x > 0) {
        if (flatten(state.orderedBlocks).filter(item => !!item).every((b) => {
          return !(state.currentBlock.y === b.y && state.currentBlock.x - 1 === b.x)
        })) {
          send('game:updateCurrent', xtend(state.currentBlock, { x: state.currentBlock.x - 1 }), done)
        }
      }
    },
    handleRight: (data, state, send, done) => {
      if (state.currentBlock.x < (state.board.rows - 1)) {
        if (flatten(state.orderedBlocks).filter(item => !!item).every((b) => {
          return !(state.currentBlock.y === b.y && state.currentBlock.x + 1 === b.x)
        })) {
          send('game:updateCurrent', xtend(state.currentBlock, { x: state.currentBlock.x + 1 }), done)
        }
      }
    }
  },
  subscriptions: [
    (send, done) => {
      key('down', (e) => {
        e.preventDefault();
        send('game:handleDown', done)
      })
      key('left', (e) => {
        e.preventDefault();
        send('game:handleLeft', done)
      })
      key('right', (e) => {
        e.preventDefault();
        send('game:handleRight', done)
      })
      key('esc', () => {
        send('game:pause', done)
      })
    }
  ]
}
