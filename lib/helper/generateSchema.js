const { json } = require('generate-schema')

const generateSchema = (object) => {
  try {
    const schema = json(object)
    delete schema.$schema
    return schema
  } catch {
    return null
  }
}

module.exports = generateSchema
