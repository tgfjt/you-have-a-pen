const html = require('choo/html')

const block = require('./block')

module.exports = (state, pos) => {
  return html`
    <div class="absolute" style="bottom:0;left:0;${pos}">
      ${block(state)}
    </div>
  `
}
