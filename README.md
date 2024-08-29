
# Threads Clone

This project is a clone of the popular social media platform "Threads." It replicates various core functionalities, such as liking/disliking posts, following/unfollowing users, replying to posts, creating/deleting posts, chatting with users, sending images, and more. The project is built with modern web technologies, offering both a robust frontend and backend setup to support real-time interactions and user-friendly experiences.

## Live Demo
## https://threads-clone-x3cy.onrender.com

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Frontend Components](#frontend-components)
- [Backend Structure](#backend-structure)
- [Deployment](#deployment)


## Features

- **Authentication:** User registration, login, and logout functionality.
- **Post Management:**
  - Create, edit, and delete posts.
  - Like and dislike posts.
  - Reply to posts.
- **User Interactions:**
  - Follow and unfollow users.
  - View followers and following lists.
  - Chat with other users.
  - Send and receive images.
  - Online status and seen/unseen message indicators.
- **Account Settings:**
  - Freeze account.
  - Toggle between light and dark modes.
  - Delete account.
- **Search:** Search for users and view their profiles.
- **Responsive Design:** Optimized for various screen sizes, including mobile devices.

## Tech Stack

### Frontend

- **React**: For building the user interface.
- **React Router**: For client-side routing.
- **Recoil**: For Global State Management.
- **Socket.IO**: For real-time full duplex communication.
- **Chakra-UI**: For styling the application.

### Backend

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for building the API.
- **Socket.IO**: For handling real-time events.
- **MongoDB**: NoSQL database for storing user data, posts, Conversation and Messages.
- **Mongoose**: For modeling and mapping MongoDB data.
- **Cloudinary**: For image storage and management.
- **JWT**: For secure authentication.

## Installation

To set the project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/abhijeet-maity/Threads_clone.git
   cd Threads_clone

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install

3. **Install backend dependencies:**
   ```bash
   cd ..
   cd backend
   npm install

4. **Set up environment variables:**
   ```env
    PORT=3000
    MONGO_URI= your-mongodb-uri
    JWT_SECRET= your-jwt-secret
    CLOUDINARY_NAME= your-cloudinary-name
    CLOUDINARY_API_KEY= your-cloudinary-api-key
    CLOUDINARY_API_SECRET= your-cloudinary-api-secret


## Usage

To run the application locally follow these steps:

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev

2. **Start the frontend server:**
   ```bash
   cd frontend
   npm run dev

3. Open your browser and navigate to http://localhost:5000 to view the application.


## API Endpoints

The backend API includes the following key endpoints

- **User Routes:**
  - 'GET /api/users/getprofile/:query'                -  Getting a users profile
  - 'GET /api/users/getMultipleUsersProfiles/:query'  - Getting multiple users profiles
  - 'GET /api/users//getfollowers/:query'             - Getting followers
  - 'GET /api/users/getfollowing/:query'              - Getting list of people we follow
  - 'GET /api/users/suggestedusers'                   - Suggesting users
  - 'POST /api/users/signup'       - Sign up to register users
  - 'POST /api/users/login'        - Login route
  - 'POST /api/users/logout'       - Logout route
  - 'POST /api/users/follow/:id'   - follow a user
  - 'PUT /api/users/update/:id'    - Updating profile
  - 'PUT /api/users/freeze'        - freeze account
  - 'DELETE /api/users/delete'     - delete account


- **Post Routes:**
   - 'POST /api/posts/create'         - create a post
   - 'DELETE /api/posts/:id'          - delete a post
   - 'PUT /api/posts/like/:id'        - like or dislike a post
   - 'PUT /api/posts/reply/:id'       - reply to a post 
   - 'GET /api/posts/feed'             - get feeds
   - 'GET /api/posts/user/:username'   - get user posts
   - 'GET /api/posts/:id'             - get a post

- **Message Routes:**
   - 'GET /api/messages/messages'        - get converasation messages
   - 'GET /api/messages/:otherUserId'    - get messages
   - 'GET /api/messages/'                - send messages

## Frontend Components

The frontend is divided into several components:

   - **Navbar:** Contains navigation links, search icon, home menu, user profile, Theme toggle Button, Settings. 
   - **Feed:** Displays posts from followed users.
   - **Post:** Individual post component with like, dislike, and reply functionalities.
   - **Chat:** Real-time chat component for messaging.
   - **Settings:** Allows users to manage their account settings, including theme toggling and account freezing.
   - **Profile:** Displays user profile, posts, followers, and following lists.

## Backend Structure

The backend follows a modular structure:

   - **Controllers:** Handles the logic for each route (e.g., authentication, user management, posts). 
   - **Routes:** Defines the API endpoints and links them to the appropriate controllers.
   - **Models:** Defines the MongoDB schemas and models.
   - **Middleware:** Includes middleware for authentication, error handling, etc
   - **Socket.io:** To implement the real time full duplex communication.

## Deployment

- **To deploy your own version:**
The application is deployed on Render. You can access it https://threads-clone-x3cy.onrender.com.

1. **Push your code to a GitHub repository.**
2. **Connect your Render account to your GitHub repository.**
3. **Deploy the frontend and backend separately on Render, ensuring that the environment variables are set correctly.**
4. **You can also deploy them together on single port also where frotend and backend is combined**


