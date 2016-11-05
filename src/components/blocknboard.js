const html = require('choo/html')

const block = require('./block')

module.exports = (props, size, pos, selected, send) => {
  const handleClick = props.current ? () => {} : (e) => {
    if (typeof e.keyCode === 'undefined' || e.keyCode === 13) {
      e.preventDefault()
      send('game:replaceThis', props)
    }
  }

  const selectedStyle = selected ? ' is-selected' : ''

  return html`
    <a tabindex="0" role="button" class="absolute block-cover${selectedStyle}" style="bottom:0;left:0;${pos}" onclick=${handleClick} onkeydown=${handleClick}>
      ${block(props, size)}
    </a>
  `
}
