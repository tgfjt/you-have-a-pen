const key = require('keymaster')
const xtend = require('xtend')
const flatten = require('lodash.flatten')
const cloneDeep = require('lodash.cloneDeep')

const config = require('../lib/config')
const getIndexOfLines = require('../lib/indexOfLines')
const isGotWord = require('../lib/isGotWord')
const newBlock = require('../lib/newBlock')
const startedRandBlocks = require('../lib/startedRandBlocks')
const orderedMatrix = require('../lib/orderedMatrix')
const isNeighbor = require('../lib/isNeighbor')
const sayIt = require('../lib/sayIt')

const boardSize = config.boardSize

module.exports = {
  namespace: 'game',
  state: {
    timer: null,
    started: false,
    ended: false,
    pause: false,
    selectSound: new window.Audio('sound.mp3'),
    bgm: new window.Audio('bgm.mp3'),
    volume: true,
    looptime: config.looptime,
    size: config.getBlockSize(window.innerWidth),
    board: boardSize,
    nextBlock: { charactor: null, color: null },
    currentBlock: { charactor: null, color: null },
    orderedBlocks: orderedMatrix(boardSize),
    selectedBlock: null,
    skill: 0,
    waitingSkill: false
  },
  reducers: {
    newGame: (state, data) => ({
      timer: null,
      started: true,
      ended: false,
      nextBlock: newBlock(),
      currentBlock: newBlock({ current: true }),
      orderedBlocks: data
    }),
    setLooptime: (state, data) => ({ looptime: data }),
    makeCurrentEmpty: () => ({
      currentBlock: { charactor: null, color: null }
    }),
    updateNext: (state, data) => ({
      nextBlock: data,
      currentBlock: xtend(state.nextBlock, { current: true })
    }),
    updateCurrent: (state, data) => ({ currentBlock: data }),
    setPause: (state, data) => ({ pause: data }),
    updateBlocks: (state, data) => ({ orderedBlocks: data }),
    selectBlock: (state, data) => ({ selectedBlock: data }),
    stopTimer: (state, data) => ({ timer: null }),
    updateSkillCount: (state, data) => ({ skill: data }),
    setWaitingSkill: (state, data) => ({ waitingSkill: data }),
    setVolumeState: (state, data) => ({ volume: data }),
    end: (state, data) => ({ started: false, ended: true })
  },
  effects: {
    start: (state, data, send, done) => {
      const firstBlocks = Object.assign(orderedMatrix(boardSize), startedRandBlocks())

      send('game:stopTimer', null, done)
      send('result:reset', null, done)
      send('game:newGame', firstBlocks, done)

      setTimeout(() => {
        const indexOfLines = getIndexOfLines(firstBlocks)

        if (isGotWord(indexOfLines)) {
          send('game:removeBlocks', indexOfLines, done)
        }
      }, state.looptime)

      send('game:mainLoop', done)
      send('game:updateSkillCount', 3, done)
      send('game:setVolume', null, done)

      state.bgm.loop = true
      if (state.volume) state.bgm.play()
    },
    stop: (state, data, send, done) => {
      clearTimeout(state.timer)
      send('game:stopTimer', done)
    },
    pause: (state, data, send, done) => {
      if (!state.pause) {
        send('game:stop', null, done)
        send('game:setPause', true, done)
      } else {
        send('game:setPause', false, done)
        send('game:mainLoop', done)
      }
    },
    setVolume: (state, data, send, done) => {
      state.bgm.volume = state.volume ? 0.5 : 0
      state.selectSound.volume = state.volume ? 0.2 : 0
    },
    toggleVolume: (state, data, send, done) => {
      send('game:setVolumeState', !state.volume, done)
      if (!state.volume) {
        state.bgm.play()
      } else {
        state.bgm.pause()
      }
    },
    speedup: (state, score, send, done) => {
      if (score > 10000) {
        send('game:setLooptime', 200, done)
      } else if (score > 7000) {
        send('game:setLooptime', 300, done)
      } else if (score > 5000) {
        send('game:setLooptime', 500, done)
      } else if (score > 3000) {
        send('game:setLooptime', 800, done)
      } else if (score > 2000) {
        send('game:setLooptime', 900, done)
      } else if (score > 1000) {
        send('game:setLooptime', 1000, done)
      } else if (score > 500) {
        send('game:setLooptime', 1200, done)
      }
    },
    removeBlocks: (state, indexOfLines, send, done) => {
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

      sayIt(gotWord, state.volume)

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
        send('game:updateBlocks', newData, done)

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
      send('game:updateBlocks', newData, done)
    },
    replaceThis: (state, data, send, done) => {
      state.selectSound.currentTime = 0

      if (state.waitingSkill) {
        const newBlocks = cloneDeep(state.orderedBlocks)
        newBlocks[data.y][data.x].color = config.colors.find(c => c !== newBlocks[data.y][data.x].color)
        send('game:selectBlock', null, done)
        send('game:setWaitingSkill', false, done)
        send('game:pause', null, done)
        send('game:updateBlocks', newBlocks, done)

        const indexOfLines = getIndexOfLines(newBlocks)

        if (isGotWord(indexOfLines)) {
          send('game:removeBlocks', indexOfLines, done)
        }
        return
      }

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
          if (state.volueme) state.selectSound.play()

          send('game:updateBlocks', newBlocks, done)

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
    mainLoop: (state, data, send, done) => {
      state.timer = setTimeout(() => {
        send('game:loop', done)
      }, state.looptime)
    },
    loop: (state, data, send, done) => {
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
    next: (state, data, send, done) => {
      send('game:stopTimer', null, done)

      const newBlocks = cloneDeep(state.orderedBlocks)
      newBlocks[state.currentBlock.y][state.currentBlock.x] = state.currentBlock

      send('game:updateBlocks', newBlocks, done)

      const indexOfLines = getIndexOfLines(newBlocks)

      if (isGotWord(indexOfLines)) {
        send('game:removeBlocks', indexOfLines, done)
        return
      } else {
        newBlocks[state.currentBlock.y][state.currentBlock.x] = xtend(state.currentBlock, { current: false })
        send('game:updateBlocks', newBlocks, done)
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
    over: (state, data, send, done) => {
      send('game:stopTimer', null, done)
      send('game:end', null, done)
    },
    handleDown: (state, data, send, done) => {
      if (!state.pause && state.currentBlock.y > 0) {
        if (flatten(state.orderedBlocks).filter(item => !!item).every((b) => {
          return !(state.currentBlock.x === b.x && state.currentBlock.y - 1 === b.y)
        })) {
          send('game:updateCurrent', xtend(state.currentBlock, { y: state.currentBlock.y - 1 }), done)
        }
      }
    },
    handleLeft: (state, data, send, done) => {
      if (!state.pause && state.currentBlock.x > 0) {
        if (flatten(state.orderedBlocks).filter(item => !!item).every((b) => {
          return !(state.currentBlock.y === b.y && state.currentBlock.x - 1 === b.x)
        })) {
          send('game:updateCurrent', xtend(state.currentBlock, { x: state.currentBlock.x - 1 }), done)
        }
      }
    },
    handleRight: (state, data, send, done) => {
      if (!state.pause && state.currentBlock.x < (state.board.rows - 1)) {
        if (flatten(state.orderedBlocks).filter(item => !!item).every((b) => {
          return !(state.currentBlock.y === b.y && state.currentBlock.x + 1 === b.x)
        })) {
          send('game:updateCurrent', xtend(state.currentBlock, { x: state.currentBlock.x + 1 }), done)
        }
      }
    },
    useSkill: (state, data, send, done) => {
      if (!state.ended && state.started && state.skill > 0) {
        send('game:pause', null, done)
        send('game:setWaitingSkill', true, done)
        send('game:updateSkillCount', state.skill - 1, done)
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
        console.log('予期せぬエラー')
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
