#Messages API

Base URL: `/api/messages`

## Endpoints
- **POST /api/messages** → Create new item
- **GET /api/messages** → List all items
- **GET /api/messages/:id** → Get single item
- **PUT /api/messages/:id** → Update item
- **DELETE /api/messages/:id** → Delete item

### Example Request
```http
POST /api/messages
Content-Type: application/json
{
  "name": "Notebook",
  "description": "Hello!"
}
