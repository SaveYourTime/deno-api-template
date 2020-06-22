# deno-api-template

## Teck Stack

- Deno
- oak

## Dependencies

- bcrypt
- djwt

## Tools

- denon
- prettier

---

## Features

- Use **denon** to `monitor` any changes and automatically `restart` the application, also, manage our `environment variables` and `permissions`. (Just like: `nodemon`)
- Use **oak** to build up the http server. (Just like: `koa`)
- Use **oakCors** to enable cors.
- Middlewares like `error handling`, `timing logger` are included.
- Serving `static files`
- **bcrypt** for `hashing` user's password
- **djwt** for dealing user `authentication` and `protected routes`

---

## Folder Structure

###### /data

mock data

###### /public

static files

###### /routes

> Naming Convention: [endpoint].ts

API endpoints

###### /utils

All utility functions will be here.

###### app.ts

entry point

###### denon.json

manage scripts, environment variables and permissions
