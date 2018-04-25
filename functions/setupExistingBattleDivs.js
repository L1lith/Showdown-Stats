import setupBattleDiv from './setupBattleDiv'

function setupExistingBattleDivs() {
  [...document.body.childNodes].filter(element => typeof element.id == 'string' && element.id.startsWith('room-battle')).forEach(setupBattleDiv)
}

export default setupExistingBattleDivs
