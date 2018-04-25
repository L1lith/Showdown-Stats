import calculateStats from './calculateStats'
import statStageToDecimal from './statStageToDecimal'
import createElement from './createElement'
import sortStats from './sortStats'
import getEffectiveness from './getEffectiveness'
import getStatColorWidth from './getStatColorWidth'

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
  const calculatedStats = calculateStats(pokemon)
  sortStats(Object.keys(pokemon.baseStats)).forEach(stat => {
    const {lowFinal, highFinal, modifier} = calculatedStats[stat]
    const statDiv = createElement('div', {
      classes: ['stat', modifier < 1 ? 'lowered' : modifier > 1 ? 'raised' : undefined],
      parent: stats
    })
    const title = createElement('span', {
      class: 'title',
      parent: statDiv,
      content: stat.toUpperCase()
    })
    const value = createElement('span', {
      class: 'value',
      below: title,
      content: lowFinal.toString()+'-'+highFinal.toString()
    })
    console.log(stat, lowFinal)
    const {backgroundColor, borderColor, width} = getStatColorWidth(stat, Math.round((lowFinal + highFinal) / 2 ))
    const bar = createElement('span', {
      class: 'bar',
      below: value,
      style: {
        width: width.toString() +'px',
        backgroundColor,
        borderColor
      }
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
