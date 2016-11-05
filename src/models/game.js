const key = require('keymaster')
const xtend = require('xtend')
const flatten = require('lodash.flatten')
const cloneDeep = require('lodash.cloneDeep')

const config = require('../lib/config')
const getIndexOfLines = require('../lib/indexOfLines')
const isGotWord = require('../lib/isGotWord')
const newBlock = require('../lib/newBlock')
const orderedMatrix = require('../lib/orderedMatrix')
const isNeighbor = require('../lib/isNeighbor')

const boardSize = config.boardSize

module.exports = {
  namespace: 'game',
  state: {
    timer: null,
    started: false,
    ended: false,
    pause: false,
    looptime: 1000,
    size: config.getBlockSize(window.innerWidth),
    board: boardSize,
    nextBlock: {
      charactor: null,
      color: null
    },
    currentBlock: {
      charactor: null,
      color: null
    },
    orderedBlocks: orderedMatrix(boardSize),
    selectedBlock: null
  },
  reducers: {
    newGame: (data, state) => ({
      timer: null,
      started: true,
      ended: false,
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
    updateNext: (data, state) => ({
      nextBlock: data,
      currentBlock: xtend(state.nextBlock, { current: true })
    }),
    updateCurrent: (data, state) => ({
      currentBlock: data
    }),
    setPause: (data, state) => ({
      pause: data
    }),
    changeBlocks: (data, state) => ({
      orderedBlocks: data
    }),
    selectBlock: (data, state) => ({
      selectedBlock: data
    }),
    stopTimer: (data, state) => ({ timer: null }),
    end: (data, state) => ({
      started: false,
      ended: true
    })
  },
  effects: {
    start: (data, state, send, done) => {
      send('game:stopTimer', null, done)
      send('result:reset', null, done)
      send('game:newGame', done)
      send('game:mainLoop', done)
    },
    stop: (data, state, send, done) => {
      clearTimeout(state.timer)
      send('game:stopTimer', done)
    },
    pause: (data, state, send, done) => {
      if (!state.pause) {
        send('game:stop', null, done)
        send('game:setPause', true, done)
      } else {
        send('game:setPause', false, done)
        send('game:mainLoop', done)
      }
    },
    removeBlocks: (indexOfLines, state, send, done) => {
      const newData = cloneDeep(state.orderedBlocks)

      let rows = []
      let isGotLine = null
      let gotWord = ''

      // TODO: みづらい
      indexOfLines.forEach((line, i) => {
        for (let j = 0; j < line.length; j++) {
          if (line[j].index > -1) {
            isGotLine = i
            gotWord = line[j].str

            Array.prototype.forEach.call(line[j].str, (s, index) => {
              if (newData[i][line[j].index + index].current) {
                send('game:makeCurrentEmpty', done)
              }

              rows.push(line[j].index + index)

              newData[i][line[j].index + index] = null
            })

            if (gotWord === 'PINEAPPLE') {
              break
            }
          }
        }
      })

      // 下ろす
      // TODO: みづらい
      setTimeout(() => {
        for (let i = isGotLine + 1; i < newData.length; i++) {
          rows.forEach((r) => {
            if (newData[i][r]) {
              const newBl = xtend(newData[i][r], { y: newData[i][r].y - 1 })
              newData[i][r] = null
              newData[i - 1][r] = newBl
            }
          })
        }
        send('game:changeBlocks', newData, done)

        const indexOfLines = getIndexOfLines(newData)

        if (isGotWord(indexOfLines)) {
          send('game:removeBlocks', indexOfLines, done)
          return
        } else if (state.timer === null) {
          setTimeout(() => {
            send('game:updateNext', newBlock(), done)
            send('game:mainLoop', done)
          }, state.looptime / 1.5)
        }
      }, state.looptime / 1.5)

      send('result:remove', gotWord, done)
      send('game:changeBlocks', newData, done)
    },
    replaceThis: (data, state, send, done) => {
      if (state.selectedBlock === null) {
        send('game:selectBlock', data, done)
      } else if (state.selectedBlock.color === data.color) {
        if (isNeighbor(data.x, state.selectedBlock.x) ||
            isNeighbor(data.y, state.selectedBlock.y)) {
          const newBlocks = cloneDeep(state.orderedBlocks)
          newBlocks[data.y][data.x].charactor = state.orderedBlocks[state.selectedBlock.y][state.selectedBlock.x].charactor
          newBlocks[state.selectedBlock.y][state.selectedBlock.x].charactor = state.orderedBlocks[data.y][data.x].charactor

          newBlocks[data.y][data.x].selected = true
          newBlocks[state.selectedBlock.y][state.selectedBlock.x].selected = true

          send('game:changeBlocks', newBlocks, done)

          const indexOfLines = getIndexOfLines(newBlocks)

          if (isGotWord(indexOfLines)) {
            send('game:removeBlocks', indexOfLines, done)
          }
          send('game:selectBlock', null, done)
        } else {
          send('game:selectBlock', null, done)
        }
      } else {
        send('game:selectBlock', null, done)
      }
    },
    mainLoop: (data, state, send, done) => {
      state.timer = setTimeout(() => {
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
      send('game:stopTimer', null, done)

      const newBlocks = cloneDeep(state.orderedBlocks)
      newBlocks[state.currentBlock.y][state.currentBlock.x] = state.currentBlock

      send('game:changeBlocks', newBlocks, done)

      const indexOfLines = getIndexOfLines(newBlocks)

      if (isGotWord(indexOfLines)) {
        send('game:removeBlocks', indexOfLines, done)
        return
      } else {
        newBlocks[state.currentBlock.y][state.currentBlock.x] = xtend(state.currentBlock, { current: false })
        send('game:changeBlocks', newBlocks, done)
      }

      // Block出現場所を埋めるとゲームオーバー。
      // TODO: 毎回割り算したりする必要はないけど
      if (flatten(state.orderedBlocks)
          .filter(item => !!item)
          .findIndex(b => b.x === Math.round(boardSize.rows / 2) && b.y === (boardSize.cols - 1)) > 0) {
        send('game:over', done)
      } else {
        send('game:updateNext', newBlock(), done)
        send('game:mainLoop', done)
      }
    },
    over: (data, state, send, done) => {
      send('game:stopTimer', null, done)
      send('game:end', null, done)
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
      let touchstartX = 0
      let touchstartY = 0
      let touchmoveX = 0
      let touchmoveY = 0
      let swipeTimer = null
      let twiceMoveTimer = null
      const swipeThreshold = 10

      const handleSwipe = () => {
        if (Math.abs(touchstartX - touchmoveX) > swipeThreshold) {
          if (touchstartX > touchmoveX) {
            send('game:handleLeft', done)
          } else {
            send('game:handleRight', done)
          }
        }

        if (Math.abs(touchstartY - touchmoveY) > 50 && touchstartY < touchmoveY) {
          send('game:handleDown', done)
        }
      }

      const swipeLoop = () => {
        handleSwipe()
        swipeTimer = setTimeout(swipeLoop, 100)
      }

      key('down', (e) => {
        e.preventDefault()
        send('game:handleDown', done)
      })
      key('left', (e) => {
        e.preventDefault()
        send('game:handleLeft', done)
      })
      key('right', (e) => {
        e.preventDefault()
        send('game:handleRight', done)
      })
      key('esc', () => {
        send('game:pause', done)
      })

      window.onerror = (msg, file, line, column, err) => {
        alert('予期せぬエラー')
        throw new Error(`UncaughtError:${msg}`)
      }

      if (window.Touch) {
        window.addEventListener('touchstart', (e) => {
          touchstartX = touchmoveX = e.changedTouches[0].screenX
          touchstartY = touchmoveY = e.changedTouches[0].screenY

          setTimeout(() => {
            handleSwipe()
          }, 4)

          twiceMoveTimer = setTimeout(() => {
            swipeLoop()
          }, 350)
        }, false)

        window.addEventListener('touchend', (e) => {
          clearTimeout(swipeTimer)
          clearTimeout(twiceMoveTimer)
        }, false)

        window.addEventListener('touchmove', (e) => {
          e.preventDefault()
          touchmoveX = e.changedTouches[0].screenX
          touchmoveY = e.changedTouches[0].screenY
        }, false)
      }
    }
  ]
}
