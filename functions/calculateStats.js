import statCalculator from 'pokemon-stat-calculator'
import statStageToDecimal from './statStageToDecimal'
import getNatureFactor from './getNatureFactor'

function calculateStats(pokemon) {
  const output = {}
  Object.keys(pokemon.baseStats).forEach(stat => {
    const calc = statCalculator[stat === 'hp' ? 'calHpStats' : 'calUnhpStats'].bind(statCalculator)
    const natureFactor = stat !== 'hp' ? getNatureFactor(pokemon) : undefined
    const low = calc(31, [pokemon.baseStats[stat]], [0], pokemon.level, pokemon.nature || undefined)
    const high = calc(31, [pokemon.baseStats[stat]], [252], pokemon.level, pokemon.nature || undefined)
    let modifier = stat !== 'hp' && pokemon.boosts.hasOwnProperty(stat) ? statStageToDecimal(pokemon.boosts[stat]) : 1
    if (stat === 'spd' && pokemon.status === 'par') modifier *= window.room.battle.gen >= 7 ? 0.5 : 0.75
    const lowFinal = low * modifier
    const highFinal = high * modifier
    output[stat] = {low, high, modifier, lowFinal, highFinal}
  })
  return output
}

window.calculateStats = calculateStats

export default calculateStats
