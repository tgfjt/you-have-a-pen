const test = require('ava')

const newBlock = require('../src/lib/newBlock')

test('newBlocks', (t) => {
  t.plan(6)

  t.true((newBlock().charactor !== undefined && typeof newBlock().charactor === 'string'), 'newBlock has a String charactor ')
  t.true((newBlock().color !== undefined && typeof newBlock().color === 'string'), 'newBlock has a String color ')
  t.true(typeof newBlock().x === 'number', 'newBlock has a Number x')
  t.true(typeof newBlock().y === 'number', 'newBlock has a Number y')
  t.true(newBlock().current === false, 'newBlock is not current')
  t.true(newBlock({ current: true }).current === true, 'newBlock is current')
})
