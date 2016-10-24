module.exports = (boardSize) => {
  return Array.from(Array(boardSize.cols)).map((col) => {
    return Array.from(Array(boardSize.rows)).map(row => null)
  })
}
