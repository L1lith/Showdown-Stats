import statbarClicked from './statbarClicked'
import hasClassName from './nodeFilters/hasClassName'
import SuperObserver from './SuperObserver'

function setupObservers() {
  const battleObserver = SuperObserver(document.body, node => typeof node.id == 'string' && node.id.startsWith('room-battle'))
  battleObserver.observe((action, nodes)=>{
    console.log('battle', action, nodes)
    if (action === 'added') nodes.forEach(battleDiv => {
      const statbarWatcher = SuperObserver(battleDiv, [
        node => hasClassName(node, 'battle'),
        node => hasClassName(node, 'innerbattle'),
        node => node.getAttribute('aria-label') === 'Active Pokemon',
        node => hasClassName(node, 'statbar')
      ])
      statbarWatcher.observe((action, nodes) => {
        if (action === 'added') {
          nodes.forEach(statbar => statbar.addEventListener('click', statbarClicked.bind(null, statbar)))
        }
      })
    })
  })
}


export default setupObservers
