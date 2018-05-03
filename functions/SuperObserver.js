class SuperObserver {
	constructor(parent, filter, options={}) {
		if (typeof options != 'object' || options === null) throw 'Invalid Options'
		this.options = options
		this.parent = parent
		this.filter = filter;
    ['observe', 'disconnect', 'isConnected'].forEach(prop => this[prop] = this[prop].bind(this))
	}
	observe(callback, deep=false){
		this.disconnect()
		this.observer = new MutationObserver(records => {
			records.forEach(record => {
				const {addedNodes, removedNodes} = record
				const added = [...addedNodes].filter(this.filter)
				const removed = [...removedNodes].filter(this.filter)
				if (added.length > 0) callback('added', added)
				if (removed.length > 0) callback('removed', removed)
			})
		})
		this.observer.observe(this.parent, {childList: true, subtree: deep === true})
		const added = [...(deep === true ? this.parent.getElementsByTagName('*') : this.parent.children)].filter(this.filter)
		if (added.length > 0) callback('added', added)
	}
  isConnected() {
    return typeof this.observe == 'object' && this.observe !== null
  }
	disconnect(){
		if (typeof this.observer == 'object' && this.observer !== null) {
			this.observer.disconnect()
			this.observer = null
		}
	}
}

function allowChainSuperObservers(parent, filter, options) {
  if (!Array.isArray(filter)) {
    return new SuperObserver(parent, filter, options)
  } else {
    const fakeObserver = {}
    fakeObserver.__proto__ = SuperObserver.prototype
    fakeObserver.disconnect = ()=>{
      if (Array.isArray(fakeObserver.observers)) {
        fakeObserver.observers.forEach(observer => observer.disconnect())
        fakeObserver.observers = null
      }
    }
    fakeObserver.isConnected = ()=>Array.isArray(fakeObserver.observers)
    fakeObserver.observe = callback => {
      fakeObserver.disconnect()
      fakeObserver.observers = chainObservers(parent, filter, callback)
    }
    return fakeObserver
  }
}
function chainObservers(parent, filters, callback, observerList=[]) {
	const filter = filters.splice(0,1)[0]
	const observer = new SuperObserver(parent, filter)
  observerList.push(observer)
  observer.observe((action, nodes) => {
    if (filters.length > 0) {
			nodes.forEach(node => chainObservers(node, filters, callback, observerList))
		} else {
			callback(action, nodes)
		}
	})
  return observerList
}

export default allowChainSuperObservers
