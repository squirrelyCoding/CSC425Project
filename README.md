# CSC425Project
Team project for CSC 425

## Project Structure

### Frontend (Web Interface)
- **web-project/**: Static HTML, CSS, and JavaScript files
  - `index.html` - Main landing page
  - `about.html` - About page
  - `contact.html` - Contact page
  - `register.html` - User registration page
  - `dynamic.html` - Dynamic content page
  - `styles.css` - Styling
  - `script.js` - Client-side JavaScript

### Backend (API Server)
- **backend/**: Node.js + Express.js REST API with MongoDB
  - Full CRUD operations for Users, Messages, Posts, and Contacts
  - JWT authentication
  - Input validation and security features
  - MongoDB integration with Mongoose ODM
  - Comprehensive API documentation

## Quick Start

### Backend Setup
1. Navigate to backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Set up MongoDB connection in `.env` file
4. Start development server: `npm run dev`
5. API will be available at: `http://localhost:5000`

### Frontend
- Open `web-project/index.html` in your browser
- Or serve static files using a local server

## API Endpoints

The backend provides RESTful APIs for:

- **Users**: Registration, login, profile management
  - `POST /api/users/register` - Register new user
  - `POST /api/users/login` - User authentication
  - `GET /api/users` - List users
  - `GET /api/users/:id` - Get user details
  - `PUT /api/users/:id` - Update user
  - `DELETE /api/users/:id` - Delete user

- **Messages**: Message board functionality
  - `GET /api/messages` - List messages
  - `POST /api/messages` - Create message
  - `GET /api/messages/:id` - Get single message
  - `PUT /api/messages/:id` - Update message
  - `DELETE /api/messages/:id` - Delete message

- **Posts**: Blog/content management
  - `GET /api/posts` - List posts
  - `POST /api/posts` - Create post
  - `GET /api/posts/:id` - Get single post
  - `PUT /api/posts/:id` - Update post
  - `DELETE /api/posts/:id` - Delete post

- **Contacts**: Contact form submissions
  - `GET /api/contacts` - List contacts (admin)
  - `POST /api/contacts` - Submit contact form
  - `GET /api/contacts/:id` - Get contact details
  - `PUT /api/contacts/:id` - Update contact
  - `DELETE /api/contacts/:id` - Delete contact

## Technologies Used

### Frontend
- HTML5, CSS3, JavaScript
- Responsive design

### Backend
- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- bcryptjs for password hashing
- express-validator for input validation
- CORS for cross-origin requests

## Development

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local MongoDB
- Code editor (VS Code recommended)
- Postman or Thunder Client for API testing

### Environment Setup
1. Copy `backend/.env` and configure:
   - MongoDB connection string
   - JWT secret key
   - Server port (default: 5000)

2. Install dependencies: `npm install` (in backend folder)

3. Start development server: `npm run dev`

## Documentation

- Complete API documentation: `backend/README.md`
- MongoDB schemas and data models included
- Postman/Thunder Client testing examples provided

---

**Team**: CSC425 Project Team  
**Course**: CSC 425  
**Last Updated**: September 2025
