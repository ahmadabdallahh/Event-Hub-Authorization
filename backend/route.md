# API Routes

Base URL: `http://localhost:8080/api/v1`

## Auth Routes (`/api/v1/auth`)

| Method | Path               | Auth Required | Description                    |
| ------ | ------------------ | ------------- | ------------------------------ |
| POST   | /api/v1/auth/signup | No            | Create a new user account      |
| POST   | /api/v1/auth/login  | No            | Log in and receive a JWT token |

### POST /api/v1/auth/signup

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

### POST /api/v1/auth/login

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

## Event Routes (`/api/v1/events`)

| Method | Path                  | Auth Required | Description                          |
| ------ | --------------------- | ------------- | ------------------------------------ |
| GET    | /api/v1/events        | No            | Get all events                       |
| GET    | /api/v1/events/:id    | No            | Get a single event by id             |
| POST   | /api/v1/events        | Yes           | Create a new event                   |
| PATCH  | /api/v1/events/:id    | Yes           | Update an event by id                |
| DELETE | /api/v1/events/:id    | Yes           | Delete an event by id                |

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

### POST /api/v1/events

Validates `title`, `description`, `date`, and `image`.

- `201`: `{ "message": "Event saved.", "event": { ... } }`
- `422`: Validation error messages per field

### PATCH /api/v1/events/:id

Validates `title`, `description`, `date`, and `image`.

- `200`: `{ "message": "Event updated.", "event": { ... } }`
- `422`: Validation error messages per field

### DELETE /api/v1/events/:id

- `200`: `{ "message": "Event deleted." }`

## Error Handling

Errors are forwarded to a global error handler that responds with:

```json
{
  "message": "<error message or 'Something went wrong.'>"
}
```

The status code defaults to `500`.