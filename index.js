import mutationWatcher from './functions/mutationWatcher'
import setupExistingStatbars from './functions/setupExistingStatbars'
import './functions/calculateStats'

(new MutationObserver(mutationWatcher)).observe(document.body, {
  childList: true,
  subtree: true
})
setupExistingStatbars()
console.log('Showdown Stats Running')
