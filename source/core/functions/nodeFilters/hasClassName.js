function hasClassName(node, className) {
  if (!(node instanceof HTMLElement)) throw new Error('Invalid Node')
  return typeof node.className == 'string' && node.className.length > 0 && node.className.split(' ').includes(className)
}

export default hasClassName
