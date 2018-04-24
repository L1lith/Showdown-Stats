import statbarClicked from './statbarClicked'

function setupStatbar(statbar) {
  statbar.addEventListener('click', statbarClicked.bind(null, statbar))
}

export default setupStatbar
