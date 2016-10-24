const test = require('ava')

const rand = require('../src/lib/randInt')

test('randInt', (t) => {
  t.plan(2)

  const result1 = rand(2)
  const result2 = rand(20)

  t.true(result1 >= 0 && result1 <= 2, 'result 0 ~ 2')
  t.true(result2 >= 0 && result2 <= 20, 'result 0 ~ 20')
})
