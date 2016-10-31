const html = require('choo/html')

const block = require('./block')

module.exports = (props, size, pos) => {
  return html`
    <div class="absolute" style="bottom:0;left:0;${pos}">
      ${block(props, size)}
    </div>
  `
}
