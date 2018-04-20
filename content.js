(() => {
  console.log('Showdown Stats Tool Starting Up')

  // CORE FUNCTIONS
  function setActivePokemon(pokemon, statsDiv, side) {
    const statDivs = Array.from(statsDiv.childNodes).filter(node => node.className.includes('stats'))
    if (statDivs.length > 1) return
    if (statDivs.length > 0) {
      statDivs[0].parentNode.removeChild(statDivs[0])
      return
    }
    const showdownStatsElement = createElement('div', {
      class: 'showdown-stats'
    })
    const stats = createElement('div', {
      class: 'stats',
      parent: showdownStatsElement
    })
    Object.keys(pokemon.baseStats).forEach(stat => {
      const statDiv = createElement('div', {
        class: 'stat',
        parent: stats
      })
      const title = createElement('span', {
        class: 'title',
        parent: statDiv,
        content: stat
      })
      const value = createElement('span', {
        class: 'value',
        below: title,
        content: pokemon.baseStats[stat].toString()
      })
    })
    const effectiveness = createElement('div', {
      class: 'effectiveness',
      parent: showdownStatsElement
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
    statsDiv.appendChild(showdownStatsElement)
  }

  function statDivClicked(div, event, tryNumber = 0) {
    if (tryNumber > 5) return
    if (!window.room) return setTimeout(statDivClicked.bind(null,div,event,tryNumber + 1), 100)
    const {
      className
    } = div
    if (typeof className != 'string' || className.length < 1) return
    let side
    if (className.includes('lstatbar')) {
      side = 1
    } else if (className.includes('rstatbar')) {
      side = 0
    } else {
      return
    }
    side = window.room.battle.sides[side]
    let selectedPokemon = side.active.filter(pokemon => Array.from(pokemon.statbarElem).includes(div))
    if (selectedPokemon.length != 1) return
    setActivePokemon(selectedPokemon[0], div, side)
  }

  function setupExistingStatDivs() {
    Array.from(document.getElementsByClassName('statbar')).forEach(element => {
      setupStatDiv(element)
    })
  }

  function setupStatDiv(statDiv) {
    statDiv.addEventListener('click', statDivClicked.bind(null, statDiv))
  }

  function mutationWatcher(records) {
    records.forEach(record => onMutationRecord(record))
  }

  function onMutationRecord(mutationRecord) {
    Array.from(mutationRecord.addedNodes).filter(node => node.className && node.className.includes('statbar')).forEach(statDiv => {
      setupStatDiv(statDiv)
    })
  }

  function run() {
      (new MutationObserver(mutationWatcher)).observe(document.body, {
        childList: true,
        subtree: true
      })
      setupExistingStatDivs()
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
  TypeChart = JSON.parse('{"Ghost":{"Normal":0,"Fighting":0,"Poison":0.5,"Bug":0.5,"Ghost":2,"Dark":2},"Rock":{"Normal":0.5,"Fire":0.5,"Water":2,"Grass":2,"Fighting":2,"Poison":0.5,"Ground":2,"Flying":0.5,"Steel":2},"Steel":{"Normal":0.5,"Fire":2,"Grass":0.5,"Ice":0.5,"Fighting":2,"Poison":0,"Ground":2,"Flying":0.5,"Psychic":0.5,"Bug":0.5,"Rock":0.5,"Dragon":0.5,"Steel":0.5,"Fairy":0.5},"Fire":{"Fire":0.5,"Water":2,"Grass":0.5,"Ice":0.5,"Ground":2,"Bug":0.5,"Rock":2,"Steel":0.5,"Fairy":0.5},"Water":{"Fire":0.5,"Water":0.5,"Electric":2,"Grass":2,"Ice":0.5,"Steel":0.5},"Dragon":{"Fire":0.5,"Water":0.5,"Electric":0.5,"Grass":0.5,"Ice":2,"Dragon":2,"Fairy":2},"Grass":{"Fire":2,"Water":0.5,"Electric":0.5,"Grass":0.5,"Ice":2,"Poison":2,"Ground":0.5,"Flying":2,"Bug":2},"Ice":{"Fire":2,"Ice":0.5,"Fighting":2,"Rock":2,"Steel":2},"Bug":{"Fire":2,"Grass":0.5,"Fighting":0.5,"Ground":0.5,"Flying":2,"Rock":2},"Ground":{"Water":2,"Electric":0,"Grass":2,"Ice":2,"Poison":0.5,"Rock":0.5},"Electric":{"Electric":0.5,"Ground":2,"Flying":0.5,"Steel":0.5},"Flying":{"Electric":2,"Grass":0.5,"Ice":2,"Fighting":0.5,"Ground":0,"Bug":0.5,"Rock":2},"Poison":{"Grass":0.5,"Fighting":0.5,"Poison":0.5,"Ground":2,"Psychic":2,"Bug":0.5,"Fairy":0.5},"Psychic":{"Fighting":0.5,"Psychic":0.5,"Bug":2,"Ghost":2,"Dark":2},"Fairy":{"Fighting":0.5,"Poison":2,"Bug":0.5,"Dragon":0,"Dark":0.5,"Steel":2},"Normal":{"Fighting":2,"Ghost":0},"Dark":{"Fighting":2,"Psychic":0,"Bug":2,"Ghost":0.5,"Dark":0.5,"Fairy":2},"Fighting":{"Flying":2,"Psychic":2,"Bug":0.5,"Rock":0.5,"Dark":0.5,"Fairy":2}}')

  // RUN

  run()

})()
