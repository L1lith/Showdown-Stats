function statStageToDecimal(stage) {
  if (typeof stage != 'number' || isNaN(stage) || !isFinite(stage) || stage % 1 !== 0 || stage > 6 || stage < -6) throw new Error('Invalid Stage Number')
  if (stage > 0) {
    return (stage + 2) / 2
  } else if (stage < 0) {
    return 2 / (-stage + 2)
  } else {
    return 1
  }
}

  export default statStageToDecimal
