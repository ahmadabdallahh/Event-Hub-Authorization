# API Routes

Base URL: `http://localhost:8080`

## Auth Routes (`/`)

| Method | Path    | Auth Required | Description                    |
| ------ | ------- | ------------- | ------------------------------ |
| POST   | /signup | No            | Create a new user account      |
| POST   | /login  | No            | Log in and receive a JWT token |

### POST /signup

Request body:

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

Responses:

- `201`: `{ "message": "User created.", "user": { ... }, "token": "<jwt>" }`
- `422`: Validation errors (invalid email, email already exists, password less than 6 characters)

### POST /login

Request body:

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

Responses:

- `200`: `{ "token": "<jwt>" }`
- `401`: `{ "message": "Authentication failed." }`
- `422`: `{ "message": "Invalid credentials.", "errors": { "credentials": "Invalid email or password entered." } }`

## Event Routes (`/events`)

| Method | Path     | Auth Required | Description                          |
| ------ | -------- | ------------- | ------------------------------------ |
| GET    | /events  | No            | Get all events                       |
| GET    | /events/:id | No         | Get a single event by id             |
| POST   | /events  | Yes           | Create a new event                   |
| PATCH  | /events/:id | Yes         | Update an event by id                |
| DELETE | /events/:id | Yes         | Delete an event by id                |

For protected routes, send the token in the `Authorization` header:

```
Authorization: Bearer <token>
```

### Event object shape

```json
{
  "title": "Event title",
  "description": "Event description",
  "date": "2026-09-20",
  "image": "https://example.com/image.png"
}
```

### POST /events

Validates `title`, `description`, `date`, and `image`.

- `201`: `{ "message": "Event saved.", "event": { ... } }`
- `422`: Validation error messages per field

### PATCH /events/:id

Validates `title`, `description`, `date`, and `image`.

- `200`: `{ "message": "Event updated.", "event": { ... } }`
- `422`: Validation error messages per field

### DELETE /events/:id

- `200`: `{ "message": "Event deleted." }`

## Error Handling

Errors are forwarded to a global error handler that responds with:

```json
{
  "message": "<error message or 'Something went wrong.'>"
}
```

The status code defaults to `500`.