import setupStatbar from './setupStatbar'
import setupBattleDiv from './setupBattleDiv'
import setupExistingStatbars from './setupExistingStatbars'

function setupMutationWatchers() {
  (new MutationObserver(records => {
    records.forEach(record => {
      const added = [...record.addedNodes]
      added.filter(element => typeof element.id == 'string' && element.id.startsWith('room-battle')).forEach(setupBattleDiv)
    })
  })).observe(document.body, {childList: true})
}


export default setupMutationWatchers
