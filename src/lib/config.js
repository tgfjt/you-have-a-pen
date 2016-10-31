exports.words = [
  'PINEAPPLE', 'APPLE', 'PEN'
]

exports.scores = {
  PINEAPPLE: 30,
  APPLE: 15,
  PEN: 10
}

exports.chars = [
  'P', 'P', 'P', 'I', 'I', 'E', 'E', 'N', 'N', 'A', 'L'
]

exports.colors = [
  'light-green',
  'light-gray'
]

exports.boardSize = {
  rows: 12,
  cols: 15
}

exports.getBlockSize = width => (width > 640) ? 32 : 24
