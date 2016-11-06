module.exports = (boardSize) => {
  return Array.apply(null, Array(boardSize.cols)).map((col) => {
    return Array.apply(null, Array(boardSize.rows)).map(row => null)
  })
}
