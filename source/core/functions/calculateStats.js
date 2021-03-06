import statCalculator from 'pokemon-stat-calculator'
import statStageToDecimal from './statStageToDecimal'
import getNatureFactor from './getNatureFactor'

function calculateAllStats(pokemon) {
  const output = {}
  Object.keys(pokemon.baseStats).forEach(stat => {
    output[stat] = calculateStat(pokemon, stat)
  })
  return output
}
export function calculateStat(pokemon, stat) {
  const calc = statCalculator[stat === 'hp' ? 'calHpStats' : 'calUnhpStats'].bind(statCalculator)
  const natureFactor = stat !== 'hp' ? getNatureFactor(pokemon, stat) : undefined
  const low = calc(31, [pokemon.baseStats[stat]], [0], pokemon.level, pokemon.nature || undefined)
  const high = calc(31, [pokemon.baseStats[stat]], [252], pokemon.level, pokemon.nature || undefined)
  let modifier = stat !== 'hp' && pokemon.boosts.hasOwnProperty(stat) ? statStageToDecimal(pokemon.boosts[stat]) : 1
  if (stat === 'spd' && pokemon.status === 'par') modifier *= window.room.battle.gen >= 7 ? 0.5 : 0.75
  const lowFinal = Math.floor(low * modifier)
  const highFinal = Math.floor(high * modifier)
  return {low, high, modifier, lowFinal, highFinal, natureFactor: natureFactor || 1}
}

export default calculateAllStats
