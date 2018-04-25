import setupStatbar from './setupStatbar'

function setupExistingStatbars(root=document) {
  [...root.getElementsByClassName('statbar')].forEach(element => {
    setupStatbar(element)
  })
}

export default setupExistingStatbars
