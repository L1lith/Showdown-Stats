function calculateHPStat(base, level=100, EV=0, IV=31) {
  if (base === 1) return 1
  return Math.floor((IV + base * 2 + EV / 4) * level / 100 + 10 + level)
}

export default calculateHPStat
