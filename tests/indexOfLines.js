const test = require('ava')

const indexOfLines = require('../src/lib/indexOfLines')

test('indexOfLines', (t) => {
  t.plan(6)

  const r1 = indexOfLines([
    [{ charactor: 'P' }, { charactor: 'E' }, { charactor: 'N' }],
  ])

  t.is(r1[0][0].str, 'PEN')
  t.is(r1[0][0].index, 0)
  t.is(r1[0][1].str, 'APPLE')
  t.is(r1[0][1].index, -1)
  t.is(r1[0][2].str, 'PINEAPPLE')
  t.is(r1[0][2].index, -1)
})
