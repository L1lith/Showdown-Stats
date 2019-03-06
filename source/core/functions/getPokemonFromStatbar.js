function getPokemonFromStatbar(statbar) {
  const {sides} = window.room.battle
  const sideClass = [...statbar.classList].includes("rstatbar") ? "rstatbar" : "lstatbar"
  const side = sides[sideClass === "rstatbar" ? 0 : 1]
  const activeNumber = [...statbar.parentNode.children].filter(node => [...node.classList].includes(sideClass)).indexOf(statbar)
  const pokemon = side.active[activeNumber]
  return pokemon
}

export default getPokemonFromStatbar
