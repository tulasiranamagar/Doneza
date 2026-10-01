# Doneza

Doneza is a full-stack task management application built with the MERN stack. It allows users to securely create, manage, search, and organize their tasks while providing authentication, email verification, password recovery, profile management, and cloud image uploading.

# Features

# Authentication

* User registration and login
* JWT-based authentication
* Password hashing with bcrypt
* Email verification
* Forgot password functionality
* Password reset using a secure token
* Protected API routes
* Automatic frontend logout when JWT expires

# Task Management

* Create tasks
* View tasks
* Edit tasks
* Delete tasks
* Update task status
* Set task priority
* Set due dates
* Search tasks
* Pagination
* Task statistics

# Profile Management

* View user profile
* Update profile information
* Upload profile picture
* Delete account

# File Upload

* Multer for handling file uploads
* Cloudinary for cloud image storage

# Frontend

* Responsive React interface
* React Router navigation
* Redux Toolkit state management
* Axios API integration
* Toast notifications
* Protected routes
* Dark glass-style UI

# Technology Stack

# Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Redux Toolkit
* Axios
* React Hot Toast
* React Icons

# Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Token
* bcrypt
* Express Validator
* Nodemailer
* Multer
* Cloudinary

# API Endpoints

# Authentication

| Method | Endpoint                          | Description            |
| ------ | --------------------------------- | ---------------------- |
| POST   | `/api/auth/register`              | Register a new user    |
| POST   | `/api/auth/login`                 | Login user             |
| GET    | `/api/auth/verify-email/:token`   | Verify email           |
| GET    | `/api/auth/me`                    | Get current user       |
| POST   | `/api/auth/profile-picture`       | Upload profile picture |
| PUT    | `/api/auth/profile`               | Update profile         |
| DELETE | `/api/auth/account`               | Delete account         |
| POST   | `/api/auth/forgot-password`       | Request password reset |
| POST   | `/api/auth/reset-password/:token` | Reset password         |

# Tasks

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| GET    | `/api/tasks`            | Get user's tasks    |
| GET    | `/api/tasks/stats`      | Get task statistics |
| POST   | `/api/tasks`            | Create a task       |
| GET    | `/api/tasks/:id`        | Get a single task   |
| PUT    | `/api/tasks/:id`        | Update a task       |
| PATCH  | `/api/tasks/:id/status` | Update task status  |
| DELETE | `/api/tasks/:id`        | Delete a task       |

# Authentication Flow

Doneza uses JWT for authentication.

1. User registers an account.
2. A verification email is sent.
3. User verifies the email.
4. User logs in.
5. The server returns a JWT.
6. The frontend stores the token and sends it with protected requests.
7. Backend middleware verifies the token before allowing access to protected resources.

Passwords are never stored as plain text. They are securely hashed using bcrypt.

# Password Recovery Flow

1. User requests a password reset using their email.
2. A secure reset token is generated.
3. The reset link is sent through email.
4. The user opens the reset link.
5. The new password is validated and securely hashed.
6. The password reset token is invalidated after use.

# Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

SMTP_USER=your_email
SMTP_PASS=your_email_password

FRONTEND_URL=http://localhost:5173


Never commit the `.env` file to GitHub.

# Installation

1. Clone the repository

git clone YOUR_GITHUB_REPOSITORY_URL
cd DONEZA


2. Install backend dependencies

cd backend
npm install


3. Configure environment variables

Create:

backend/.env

and add the required environment variables.

4. Start the backend

npm run dev

The backend runs on:

http://localhost:5000

5. Install frontend dependencies

Open another terminal:

cd frontend
npm install

6. Start the frontend

npm run dev


The frontend runs on:

http://localhost:5173


# Database

Doneza uses MongoDB with Mongoose for database management.

The main user and task data are stored in MongoDB collections.

# Security

The application includes several security practices:

* Password hashing with bcrypt
* JWT authentication
* Protected API routes
* Authentication middleware
* Email verification
* Expiring password reset tokens
* Environment variables for sensitive credentials
* Server-side request validation
* User-specific task authorization

# Error Handling and Validation

The backend validates incoming requests and provides structured error responses.

The application handles common cases such as:

* Invalid credentials
* Duplicate email addresses
* Invalid or expired tokens
* Missing required fields
* Invalid task IDs
* Unauthorized requests
* Password validation errors
* Resource not found errors

# Purpose

Doneza was developed as a MERN Stack class project to demonstrate practical implementation of frontend and backend concepts including REST APIs, authentication, database operations, validation, middleware, file uploads, cloud storage, and state management.

# Author

Tulasi Rana Magar
