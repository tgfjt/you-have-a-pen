const choo = require('choo')
const html = require('choo/html')
const css = require('sheetify')

const gameView = require('./views/gameView')

css('tachyons')

const app = choo()

if (process.env.NODE_ENV !== 'production') {
  // const log = require('choo-log')
  // app.use(log())
}

app.model(require('./models/game'))
app.model(require('./models/result'))

app.router(route => [
  route('/', gameView)
])

const tree = app.start()
document.body.appendChild(tree)
