import mutationWatcher from '@f/mutationWatcher'

(new MutationObserver(mutationWatcher)).observe(document.body, {
  childList: true,
  subtree: true
})
setupExistingStatbars()

})()
