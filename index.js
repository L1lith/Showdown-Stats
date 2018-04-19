const content = `console.log('Showdown Stats Tool Starting Up')

// CORE FUNCTIONS
function setActivePokemon(pokemon, statsDiv, side) {
  const statDivs = Array.from(statsDiv.childNodes).filter(node => node.className.includes('stats'))
  if (statDivs.length > 1) return
  if (statDivs.length > 0) {
    statDivs[0].parentNode.removeChild(statDivs[0])
    return
  }
  const stats = createElement('div', {
    class: 'stats'
  })
  Object.keys(pokemon.baseStats).forEach(stat => {
    const statDiv = createElement('span', {
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
  statsDiv.appendChild(stats)
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
// RUN


run()

// MISC FUNCTIONS

function createElement(type = 'div', options = {}) {
  if (typeof type != 'string' || type.length < 1) throw 'CreateElement: Invalid Element Type'
  if (typeof options != "object" || options === null) throw 'CreateElement: Options Not Object'
  const element = document.createElement(type)
  if (typeof options.class == 'string' && options.class.length > 1) {
    element.className = options.class
  } else if (Array.isArray(options.classes)) {
    element.className = optoins.classes.join(' ')
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
`

window.addEventListener('load', ()=>{
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.textContent = content
  document.body.appendChild(script);
})
