# CSC425 Backend API

Simple REST API for our team project using Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file with your MongoDB connection:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=3000
   JWT_SECRET=some_secret_key
   ```

3. Start the server:
   ```bash
   node server.js
   ```

Server runs on `http://localhost:3000`

## API Endpoints

### Users
- `POST /api/users/register` - Sign up new user
- `POST /api/users/login` - Login user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID

**Register Example:**
```json
POST /api/users/register
{
  "username": "john123",
  "email": "john@email.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Create new message
- `GET /api/messages/:id` - Get single message
- `PUT /api/messages/:id` - Update message
- `DELETE /api/messages/:id` - Delete message

**Create Message Example:**
```json
POST /api/messages
{
  "title": "Hello World",
  "content": "This is my first message",
  "author": "user_id_here",
  "category": "general"
}
```

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get single post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Contacts
- `GET /api/contacts` - Get all contacts
- `POST /api/contacts` - Submit contact form
- `GET /api/contacts/:id` - Get single contact

**Contact Form Example:**
```json
POST /api/contacts
{
  "name": "Jane Smith",
  "email": "jane@email.com",
  "subject": "Question about project",
  "message": "Hi, I have a question..."
}
```

## Testing

Use Postman or Thunder Client to test the endpoints. 

Basic test:
- Go to `http://localhost:3000` in your browser
- Should see: `{"message": "Welcome to CSC425 Project API"}`

## Database

Uses MongoDB with these collections:
- `users` - User accounts
- `messages` - Message board posts  
- `posts` - Blog-style posts
- `contacts` - Contact form submissions

## Notes

- Most endpoints return JSON
- Some endpoints need authentication (we'll add that later)
- Check the terminal for any error messages when testing

---
**Team:** Abbie George - Group 1 
**Course:** CSC 425