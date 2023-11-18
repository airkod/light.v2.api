# Light.v2

## Requirements

- `MongoDb` 3.6 and more
- `NodeJs` v16.20.2 (LTS Gallium) and more

## 1. Install

### 1.1. Clone boilerplate

```
git clone git@github.com:airkod/light.v2.api.git
```

---

### 1.2. Install dependencies

```shell
npm i
```

---

### 1.3. Install compiler

```shell
npm i -g @vercel/ncc
```

### 2. Setup project

#### 2.1. Setup MongoDb root database

---

#### 2.2. Add a document to `user` collection

```json lines
{
    // Created login
    "login": "{login}",
    // Created password
    "password": "{password}"
}
```

---

#### 2.3. Setup environment. Open **src/env.ts**

```typescript
export const env = {
    main: {
        // Server host, 'localhost' by default
        host: "localhost",

        // Server port, '3000' by default
        port: 3000,
    },
    mongo: {
        // MongoDb server scheme, 'mongodb'' by default
        scheme: "mongodb",

        // MongoDb server host
        host: "localhost",

        // MongoDb server port, 27017 by default
        port: 27017,

        // Root MongoDb database name
        rootDbName: "lightv2",
    },
    api: {
        // Create an API-Key
        key: "api-key",
    },
};
```

## 2. Running

### 2.1. Development mode

```shell
npm run dev
```

---

### 2.2 Build

```shell
npm run build
```

Build output will be minimized and saved to `build/index.js` file

## 3. Usage

### 3.1. API Key

Every request must include the following headers:

- `api-key`: the value specified in the `src/env.ts` file
- `Content-type`: `application/json`

---

### 3.2. Authorization

#### 3.2.1. Get access token

To obtain an access-token, it is necessary to send a `POST` request to `/auth/getToken` with the following body:

**`POST: /auth/getToken`**

```json lines
{
    // See 2.2. Add a document to 'user' collection
    "login": "{login}",
    // See 2.2. Add a document to 'user' collection
    "password": "{password}"
}
```

**`Success response: 200`**

```json lines
{
    // String, Length: 32, Unique
    "accessToken": "{accessToken}",
    // String, Length: 32, Unique
    "refreshToken": "{accessToken}",
    // Number, unix timestamp date when access token will expire
    "accessTokenExpires": 1700257603,
    // Number, unix timestamp date when refresh token will expire
    "refreshTokenExpires": 1700340403
}
```

`Fail response: 401`

```json lines
{
    "message": "Login or password are incorrect"
}
```

Save the `accessToken` and `refreshToken` values, `accessToken` value needs to be passed as a header for all CRUD operations.
The lifespan of the `accessToken` ends at `accessTokenExpires`, which by default is 1 hour.
Once the `accessToken` expires, it must be renewed using the `refreshToken`, this operation is described in the following section.

If you send a request for a CRUD operation with an expired `accessToken`, you will receive the following response:
`Code: 401`

```json lines
{
    "message": "Access token is expired"
}
```

---

#### 3.2.2. Refresh access token

When the lifespan of the `accessToken` expires, it must be renewed by executing the following request:

`POST: /auth/refreshToken`

```json lines
{
    // See 2.2. Add a document to 'user' collection
    "login": "{login}",
    // See 2.2. Add a document to 'user' collection
    "password": "{password}",
    // Expired access token
    "accessToken": "{accessToken}",
    // Refresh token
    "refreshToken": "{refreshToken}"
}
```

`Success response: 200`

```json lines
{
    "accessToken": "{accessToken}",
    // String, Length: 32, Unique
    "refreshToken": "{refreshToken}",
    // String, Length: 32, Unique
    "accessTokenExpires": 1700313492,
    // Number, unix timestamp date when access token will expire
    "refreshTokenExpires": 1700396292
    // Number, unix timestamp date when refresh token will expire
}
```

`Fail response: 400`

```javascript
{
    message:
            "User not found" ||
            "User session is invalid" ||
            "Refresh or access tokens is invalid" ||
            "Refresh token is expired"
}

```

