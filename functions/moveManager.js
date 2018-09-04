import getPokemonFromStatbar from './getPokemonFromStatbar'
import estimateDamage from './estimateDamage'
import createElement from './createElement'
import arrayUnique from './objectFunctions/arrayUnique'
import indexOfMax from './indexOfMax'

let moves = null

export function setupMoves(nodes) {
  if (!room || !room.battle || room.battle.gameType !== 'singles' ) return
  if (moves === null || moves[0].parentNode !== nodes[0].parentNode) {
    moves = nodes
  } else {
    moves.push(...nodes)
  }
  update()
}
export function update() {
  if (moves === null || moves.length < 1) return
  const pokemon = room.battle.sides[0].active[0]
  const opponent = room.battle.sides[1].active[0]
  if (pokemon === null || opponent === null) return
  const damageEstimates = []
  moves.forEach((move, index) => {
    [...move.getElementsByClassName('move-stats')].forEach(moveStats => moveStats.parentNode.removeChild(moveStats))
    const estimate = estimateDamage(pokemon, move, opponent)
    const classes = [...move.classList]
    if (classes.includes('strongest-move')) move.classList.remove('strongest-move')
    damageEstimates[index] = estimate || [0, 0]
    damageEstimates[index] = (damageEstimates[index][0] + damageEstimates[index][1]) / 2
    if (estimate === null) return
    const moveStats = createElement('div', {
      class: 'move-stats',
      content: arrayUnique(estimate).sort((a, b) => a - b).map(value => value+'%').join('-'),
      parent: move
    })
  })
  if (!damageEstimates.every(estimate => estimate === 0)) {
    const strongestMove = moves[indexOfMax(damageEstimates)]
    strongestMove.classList.add('strongest-move')
  }

}
