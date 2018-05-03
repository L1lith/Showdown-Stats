import statbarClicked from './statbarClicked'
import hasClassName from './nodeFilters/hasClassName'
import SuperObserver from './SuperObserver'
import {setupMoves} from './moveManager'

function setupObservers() {
  const battleObserver = SuperObserver(document.body, node => typeof node.id == 'string' && node.id.startsWith('room-battle'))
  battleObserver.observe((action, nodes)=>{
    if (action === 'added') nodes.forEach(battleDiv => {
      const statbarWatcher = SuperObserver(battleDiv, [
        node => hasClassName(node, 'battle'),
        node => hasClassName(node, 'innerbattle'),
        node => node.getAttribute('aria-label') === 'Active Pokemon',
        node => hasClassName(node, 'statbar')
      ])
      statbarWatcher.observe((action, nodes) => {
        if (action === 'added') {
          nodes.forEach(statbar => {
            statbar.addEventListener('click', statbarClicked.bind(null, statbar))
          })
        }
      })
      const moveObserver = SuperObserver(battleDiv, [
        node => hasClassName(node, 'battle-controls'),
        node => hasClassName(node, 'controls'),
        node => hasClassName(node, 'movecontrols'),
        node => hasClassName(node, 'movemenu'),
        node => node.name === 'chooseMove'
      ])
      moveObserver.observe((action, nodes) => {
        if (action === 'added') {
          setupMoves(nodes)
        }
      })
    })
  })
}


export default setupObservers
