function reject(obj, keys) {
    return Object.assign({}, ...Object.keys(obj).filter(k => !keys.includes(k)).map(k => ({[k]: obj[k]})))
}

module.exports = {reject}