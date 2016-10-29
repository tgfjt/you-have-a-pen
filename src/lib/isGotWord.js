module.exports = (indexOfLines) => {
  return indexOfLines.some(row => row.some(word => word.index > -1))
}
