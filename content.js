(() => {
  console.log('Showdown Stats Tool Starting Up')

  // CORE FUNCTIONS
  function getPokemonFromStatbar(statbar) {
  	if (!(statbar instanceof HTMLElement) || !(statbar.className || "").includes('statbar')) throw 'Invalid Statbar'
  	const {sides} = window.room.battle
  	return (sides[0].active.concat(sides[1].active)).find(pokemon => pokemon !== null && (typeof pokemon.statbarElem == 'object' ? pokemon.statbarElem.toArray() : []).includes(statbar)) || null
  }
	function statStageAsDecimal(stage){
	if (typeof stage != 'number' || isNaN(stage) || !isFinite(stage) || stage % 1 !== 0 || stage > 6 || stage < -6) throw new Error('Invalid Stage Number')
	if (stage > 0) {
		return (stage + 2) / 2
	} else if (stage < 0) {
		return 2 / (-stage + 2)
	} else {
		return 1
	}
}
function standardStat(base, level=100, EV=0, IV=31, nature=1) {
  return Math.floor(Math.floor(((IV + base * 2 + EV / 4) * level / 100 + 5)) * nature)
}
function HPStat(base, level=100, EV=0, IV=31) {
  if (base === 1) return 1
  return Math.floor((IV + base * 2 + EV / 4) * level / 100 + 10 + level)
}
const preferredStatOrder = ['spe', 'hp', 'atk', 'def', 'spa', 'spd']
function sortStats(statsArray) {
	return statsArray.sort((a,b) => preferredStatOrder.indexOf(a) - preferredStatOrder.indexOf(b))
}
  function setActivePokemon(pokemon, statbar, side) {
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
        statRange = [standardStat(pokemon.baseStats[stat], pokemon.level) * statFactor,standardStat(pokemon.baseStats[stat], pokemon.level, 255, typeof pokemon.nature == 'string' ? getNatureFactor(pokemon.nature, stat) : 1) * statFactor]
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

  function statbarClicked(statbar, event, tryNumber = 0) {
    if (tryNumber > 5) return
    if (!window.room) return setTimeout(statDivClicked.bind(null,statbar,event,tryNumber + 1), 100)
    const pokemon = getPokemonFromStatbar(statbar)
    if (pokemon === null) return
    setActivePokemon(pokemon, statbar, pokemon.side)
  }

  function setupExistingStatbars() {
    Array.from(document.getElementsByClassName('statbar')).forEach(element => {
      setupStatbar(element)
    })
  }

  function setupStatbar(statbar) {
    statbar.addEventListener('click', statbarClicked.bind(null, statbar))
  }

  function mutationWatcher(records) {
    records.forEach(record => onMutationRecord(record))
  }

  function onMutationRecord(mutationRecord) {
    Array.from(mutationRecord.addedNodes).filter(node => node.className && node.className.includes('statbar')).forEach(statbar => {
      setupStatbar(statbar)
    })
  }

  function run() {
      (new MutationObserver(mutationWatcher)).observe(document.body, {
        childList: true,
        subtree: true
      })
      setupExistingStatbars()
  }

  // MISC FUNCTIONS

  function createElement(type = 'div', options = {}) {
    if (typeof type != 'string' || type.length < 1) throw 'CreateElement: Invalid Element Type'
    if (typeof options != "object" || options === null) throw 'CreateElement: Options Not Object'
    const element = document.createElement(type)
    if (typeof options.class == 'string' && options.class.length > 1) {
      element.className = options.class
    } else if (Array.isArray(options.classes)) {
      element.className = options.classes.join(' ')
    }
    if (typeof options.content == 'string' && options.content.length > 0) element.textContent = options.content
    if (typeof options.attributes == 'object' && options.attributes !== null) {
      Object.keys(options.attributes).forEach(attribute => {
        element.setAttribute(attribute, options.attributes[attribute])
      })
    }
    if (options.parent instanceof HTMLElement) {
      options.parent.appendChild(element)
    } else if (options.above instanceof HTMLElement) {
      options.above.parentNode.insertBefore(element, options.above)
    } else if (options.below instanceof HTMLElement) {
      options.below.parentNode.insertBefore(element, options.below.nextSibling)
    }
    return element
  }
	function getNatureFactor(nature, stat) {
		if (!NatureChart.hasOwnProperty(nature)) throw 'Invalid Nature'
		if (typeof stat != 'string' || stat.length < 1) throw 'Invalid Stat'
		stat = stat.toLowerCase()
		const [increase, decrease] = NatureChart[nature]
		if (stat === increase) {
			return 1.1
		} else if (stat === decrease) {
			return 0.9
		} else {
			return 1
		}
	}
  function getEffectiveness(pokemon) {
  	if (typeof window.Pokemon == 'function' && !(pokemon instanceof window.Pokemon)) throw 'Input Not Pokemon'
  	const {types} = pokemon
  	const output = {}
  	types.forEach(type => {
  		const chart = TypeChart[type]
  		Object.keys(chart).forEach(typeResult => {
  			if (!output.hasOwnProperty(typeResult)) output[typeResult] = 1
  			output[typeResult] *= chart[typeResult]
  		})
  	})
    Object.keys(output).forEach(key => {
      if (output[key] === 1) delete output[key]
    })
    const sortedOutput = {}
    Object.keys(output).sort((type1, type2) => output[type2] - output[type1]).forEach(property => {
      sortedOutput[property] = output[property]
    })
    return sortedOutput
  }

  // DATA
  const TypeChart = JSON.parse('{"Ghost":{"Normal":0,"Fighting":0,"Poison":0.5,"Bug":0.5,"Ghost":2,"Dark":2},"Rock":{"Normal":0.5,"Fire":0.5,"Water":2,"Grass":2,"Fighting":2,"Poison":0.5,"Ground":2,"Flying":0.5,"Steel":2},"Steel":{"Normal":0.5,"Fire":2,"Grass":0.5,"Ice":0.5,"Fighting":2,"Poison":0,"Ground":2,"Flying":0.5,"Psychic":0.5,"Bug":0.5,"Rock":0.5,"Dragon":0.5,"Steel":0.5,"Fairy":0.5},"Fire":{"Fire":0.5,"Water":2,"Grass":0.5,"Ice":0.5,"Ground":2,"Bug":0.5,"Rock":2,"Steel":0.5,"Fairy":0.5},"Water":{"Fire":0.5,"Water":0.5,"Electric":2,"Grass":2,"Ice":0.5,"Steel":0.5},"Dragon":{"Fire":0.5,"Water":0.5,"Electric":0.5,"Grass":0.5,"Ice":2,"Dragon":2,"Fairy":2},"Grass":{"Fire":2,"Water":0.5,"Electric":0.5,"Grass":0.5,"Ice":2,"Poison":2,"Ground":0.5,"Flying":2,"Bug":2},"Ice":{"Fire":2,"Ice":0.5,"Fighting":2,"Rock":2,"Steel":2},"Bug":{"Fire":2,"Grass":0.5,"Fighting":0.5,"Ground":0.5,"Flying":2,"Rock":2},"Ground":{"Water":2,"Electric":0,"Grass":2,"Ice":2,"Poison":0.5,"Rock":0.5},"Electric":{"Electric":0.5,"Ground":2,"Flying":0.5,"Steel":0.5},"Flying":{"Electric":2,"Grass":0.5,"Ice":2,"Fighting":0.5,"Ground":0,"Bug":0.5,"Rock":2},"Poison":{"Grass":0.5,"Fighting":0.5,"Poison":0.5,"Ground":2,"Psychic":2,"Bug":0.5,"Fairy":0.5},"Psychic":{"Fighting":0.5,"Psychic":0.5,"Bug":2,"Ghost":2,"Dark":2},"Fairy":{"Fighting":0.5,"Poison":2,"Bug":0.5,"Dragon":0,"Dark":0.5,"Steel":2},"Normal":{"Fighting":2,"Ghost":0},"Dark":{"Fighting":2,"Psychic":0,"Bug":2,"Ghost":0.5,"Dark":0.5,"Fairy":2},"Fighting":{"Flying":2,"Psychic":2,"Bug":0.5,"Rock":0.5,"Dark":0.5,"Fairy":2}}')
	const NatureChart = JSON.parse('{"hardy":[null,null],"lonely":["atk","lonely"],"brave":["atk","spe"],"adamant":["atk","spa"],"naughty":["atk","spd"],"bold":["def","atk"],"docile":[null,null],"relaxed":["def","spe"],"impish":["def","spa"],"lax":["def","spd"],"timid":["spe","atk"],"hasty":["spe","def"],"serious":[null,null],"jolly":["spe","spa"],"naive":["spe","sp defense"],"modest":["spa","atk"],"mild":["spa","def"],"quiet":["spa","spd"],"bashful":[null,null],"rash":["spa","spd"],"calm":["spd","atk"],"gentle":["spd","def"],"sassy":["spdefense","spe"],"careful":["spd","spa"],"quirky":[null,null]}')

  // RUN

  run()

})()
