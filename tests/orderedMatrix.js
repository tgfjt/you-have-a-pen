const test = require('ava')

const orderedMatrix = require('../src/lib/orderedMatrix')

test('orderdMatrix', (t) => {
  t.plan(2)

  const result1 = orderedMatrix({
    rows: 10,
    cols: 15
  })

  t.is(result1.length, 15, 'orderedMatrix has 15 rows')
  t.is(result1[0].length, 10, 'orderedMatrix-row has 10 cols')
})
