function calculateStandardStat(base, level=100, EV=0, IV=31, nature=1) {
  return Math.floor(Math.floor(((IV + base * 2 + EV / 4) * level / 100 + 5)) * nature)
}

export default calculateStandardStat
