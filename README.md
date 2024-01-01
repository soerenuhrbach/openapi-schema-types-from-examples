# openapi-schema-types-from-examples

This package makes it possible to add missing schema types to an openapi specification based on the sample request payloads and sample responses of the given openapi specification.

The schema types are generated for all endpoints that examples for the content type 'application json' that are used for request bodies or responses.

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

## API

### addSchemaTypesFromExamples(openapi: string, format: 'json' | 'yaml' = 'json'): string

Adds the missing schema types to the openapi specification. The schema types will be generated for each request and response based on the examples in the specification.

## Example

### Original schema

```yaml
openapi: 3.0.0
info:
  title: Sample
  version: 1.0.0
servers:
  - url: http://{{base_url}}
paths:
  /api/profile:
    get:
      tags:
        - default
      summary: /api/profile
      responses:
        '200':
          description: OK
          headers:
            Content-Type:
              schema:
                type: string
                example: application/json
          content:
            application/json:
              schema:
                type: object
              example:
                firstName: Max
                lastName: Mustermann
                age: 54
                skills:
                  - name: javascript
                    level: 5
                address:
                  street: Musterstreet
                  zip: '12355'
                  country: Germany
        '404':
          description: Not Found
          headers:
            Content-Type:
              schema:
                type: string
                example: application/json
          content:
            application/json:
              schema:
                type: object
              example:
                error:
                  code: 404
                  message: Not found
    post:
      tags:
        - default
      summary: /api/profile
      requestBody:
        content:
          application/json:
            schema:
              type: object
              example:
                firstName: Max
                lastName: Mustermann
                age: 54
                skills:
                  - name: javascript
                    level: 5
                address:
                  street: Musterstreet
                  zip: '12355'
                  country: Germany
      responses:
        '200':
          description: OK
          headers:
            Content-Type:
              schema:
                type: string
                example: application/json
          content:
            application/json:
              schema:
                type: object
              example:
                firstName: Max
                lastName: Mustermann
                age: 54
                skills:
                  - name: javascript
                    level: 5
                address:
                  street: Musterstreet
                  zip: '12355'
                  country: Germany
        '404':
          description: Not Found
          headers:
            Content-Type:
              schema:
                type: string
                example: application/json
          content:
            application/json:
              schema:
                type: object
              example:
                error:
                  code: 404
                  message: Not found

```

### New schema with types

```yaml
openapi: 3.0.0
info:
  title: Sample
  version: 1.0.0
servers:
  - url: http://{{base_url}}
paths:
  /api/profile:
    get:
      tags:
        - default
      summary: /api/profile
      responses:
        '200':
          description: OK
          headers:
            Content-Type:
              schema:
                type: string
                example: application/json
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GET_apiprofile_response_200'
              example:
                firstName: Max
                lastName: Mustermann
                age: 54
                skills:
                  - name: javascript
                    level: 5
                address:
                  street: Musterstreet
                  zip: '12355'
                  country: Germany
        '404':
          description: Not Found
          headers:
            Content-Type:
              schema:
                type: string
                example: application/json
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GET_apiprofile_response_404'
              example:
                error:
                  code: 404
                  message: Not found
    post:
      tags:
        - default
      summary: /api/profile
      requestBody:
        content:
          application/json:
            schema:
              type: object
              example:
                firstName: Max
                lastName: Mustermann
                age: 54
                skills:
                  - name: javascript
                    level: 5
                address:
                  street: Musterstreet
                  zip: '12355'
                  country: Germany
              $ref: '#/components/schemas/POST_apiprofile'
      responses:
        '200':
          description: OK
          headers:
            Content-Type:
              schema:
                type: string
                example: application/json
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/POST_apiprofile_response_200'
              example:
                firstName: Max
                lastName: Mustermann
                age: 54
                skills:
                  - name: javascript
                    level: 5
                address:
                  street: Musterstreet
                  zip: '12355'
                  country: Germany
        '404':
          description: Not Found
          headers:
            Content-Type:
              schema:
                type: string
                example: application/json
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/POST_apiprofile_response_404'
              example:
                error:
                  code: 404
                  message: Not found
components:
  schemas:
    POST_apiprofile:
      type: object
      properties:
        firstName:
          type: string
        lastName:
          type: string
        age:
          type: number
        skills:
          type: array
          items:
            $ref: '#/components/schemas/POST_apiprofile_skills'
        address:
          $ref: '#/components/schemas/POST_apiprofile_address'
    GET_apiprofile_response_200:
      type: object
      properties:
        firstName:
          type: string
        lastName:
          type: string
        age:
          type: number
        skills:
          type: array
          items:
            $ref: '#/components/schemas/GET_apiprofile_response_200_skills'
        address:
          $ref: '#/components/schemas/GET_apiprofile_response_200_address'
    GET_apiprofile_response_404:
      type: object
      properties:
        error:
          $ref: '#/components/schemas/GET_apiprofile_response_404_error'
    POST_apiprofile_response_200:
      type: object
      properties:
        firstName:
          type: string
        lastName:
          type: string
        age:
          type: number
        skills:
          type: array
          items:
            $ref: '#/components/schemas/POST_apiprofile_response_200_skills'
        address:
          $ref: '#/components/schemas/POST_apiprofile_response_200_address'
    POST_apiprofile_response_404:
      type: object
      properties:
        error:
          $ref: '#/components/schemas/POST_apiprofile_response_404_error'
    POST_apiprofile_skills:
      type: object
      properties:
        name:
          type: string
        level:
          type: number
    POST_apiprofile_address:
      type: object
      properties:
        street:
          type: string
        zip:
          type: string
        country:
          type: string
    GET_apiprofile_response_200_skills:
      type: object
      properties:
        name:
          type: string
        level:
          type: number
    GET_apiprofile_response_200_address:
      type: object
      properties:
        street:
          type: string
        zip:
          type: string
        country:
          type: string
    GET_apiprofile_response_404_error:
      type: object
      properties:
        code:
          type: number
        message:
          type: string
    POST_apiprofile_response_200_skills:
      type: object
      properties:
        name:
          type: string
        level:
          type: number
    POST_apiprofile_response_200_address:
      type: object
      properties:
        street:
          type: string
        zip:
          type: string
        country:
          type: string
    POST_apiprofile_response_404_error:
      type: object
      properties:
        code:
          type: number
        message:
          type: string
```

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
