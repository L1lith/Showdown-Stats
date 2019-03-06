const preferredStatOrder = ['spe', 'hp', 'atk', 'def', 'spa', 'spd']

function sortStats(statsArray) {
  return statsArray.sort((a,b) => preferredStatOrder.indexOf(a) - preferredStatOrder.indexOf(b))
}

export default sortStats
