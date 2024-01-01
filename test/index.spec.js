const yaml = require('js-yaml')
const addSchemaTypesFromExamples = require('../lib/index')
const fs = require('fs/promises')
const path = require('path')

const formats = {
  json: path.join(__dirname, '/fixtures/schema.json'),
  yaml: path.join(__dirname, '/fixtures/schema.yaml')
}

for (const format in formats) {
  describe(`generateSchemaFromExamples (${format})`, () => {
    let document

    const createDocument = async () => {
      const serializedSchema = await fs.readFile(formats[format], { encoding: 'utf-8' })
      const document = addSchemaTypesFromExamples(serializedSchema, format)

      switch (format) {
        case 'json':
          return JSON.parse(document)

        case 'yaml':
          return yaml.load(document)

        default:
          throw new Error(`Format '${format}' is not supported!`)
      }
    }

    const resolveRefPathInObject = (obj, refPath) => {
      const paths = refPath.split('/')
        .filter(x => x !== '#')
      return paths.reduce((obj, nextPath) => obj[nextPath], obj)
    }

    beforeEach(async () => {
      document = await createDocument()
    })

    it('should match the snapshot', () => {
      let serializedDocument = null;
      switch (format) {
        case 'json':
          serializedDocument = JSON.stringify(document);
          break;
        
        case 'yaml':
          serializedDocument = yaml.dump(document);
          break;
      } 

      expect(serializedDocument).toMatchSnapshot();
    })

    it('should add schemas to the component scope', () => {
      expect(document?.components?.schemas).toBeDefined()
      expect(Object.keys(document.components.schemas).length).toBeGreaterThan(0)
    })

    it('should add schemas for request bodies of type json based on the given example', () => {
      expect(document?.components?.schemas).toBeDefined()
      expect(Object.keys(document.components.schemas).length).toBeGreaterThan(0)

      expect(document.components.schemas.POST_apiprofile).toBeDefined()
    })

    it('should reference the schema correctly in the request body', () => {
      const path = document.paths['/api/profile']?.post
      const jsonRequestBody = path?.requestBody?.content['application/json']?.schema
      expect(jsonRequestBody).toBeDefined()
      expect(jsonRequestBody.type).toBe('object')
      expect(jsonRequestBody.$ref).toBeDefined()

      const referencedSchema = resolveRefPathInObject(document, jsonRequestBody.$ref)
      expect(referencedSchema).toBeDefined()
    })

    it('should create the request body types with all properties', () => {
      const schema = document.components.schemas.POST_apiprofile

      expect(schema).toBeDefined()
      expect(schema.type).toBe('object')
      expect(schema.properties).toBeDefined()
      expect(schema.properties.firstName).toBeDefined()
      expect(schema.properties.firstName.type).toBe('string')
      expect(schema.properties.lastName).toBeDefined()
      expect(schema.properties.lastName.type).toBe('string')
      expect(schema.properties.age).toBeDefined()
      expect(schema.properties.age.type).toBe('number')
      expect(schema.properties.skills).toBeDefined()
      expect(schema.properties.skills.type).toBe('array')
      expect(schema.properties.address).toBeDefined()
      expect(schema.properties.address.$ref).toBeDefined()
    })

    it('should add schemas for responses of type json based on the given examples', () => {
      expect(document?.components?.schemas).toBeDefined()
      expect(Object.keys(document.components.schemas).length).toBeGreaterThan(0)

      expect(document.components.schemas.GET_apiprofile_response_200).toBeDefined()
      expect(document.components.schemas.GET_apiprofile_response_404).toBeDefined()
      expect(document.components.schemas.POST_apiprofile_response_200).toBeDefined()
      expect(document.components.schemas.POST_apiprofile_response_404).toBeDefined()
    })

    it('should reference the schema correctly in the response schema', () => {
      const path = document.paths['/api/profile']?.get

      for (const statusCode in path.responses) {
        const response = path.responses[statusCode]
        const jsonSchema = response.content['application/json'].schema
        expect(jsonSchema).toBeDefined()
        expect(jsonSchema.type).not.toBeDefined()
        expect(jsonSchema.$ref).toBeDefined()
        const referencedSchema = resolveRefPathInObject(document, jsonSchema.$ref)
        expect(referencedSchema).toBeDefined()
      }
    })

    it('should create the response types with all properties', () => {
      const schema = document.components.schemas.GET_apiprofile_response_200

      expect(schema).toBeDefined()
      expect(schema.type).toBe('object')
      expect(schema.properties).toBeDefined()
      expect(schema.properties.firstName).toBeDefined()
      expect(schema.properties.firstName.type).toBe('string')
      expect(schema.properties.lastName).toBeDefined()
      expect(schema.properties.lastName.type).toBe('string')
      expect(schema.properties.age).toBeDefined()
      expect(schema.properties.age.type).toBe('number')
      expect(schema.properties.skills).toBeDefined()
      expect(schema.properties.skills.type).toBe('array')
      expect(schema.properties.address).toBeDefined()
      expect(schema.properties.address.$ref).toBeDefined()
    })

    it('should flat all types', () => {
      for (const schemaName in document.components.schemas) {
        const schema = document.components.schemas[schemaName]
        for (const propertyName in schema.properties) {
          const property = schema.properties[propertyName]
          expect(property.type).not.toBe('object')
          if (!property.type) {
            expect(property.$ref).toBeDefined()
          }
          if (property.type === 'array') {
            const itemSchema = property.items
            expect(itemSchema.type).not.toBe('object')
            if (!itemSchema.type) {
              expect(itemSchema.$ref).toBeDefined()
            }
          }
        }
      }
    })
  })
}
