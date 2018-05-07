function arrayUnique(array) {
    const prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

    return array.filter(item => {
        const type = typeof item
        if(type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true)
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item)
    });
}

export default arrayUnique
