# Backend Engineer Worksample

This project contains simple User Management REST API.


## Installation Guide
1. Install and setup MongoDB (or use external service) and set database connection string in the `MONGO_CONNECTION_STRING` environmental variable.
2. Set a number value in the `PASSWORD_HASH_SALT_ROUNDS` environmental variable (for creating password hash).
3. Set an authentication key in the `API_KEY` environmental variable.
4. Install dependencies by running command `npm install`.

## Scripts 
`npm start` starts the server

`npm test` executes the tests


## API Endpoints
| HTTP | Endpoint | Action | Details | Response format
| --- | --- | --- | --- | --- |
| POST | /users| Creates new user | Requires user details in the request body as an JSON object.
| GET | /users | Returns list of existing users | Accepts `created` query param that can have one of two values: `asc` or `desc`

## Authentication

API uses simple authentication with API key. To authenticate set an API key in the `API_KEY` environmental variable and send it with any request in the `x-api-key` header.

## Usage
**`POST /users/` - Creating a new user**

Request body should contain JSON object with user details:
``` 
{
   fullName: string [2-50 characters]
   email: string, valid email
   password: string, min 8 characters
} 
```
Success response:
```
 {
   userId: "..."
 }
```

Error response:
```
 {
   error: "...."
 }
```

**`GET /users/` - List of existing users**

Success response:
```
 [
   {
      _id: "...",
      email: "...",
      fullName: ""...",
      created: ""..."
   },
   {
      _id: "...",
      email: "...",
      fullName: ""...",
      created: ""..."
   }
 ]
```
Failure response:
```
 {
   userId: null,
   error: "...."
 }
```

Error response:
```
 {
   error: "...."
 }
```
