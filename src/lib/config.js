exports.looptime = 1500

exports.words = [
  'PINEAPPLE', 'APPLE', 'PEN'
]

exports.scores = {
  PINEAPPLE: 30,
  APPLE: 15,
  PEN: 10
}

exports.chars = ['P', 'E', 'N', 'P', 'I', 'N', 'E', 'A', 'P', 'P', 'L', 'E', 'A', 'P', 'P', 'L', 'E', 'P', 'E', 'N']

exports.colors = [
  'green',
  'gray'
]

exports.boardSize = {
  rows: 9,
  cols: 12
}

exports.getBlockSize = width => (width > 640) ? 48 : 34
