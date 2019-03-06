function arrayUnique(array) {
    if (!Array.isArray(array)) throw new Error('Input is not array')
    const prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

    return array.filter(item => {
        const type = typeof item
        if(type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true)
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item)
    })
}

export default arrayUnique
