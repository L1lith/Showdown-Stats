function getPokemonFromStatbar(statbar) {
  if (!(statbar instanceof HTMLElement) || !(statbar.className || "").includes('statbar')) throw 'Invalid Statbar'
  const {sides} = window.room.battle
  return (sides[0].active.concat(sides[1].active)).find(pokemon => pokemon !== null && (typeof pokemon.statbarElem == 'object' ? pokemon.statbarElem.toArray() : []).includes(statbar)) || null
}

export default getPokemonFromStatbar
