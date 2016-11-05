const html = require('choo/html')


module.exports = (state, prev, send) => html`
  <main class="center">
    <p>Thank you!</p>
    Result: ${state.result.totalscore} points!
    <div>
      <button onclick=${(e) => send('game:start')}>NEW GAME</button>
    </div>
  </main>
`
