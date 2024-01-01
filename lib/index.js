const yaml = require('js-yaml')
const addRequestPayloadsAsSchemas = require('./transformers/addRequestPayloadsAsSchemas')
const addResponseExamplesAsSchemas = require('./transformers/addResponseExamplesAsSchemas')
const flatSchemas = require('./transformers/flatSchemas')
const removeSchemaDuplicates = require('./transformers/removeSchemaDuplicates')

/**
 * @param {string} document
 * @param {'json' | 'yaml'} format default: json
 * @returns {string}
 */
const generateSchemaFromExamples = (document, format = 'json') => {
  const transformations = [
    addRequestPayloadsAsSchemas,
    addResponseExamplesAsSchemas,
    flatSchemas,
    removeSchemaDuplicates
  ]

  const parse = (document) => {
    switch (format) {
      case 'yaml':
        return yaml.load(document)

      case 'json':
        return JSON.parse(document)

      default:
        throw new Error(`Format '${format}' is not supported!`)
    }
  }

  const stringify = (document) => {
    switch (format) {
      case 'yaml':
        return yaml.dump(document)

      case 'json':
        return JSON.stringify(document)

      default:
        throw new Error(`Format '${format}' is not supported!`)
    }
  }

  return stringify(
    transformations.reduce(
      (document, next) => next(document),
      parse(document)
    )
  )
}

module.exports = generateSchemaFromExamples
