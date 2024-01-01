# openapi-schema-types-from-examples

This package makes it possible to add missing schema types to an openapi specification based on the sample request payloads and sample responses of the given openapi specification.

## Installation

Using `npm`:

```bash
npm i openapi-examples-to-schema
```

Using `yarn`:

```bash
yarn add openapi-examples-to-schema
```

## Quick Usage

```ts
const fs = require('fs/promises')
const addSchemaTypesFromExamples = require('openapi-schema-types-from-examples')

const openapiSpecificationFile = './swagger.json'

const openapiSpecification = await fs.readFile(openapiSpecificationFile, { encoding: 'utf-8' })
const openapiSpecificationWithTypes = addSchemaTypesFromExamples(openapiSpecification, 'json')

console.log(openapiSpecificationWithTypes);
```

## Documentation

TODO: Describe usages

## Use with `postman-to-openapi`

If postman collections are converted to openapi specifications using [postman-to-openapi](https://npm.im/postman-to-openapi), the specification does not create any schema types. 

In combination of both packages a postman collection can be converted to an openapi specification with schema types.

```ts
const fs = require('fs/promises')
const postman2openapi = require('postman-to-openapi')
const addSchemaTypesFromExamples = require('openapi-schema-types-from-examples')

const format = 'json'
const openapiSpecification = await postman2openapi('./postman_collection.json', null, { outputFormat: format })
const openapiSpecificationWithTypes = addSchemaTypesFromExamples(openapiSpecification, format)
```
