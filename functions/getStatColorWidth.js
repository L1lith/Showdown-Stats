import hslToHex from './hslToHex'

function getStatColorWidth(name, value) {
  let width = value * 75 / 504
	if (name === 'hp') width = value * 75 / 704
	if (width > 75) width = 75
  let color = Math.floor(value * 180 / 714)
	if (color > 360) color = 360
  color = hslToHex(color,40,75)
  return {color, width}
}

export default getStatColorWidth
