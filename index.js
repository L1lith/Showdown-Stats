import mutationWatcher from './functions/mutationWatcher'
import setupExistingStatbars from './functions/setupExistingStatbars'

function run() {
  (new MutationObserver(mutationWatcher)).observe(document.body, {
    childList: true,
    subtree: true
  })
  setupExistingStatbars()
}

window.addEventListener('load', ()=>{
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.textContent = content
  let hasRun = false
  script.onload = () => {hasRun = hasRun || run() || true} // Protects from being called multiple times
  document.getElementsByTagName('head')[0].appendChild(script)
})
