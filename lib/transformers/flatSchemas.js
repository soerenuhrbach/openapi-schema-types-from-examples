const FLATABLE_TYPES = [
  'object',
  'array'
]

const flatProperty = (document, parentName, propertyName, property) => {
  const schemaName = `${parentName}_${propertyName}`
  if (property.type === 'array' && !!property.items) {
    return {
      ...property,
      items: flatProperty(document, parentName, propertyName, property.items)
    }
  }

  for (const childPropertyName in property.properties) {
    const childProperty = property.properties[childPropertyName]
    if (childProperty.type === 'object') {
      property.properties[childPropertyName] = flatProperty(
        document,
        schemaName,
        childPropertyName,
        childProperty
      )
    }
    if (childProperty.type === 'array' && FLATABLE_TYPES.includes(childProperty?.items?.type)) {
      property.properties[childPropertyName] = flatProperty(document, parentName, childPropertyName, childProperty)
    }
  }

  document.components.schemas[schemaName] = property
  return {
    $ref: `#/components/schemas/${schemaName}`
  }
}

const flatSchemas = (document) => {
  if (!document.components.schemas) {
    return document
  }

  for (const schemaName in document.components.schemas) {
    const schema = document.components.schemas[schemaName]

    for (const propertyName in schema.properties) {
      const property = schema.properties[propertyName]
      if (!FLATABLE_TYPES.includes(property.type)) {
        continue
      }

      schema.properties[propertyName] = flatProperty(document, schemaName, propertyName, property)
    }
  }

  return document
}

module.exports = flatSchemas
