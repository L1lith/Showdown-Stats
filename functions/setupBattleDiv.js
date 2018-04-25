import setupExistingStatbars from './setupExistingStatbars'
import setupStatbar from './setupStatbar'

function setupBattleDiv(battleDiv) {
  (new MutationObserver(activeDivRecords => {
    activeDivRecords.forEach(activeDivRecord => {
      [...activeDivRecord.addedNodes].filter(node => typeof node.className == 'string' && node.className.startsWith('statbar')).forEach(statbar => {
        setupStatbar(statbar)
      })
    })
  })).observe(battleDiv, {childList: true, subtree: true})
  setupExistingStatbars(battleDiv)
}

export default setupBattleDiv
