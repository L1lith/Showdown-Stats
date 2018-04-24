import togglePokemonStats from './togglePokemonStats'

function statbarClicked(statbar, event, tryNumber = 0) {
  if (tryNumber > 5) return
  if (!window.room) return setTimeout(statDivClicked.bind(null,statbar,event,tryNumber + 1), 100)
  const pokemon = getPokemonFromStatbar(statbar)
  if (pokemon === null) return
  togglePokemonStats(pokemon, statbar, pokemon.side)
}

export default statbarClicked
