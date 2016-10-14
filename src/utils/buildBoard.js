module.exports = (rows, cols) => {
  const matrix = []

  for (let i = 0; i < rows; i++) {
    matrix[i] = []

    for (let j = 0; j < cols; j++) {
      matrix[i][j] = ''
    }
  }

  return matrix
}
