function beatUp(pokemon, opponent, room) {
  const attackTimes = room.battle.sides[0].pokemon.filter(pokemon => !typeof pokemon.status == 'string' || pokemon.status.length < 1).length
  return ((pokemon.baseStats.atk / 10) + 5) * attackTimes
}

export default {name: 'Beat Up', base: beatUp}
