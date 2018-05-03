import getPokemonFromStatbar from './getPokemonFromStatbar'
import estimateDamage from './estimateDamage'
import createElement from './createElement'

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
  moves.forEach(move => {
    [...move.getElementsByClassName('move-stats')].forEach(moveStats => moveStats.parentNode.removeChild(moveStats))
    const {low, high} = estimateDamage(room.battle.sides[0].active[0], move, opponent)
    const moveStats = createElement('div', {
      class: 'move-stats',
      content: `${low}%-${high}%`,
      parent: move
    })
  })
}