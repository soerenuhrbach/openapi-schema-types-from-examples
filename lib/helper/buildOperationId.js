const slugify = require('slugify')

const buildOperationId = (method, path) => `${method.toUpperCase()}_${slugify(path)}`

module.exports = buildOperationId
