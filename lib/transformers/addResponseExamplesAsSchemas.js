const { JSON_MIME_TYPE } = require('../helper/constants')
const buildOperationId = require('../helper/buildOperationId')
const buildSchemaRef = require('../helper/buildSchemaRef')
const generateSchema = require('../helper/generateSchema')

const addResponseExamplesAsSchemas = (document) => {
  const schemas = document?.components?.schemas ?? {}

  for (const pathKey in document.paths) {
    const path = document.paths[pathKey]
    for (const method in path) {
      const operation = path[method]
      const operationId = operation.operationId ?? buildOperationId(method, pathKey)
      if (operation.responses) {
        for (const statusCode in operation.responses) {
          const response = operation.responses[statusCode]
          if (response.content[JSON_MIME_TYPE] && response.content[JSON_MIME_TYPE].example) {
            const responseId = `${operationId}_response_${statusCode}`
            const example = response.content[JSON_MIME_TYPE].example
            schemas[responseId] = generateSchema(example)
            response.content[JSON_MIME_TYPE].schema = {
              $ref: buildSchemaRef(responseId)
            }
          }
        }
      }
    }
  }

  document.components ??= {}
  document.components.schemas = schemas

  return document
}

module.exports = addResponseExamplesAsSchemas
