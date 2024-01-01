const { JSON_MIME_TYPE } = require('../helper/constants')
const buildOperationId = require('../helper/buildOperationId')
const generateSchema = require('../helper/generateSchema')
const buildSchemaRef = require('../helper/buildSchemaRef')

const addRequestPayloadsAsSchemas = (document) => {
  const schemas = document?.components?.schemas ?? {}

  for (const pathKey in document.paths) {
    const path = document.paths[pathKey]
    for (const method in path) {
      const operation = path[method]
      const operationId = operation.operationId ?? buildOperationId(method, pathKey)
      if (operation.requestBody) {
        if (operation.requestBody.content[JSON_MIME_TYPE]) {
          const schema = operation.requestBody.content[JSON_MIME_TYPE].schema
          schemas[operationId] = generateSchema(schema.example)
          operation.requestBody.content[JSON_MIME_TYPE].schema = {
            ...schema,
            $ref: buildSchemaRef(operationId)
          }
        }
      }
    }
  }

  document.components ??= {}
  document.components.schemas = schemas

  return document
}

module.exports = addRequestPayloadsAsSchemas
