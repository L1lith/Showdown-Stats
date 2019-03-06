function createElement(type = 'div', options = {}) {
  if (typeof type != 'string' || type.length < 1) throw 'CreateElement: Invalid Element Type'
  if (typeof options != "object" || options === null) throw 'CreateElement: Options Not Object'
  const element = document.createElement(type)
  if (typeof options.class == 'string' && options.class.length > 1) {
    element.className = options.class
  } else if (Array.isArray(options.classes)) {
    element.className = options.classes.join(' ')
  }
  if (typeof options.content == 'string' && options.content.length > 0) element.textContent = options.content
  if (typeof options.attributes == 'object' && options.attributes !== null) {
    Object.keys(options.attributes).forEach(attribute => {
      element.setAttribute(attribute, options.attributes[attribute])
    })
  }
  if (typeof options.style == 'object' && options.style !== null) Object.assign(element.style, options.style)
  if (options.parent instanceof HTMLElement) {
    options.parent.appendChild(element)
  } else if (options.above instanceof HTMLElement) {
    options.above.parentNode.insertBefore(element, options.above)
  } else if (options.below instanceof HTMLElement) {
    options.below.parentNode.insertBefore(element, options.below.nextSibling)
  }
  return element
}
export default createElement
