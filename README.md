# Social Media Backend Assignment

## Objective

This is a NestJS backend API for a social media follow system, including user registration, login, follow/unfollow functionality, viewing followers/following/mutual friends, and documented notifications.

## Tech Stack

- NestJS (TypeScript)
- MongoDB (Mongoose)
- JWT for authentication
- Bcrypt for password hashing

## Features

- User registration and login with JWT authentication.
- Follow/unfollow users (cannot follow self, no duplicates).
- View followers, following, and mutual friends with pagination.
- Notifications: Implemented as an optional in-app entry in the user's document (e.g., "User A started following you."). Push notifications are not implemented but can be added using services like Firebase. No separate API for notifications.

## Bonus Implemented

- Pagination in followers/following/mutual-friends lists (using query params `page` and `limit`).
- Unit tests: Basic tests for services (see test files below).
- WebSocket: Not implemented (optional).

## Installation and Setup

1. Ensure you have Node.js (v18+), npm, and MongoDB installed and running locally (or provide a MongoDB URI).
2. Clone the repository from GitHub: `git clone <repo-url>`.
3. Navigate to the project directory: `cd social-media-backend`.
4. Install dependencies: `npm install`.
5. The MongoDB connection is set to `mongodb://localhost/social-media`. Update in `app.module.ts` if needed.
6. Run the application: `npm run start:dev` (development mode with hot-reload).

The API will be available at `http://localhost:3000`.

## Documentation using Swagger : 
 http://localhost:3000/api/docs
