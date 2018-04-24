import createElement from './createElement'
import sortStats from './sortStats'

function togglePokemonStats(pokemon, statbar, side) {
  const statDivs = Array.from(statbar.childNodes).filter(node => node.className.includes('stats'))
  if (statDivs.length > 0) {
    statDivs.forEach(statDiv => statDiv.parentNode.removeChild(statDiv))
    return
  }
  const showdownStatsElement = createElement('div', {
    class: 'showdown-stats'
  })
  const stats = createElement('div', {
    class: 'stats',
    parent: showdownStatsElement
  })
  createElement('h3', {
    parent: stats,
    content: 'Stats'
  })
  sortStats(Object.keys(pokemon.baseStats)).forEach(stat => {
    stat = stat.toLowerCase()
    const statFactor = stat !== 'hp' && pokemon.boosts.hasOwnProperty(stat) ? statStageAsDecimal(pokemon.boosts[stat]) : 1
    if (statFactor === 'spd' && pokemon.status === 'par') statFactor *= window.room.battle.gen >= 7 ? 0.5 : 0.75
    const statDiv = createElement('div', {
      classes: ['stat', statFactor < 1 ? 'lowered' : statFactor > 1 ? 'raised' : undefined],
      parent: stats
    })
    const title = createElement('span', {
      class: 'title',
      parent: statDiv,
      content: stat.toUpperCase()
    })
    let statRange = []
    if (stat === 'hp') {
      statRange = [HPStat(pokemon.baseStats[stat], pokemon.level),HPStat(pokemon.baseStats[stat], pokemon.level, 255)]
    } else {
      statRange = [standardStat(pokemon.baseStats[stat], pokemon.level), standardStat(pokemon.baseStats[stat], pokemon.level, 255, typeof pokemon.nature == 'string' ? getNatureFactor(pokemon.nature, stat) : 1)]
      statRange = statRange.map(value => value * statFactor)
    }
    statRange = statRange.map(value => Math.floor(value))
    const value = createElement('span', {
      class: 'value',
      below: title,
      content: statRange[0].toString()+'-'+statRange[1].toString()
    })
  })
  const effectiveness = createElement('div', {
    class: 'effectiveness',
    parent: showdownStatsElement
  })
  createElement('h3', {
    parent: effectiveness,
    content: 'Effectiveness'
  })
  const effectivenessChart = getEffectiveness(pokemon)
  Object.keys(effectivenessChart).forEach(type => {
    const typeElement = createElement('div', {
      classes: ['type', 'times'+effectivenessChart[type].toString().replace('.','-')],
      parent: effectiveness
    })
    const title = createElement('span', {
      classes: 'title',
      content: type,
      parent: typeElement
    })
    const value = createElement('span', {
      class: 'value',
      content: 'x'+effectivenessChart[type].toString(),
      parent: typeElement
    })
  })
  statbar.appendChild(showdownStatsElement)
}

export default togglePokemonStats
