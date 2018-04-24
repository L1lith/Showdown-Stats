function setupExistingStatbars() {
  Array.from(document.getElementsByClassName('statbar')).forEach(element => {
    setupStatbar(element)
  })
}

export default setupExistingStatbars
