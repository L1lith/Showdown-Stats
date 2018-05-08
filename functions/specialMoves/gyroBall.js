import {calculateStat} from '../calculateStats'

function gyroBall(pokemon, opponent, room){
  const pokemonSpeed = calculateStat(pokemon, 'spd')
  const opponentSpeed = calculateStat(opponent, 'spd')
  const lowDamage = opponentSpeed.lowFinal / pokemonSpeed.lowFinal
  const highDamage = opponentSpeed.highFinal / pokemonSpeed.lowFinal

  return [lowDamage, highDamage].map(value => Math.min(value * 25, 150))
}

export default {name: 'Gyro Ball', kind: 'baserange', calculate: gyroBall}
