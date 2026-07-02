# TrendsOfTUM-2025 (TOTv2)

TrendsOfTUM-2025 is a modern, full-stack social media web application designed to connect users through posts, real-time messaging, and interactive discussions. Built with a stunning **Glassmorphism UI**, this platform offers a premium user experience while relying on a robust tri-stack architecture.

## 🏗️ Architecture Overview

The project is split into three distinct, decoupled services:

1. **Frontend (`tot-frontend`)**: A responsive, fast, and interactive user interface built with React and Vite. It heavily utilizes Tailwind CSS to achieve its signature glassmorphism aesthetic.
2. **Backend API (`api.totumdy.com`)**: A powerful REST API built with Laravel. It handles business logic, user authentication (via Sanctum), database migrations, and media uploads.
3. **Real-time Server (`chat-server-nodejs-v2`)**: A Node.js and Socket.IO server dedicated to managing persistent WebSocket connections for real-time chat, live comments, and instantaneous reactions.

## ✨ Key Features

* **Authentication System**: Secure registration and login using Laravel Sanctum API tokens.
* **Dynamic Feed & Categories**: Filter posts seamlessly by predefined categories (News, Memes, Entertainment, Study, Announcements).
* **Rich Media Posts**: Support for uploading and sharing text, images, videos, and audio.
* **Real-time Interactions**:
  * Live updates for **Comments** on posts.
  * Instant synchronized **Reactions** (Like, Sad, Angry).
* **Follow System**: Build your network by following and unfollowing users.
* **Real-time Chat**: Private, real-time one-on-one messaging available exclusively between mutual followers.
* **Profile Management**: Update your avatar/profile picture and username.

---

## 🚀 Getting Started

Follow these step-by-step instructions to get the entire application running on your local machine.

### Prerequisites
Make sure you have the following installed:
* **PHP** (8.1 or higher) & **Composer**
* **Node.js** (v16 or higher) & **npm**
* **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/AungPhyoeNaing/TrendsOfTUM-2025.git
cd TrendsOfTUM-2025
```

### 2. Setup the Laravel API Backend
The backend utilizes SQLite for out-of-the-box local development without requiring a separate SQL server.

```bash
cd api.totumdy.com

# Install PHP dependencies
composer install

# Set up environment variables
cp .env.example .env
# Ensure your .env has DB_CONNECTION=sqlite and DB_DATABASE=.../database.sqlite

# Generate application key
php artisan key:generate

# Create the SQLite database file
touch database/database.sqlite

# Run database migrations and seeders (to populate initial data)
php artisan migrate --seed

# Link the storage directory (CRITICAL for media uploads to work)
php artisan storage:link

# Start the Laravel development server (runs on http://127.0.0.1:8000 by default)
php artisan serve
```

### 3. Setup the Node.js Chat Server
Open a **new terminal window** and navigate to the chat server directory.

```bash
cd chat-server-nodejs-v2

# Install Node dependencies
npm install

# Start the real-time server (runs on http://localhost:3001 by default)
node server.js
```

### 4. Setup the React Frontend
Open a **third terminal window** and navigate to the frontend directory.

```bash
cd tot-frontend

# Install frontend dependencies
npm install

# Start the Vite development server (runs on http://localhost:5173 by default)
npm run dev
```

---

## 🛠️ Tech Stack Details

### Frontend (`tot-frontend`)
* **Framework**: React 18
* **Build Tool**: Vite
* **Styling**: Tailwind CSS (customized for glassmorphism)
* **API Client**: Axios
* **WebSockets**: Socket.IO-Client

### Backend (`api.totumdy.com`)
* **Framework**: Laravel 10.x
* **Database**: SQLite (Configured for local development)
* **Authentication**: Laravel Sanctum
* **File Storage**: Local Storage (`storage/app/public`)

### Real-time Server (`chat-server-nodejs-v2`)
* **Environment**: Node.js
* **Framework**: Express
* **WebSockets**: Socket.IO

---

## 🐛 Troubleshooting

* **Media Not Showing**: If images or videos are returning 404 errors, ensure you ran `php artisan storage:link` inside the `api.totumdy.com` folder.
* **CORS Errors**: The backend is configured to accept requests from `http://localhost:5173` and `http://127.0.0.1:5173`. If you run the frontend on a different port, update the `allowed_origins` in `api.totumdy.com/config/cors.php`.
* **Chat/Live Updates Not Working**: Ensure the Node.js server is actively running on port 3001 and that no firewall is blocking WebSocket connections.

---
*Developed for TrendsOfTUM-2025*
