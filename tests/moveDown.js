const test = require('ava')

const isGotWord = require('../src/lib/isGotWord')

test('isGotWord', (t) => {
  t.plan(2)

  const itemFalse = { index: -1 }

  t.false(isGotWord([
    [itemFalse, itemFalse, itemFalse],
    [itemFalse, itemFalse, itemFalse]
  ]), 'isGotWord is false')

  t.true(isGotWord([
    [itemFalse, itemFalse, itemFalse],
    [itemFalse, { index: 1 }, itemFalse]
  ]), 'isGotWord is true')
})
