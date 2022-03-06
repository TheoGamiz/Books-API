# Books-API

#### This is an HTTP API made with Restify for managing personal books.

## Get started

#### Clone project

`$ git clone git@github.com:TheoGamiz/Books-API.git`<br/>
`$ cd Books-API`

#### Install the dependencies

`$ npm install`

#### Run project

`$ npm start` or `$ npm run dev`<br/>


#### Environment variables

- `PORT`: port on which the server will listen requests, default `8080`
- `MONGODB_URI`: URI for MongoDB database connexion
- `DB_NAME`: MongoDB database name
- `JWT_KEY`: JWT secret key

## Tests

Automatic tests have been written with [Mocha](https://mochajs.org/).
You can execute them by running : <br/>
`$ npm test `

## Routes API

#### POST /signup

##### Request

###### Body

- `username` (Between 2 and 20 characters, in lowercase, without special characters)
- `password` (Minimum 4 characters)
  <br/>

#### POST /signin

##### Request

###### Body

- `username` (Between 2 and 20 characters, in lowercase, without special characters)
- `password` (Minimum 4 characters)
  <br/>

#### GET /books

##### Request

###### Headers

- `x-access-token` (JWT token)
  <br/>

#### PUT /books

##### Request

###### Body

- `content` (Book content)

###### Headers

- `x-access-token` (JWT token)
  <br/>

#### PATCH /books/:id

##### Request

###### Parameters

- `id` (Book ID)

###### Body

- `content` (Book content)

###### Headers

- `x-access-token` (JWT token)
  <br/>

#### DELETE /books/id

##### Request

###### Parameters

- `id` (Book ID)

###### Headers

- `x-access-token` (JWT token)

## Contributor

- BUCHER Quentin
- MESSAI Rafiq
- GAMIZ Théo
