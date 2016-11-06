const html = require('choo/html')

const thisUrl = require('../lib/config').thisUrl

module.exports = (state, prev, send) => {
  const result = `Total Score: ${state.result.totalscore}`
  const details = Object.keys(state.result.details)
    .reverse()
    .map(key => `${state.result.details[key]} ${key}S`)
    .join(', ')
  const message = `I have: ${details}!%0a${result}!!%0a`

  return html`
    <div class="overlay">
      <div class="overlay-background"></div>
      <div class="overlay-inner">
        <section class="result">
          <header>
            <div>You have:</div>
            <ul class="result-details">
            ${Object.keys(state.result.details).reverse().map((key) => {
              return html`<li>${state.result.details[key]}<div class="word">${key}s</div></li>`
            })}
            </ul>
            <h2>${result}</h2>
          </header>
          <footer>
            <a href="http://twitter.com/share?url=${thisUrl}&text=${message}&hashtags=youhaveapen" class="tweet" target="_blank">
              Tweet
            </a>
            <button onclick=${(e) => send('game:start')}>NEW GAME!</button>
          </footer>
        </section>
      </div>
    </div>
  `
}
