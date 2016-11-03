const html = require('choo/html')

const block = require('./block')

module.exports = (props, size, pos, send) => {
  const handleClick = props.current ? () => {} : (e) => {
    e.preventDefault()
    send('game:replaceThis', props)
  }

  return html`
    <div class="absolute" style="bottom:0;left:0;${pos}" onclick=${handleClick}>
      ${block(props, size)}
    </div>
  `
}
