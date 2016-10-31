const test = require('ava')

const indexOfLines = require('../src/lib/indexOfLines')

test('indexOfLines', (t) => {
  t.plan(6)

  const r1 = indexOfLines([
    [
      { charactor: 'P', color: 'light-gray' },
      { charactor: 'E', color: 'light-gray' },
      { charactor: 'P', color: 'light-green' },
      { charactor: 'E', color: 'light-green' },
      { charactor: 'N', color: 'light-green' }
    ]
  ])

  t.is(r1[0][0].str, 'PINEAPPLE')
  t.is(r1[0][0].index, -1)
  t.is(r1[0][1].str, 'APPLE')
  t.is(r1[0][1].index, -1)
  t.is(r1[0][2].str, 'PEN')
  t.is(r1[0][2].index, 2)
})