If you receive an unsuccessful response, you need to undergo authorization (See 3.1.1. Get access token).

---

### 3.3. CRUD operations

For clarity, below we will consider the `articles` collection, which has the following structure:

```json lines
[
    {
        "_id": "{ObjectId}",
        "title": "The Golden Age of Hollywood and its stars",
        "content": "From the advent of the talkies to the iconic era that...",
        "isPublished": true,
        "likes": 101
    },
    ...
]
```

---

#### 3.3.1. Headers

Every request must include the following headers:

- `api-key`: value specified in the `src/env.ts` file
- `access-token`: a valid accessToken (See 3.2. Authorization)
- `Content-type`: `application/json`

---

#### 3.3.2. Basic body

For all CRUD operations, it is necessary to include the name of the collection in the body, as each CRUD operation affects a specific
collection.

```json
{
    "collection": "{collection}"
}
```

---

#### 3.3.3. Find all

For the `all` operation, the following values need to be passed:

- `collection` - String, collection name
- `cond` - Object | null, [MongoDb $cond (aggregation)](https://www.mongodb.com/docs/manual/reference/operator/aggregation/cond/)
- `sort` - Object | null, [MongoDb $sort (aggregation)](https://www.mongodb.com/docs/manual/reference/operator/aggregation/sort/)
- `limit` - Number, [MongoDb $limit (aggregation)](https://www.mongodb.com/docs/manual/reference/operator/aggregation/limit/)
- `skip` - Number, [MongoDb $skip (aggregation)](https://www.mongodb.com/docs/manual/reference/operator/aggregation/skip/)

`POST: /all`

```json lines
{
    "collection": "article",
    "cond": {
        "title": {
            "$regex": "gol",
            "$options": "i"
        },
        "isPublished": true,
        "likes": {
            "$gt": 50
        }
    },
    "sort": {
        "likes": -1
    },
    "limit": 10,
    "skip": 0
}
```

`Response: 200`

```json lines
{
    "count": 1,
    "data": [
        {
            "_id": "6558b99aa4a5dc89c4a3c8da",
            "title": "The Golden Age of Hollywood and its stars",
            "content": "From the advent of the talkies to the iconic era that...",
            "isPublished": true,
            "likes": 101
        }
    ]
}
```

---

#### 3.3.4. Find one

For the `one` operation, the following values need to be passed:

- `collection` - String, collection name
- `cond` - Object | null, [MongoDb $cond (aggregation)](https://www.mongodb.com/docs/manual/reference/operator/aggregation/cond/)
- `sort` - Object | null, [MongoDb $sort (aggregation)](https://www.mongodb.com/docs/manual/reference/operator/aggregation/sort/)

`POST: /one`

```json lines
{
    "collection": "article",
    "cond": {
        "title": {
            "$regex": "gol",
            "$options": "i"
        },
        "isPublished": true,
        "likes": {
            "$gt": 50
        }
    },
    "sort": {
        "age": -1
    }
}
```

`Response: 200`

```json lines
{
    "_id": "6558b99aa4a5dc89c4a3c8da",
    "title": "The Golden Age of Hollywood and its stars",
    "content": "From the advent of the talkies to the iconic era that...",
    "isPublished": true,
    "likes": 101
}
```

---

#### 3.3.5. Count

For the `count` operation, the following values need to be passed:

- `collection` - String, collection name
- `cond` - Object | null, [MongoDb $cond (aggregation)](https://www.mongodb.com/docs/manual/reference/operator/aggregation/cond/)

`POST: /count`

```json lines
{
    "collection": "article",
    "cond": {
        "title": {
            "$regex": "gol",
            "$options": "i"
        },
        "isPublished": true,
        "likes": {
            "$gt": 50
        }
    }
}
```

`Response: 200`

```json lines
1
```

---

#### 3.3.6. Insert one

For the `insert one` operation, the following values need to be passed:

- `collection` - String, collection name
- `data` - Object, model representation

`POST: /insertOne`

```json lines
{
    "collection": "article",
    "data": {
        "title": "The Golden Age of Hollywood and its stars",
        "content": "From the advent of the talkies to the iconic era that...",
        "isPublished": true,
        "likes": 101
    }
}
```

`Response: 200`

```json lines
{
    "title": "The Golden Age of Hollywood and its stars",
    "content": "From the advent of the talkies to the iconic era that...",
    "isPublished": true,
    "likes": 101,
    "_id": "6558b99aa4a5dc89c4a3c8da"
}
```

---

#### 3.3.7. Insert many

For the `insert many` operation, the following values need to be passed:

- `collection` - String, collection name
- `data` - Object, model representation

`POST: /insertMany`

```json lines
{
    "collection": "article",
    "data": [
        {
            "title": "The Golden Age of Hollywood and its stars",
            "content": "From the advent of the talkies to the iconic era that...",
            "isPublished": true,
            "likes": 101
        },
        {
            "title": "Inside The Groucho Club — an arts haven for private members",
            "content": "London’s Soho neighbourhood is known for its bohemian arts scene, iconic theatres and eclectic shops",
            "isPublished": false,
            "likes": 50
        }
    ]
}
```

`Response: 200`

```json lines
[
    {
        "title": "The Golden Age of Hollywood and its stars",
        "content": "From the advent of the talkies to the iconic era that...",
        "isPublished": true,
        "likes": 101,
        "_id": "6557d5f00f914b1d7d16999c"
    },
    {
        "title": "Inside The Groucho Club — an arts haven for private members",
        "content": "London’s Soho neighbourhood is known for its bohemian arts scene, iconic theatres and eclectic shops",
        "isPublished": false,
        "likes": 50,
        "_id": "6557d5f00f914b1d7d16999d"
    }
]
```

---

#### 3.3.8. Update one

For the `update one` operation, the following values need to be passed:

- `collection` - String, collection name
- `cond` - Object | null, [MongoDb $cond (aggregation)](https://www.mongodb.com/docs/manual/reference/operator/aggregation/cond/)
- `data` - Object, model representation

`POST: /updateOne`

```json lines
{
    "collection": "article",
    "cond": {
        "_id": "6557d5f00f914b1d7d16999d"
    },
    "data": {
        "isPublished": false
    }
}
```

`Response: 200, empty response`

---

#### 3.3.9. Update many

For the `update many` operation, the following values need to be passed:

- `collection` - String, collection name
- `cond` - Object | null, [MongoDb $cond (aggregation)](https://www.mongodb.com/docs/manual/reference/operator/aggregation/cond/)
- `data` - Object, model representation

`POST: /updateMany`

```json lines
{
    "collection": "article",
    "cond": {
    },
    "data": {
        "isPublished": true
    }
}
```

`Response: 200, empty response`

---

#### 3.3.9. Delete one

For the `delete one` operation, the following values need to be passed:

- `collection` - String, collection name
- `cond` - Object | null, [MongoDb $cond (aggregation)](https://www.mongodb.com/docs/manual/reference/operator/aggregation/cond/)

`POST: /deleteOne`

```json lines
{
    "collection": "article",
    "cond": {
        "likes": {
            "$lt": 50
        }
    }
}
```

`Response: 200, empty response`

---

#### 3.3.10. Delete many

For the `delete many` operation, the following values need to be passed:

- `collection` - String, collection name
- `cond` - Object | null, [MongoDb $cond (aggregation)](https://www.mongodb.com/docs/manual/reference/operator/aggregation/cond/)

`POST: /deleteMany`

```json lines
{
    "collection": "article",
    "cond": {
        "likes": {
            "$lt": 50
        }
    }
}
```

`Response: 200, empty response`

---

## LICENSE

*In the shadow of dense family traditions, where the word respect and knowledge weighs more than gold.
I open the doors of this project for everyone.
With generosity and nobility emanating from the depths of my heart,
I share this wealth with you, asking not a cent in return.
But remember, the day will come when possible I will ask for a service, and at that moment,
I will count on your respect and devotion as a sign of gratitude for my unconditional trust and generosity.*
