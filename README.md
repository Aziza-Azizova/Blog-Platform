# Blog Platform

## Description

The Blog Platform API allows users to register, log in, and manage blogs and comments.
Users can create, edit, delete, and view blogs. Other users can leave comments on blogs. The
system supports role-based access control (admin and regular users) to ensure secure
content management. Pagination is implemented for viewing blog posts.

## Features

-   Create, read, update, and delete blog posts
-   Create, read, update, and delete comments for blog posts
-   Like and dislike blog posts
-   User authentication (default role: user)

## Tech Stack

-   **Backend**: Node.js, TypeScript, Express.js
-   **Database**: MongoDB
-   **Containerization**: Docker
-   **Testing**: Jest, Supertest

## Installation

1. **Clone the repository:**

```bash
git clone https://github.com/Aziza-Azizova/Blog-Platform.git
cd blog-platform
```

2. **Install dependencies:**

```bash
npm install
```

## Usage

To run the application locally:

1. Start the development server:

```bash
npm run dev
```

2. Access the application:

-   Open your browser and go to http://localhost:5000
-   Use Postman or any other API client to interact with the API at http://localhost:5000.

# Deployment

## Prerequisites

-   **Docker:** Ensure Docker is installed on your local machine or server.
-   **Docker Compose:** Install Docker Compose for managing multi-container Docker applications.
-   **Node.js:** Ensure that Node.js is installed (if not using Docker).
-   **MongoDB:** A running MongoDB instance (if not using Docker).

## Deployment with Docker

1. Clone the repository:

```bash
git clone https://github.com/Aziza-Azizova/Blog-Platform.git
cd blog-platform
```

2. Install dependencies:

```bash
npm install
```

3. Set up your .env file with the necessary environment variables:

-   MONGODB_URI=mongodb+srv://your-databse-url
-   JWT_SECRET=your_jwt_secret

4. Build and start the Docker containers:

```bash
docker-compose up --build -d
```

## Running Tests

To run tests locally, use the following commands:

4. Run unit and integration tests:

```bash
npm run test
```
