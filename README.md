#miniapp project :

This project is designed to build a fullstack miniapp for the management of products.

* User can log in , check various products and their price list with description and update product fields
and can directly save it to database in realtime

-- -- Tech stack involved: React vite + Node.js + Postgres

Frontend :
- React 
- vite 
- React toastify
- Lucide-react

Frontend -  devDependencies: {
    "@eslint/js": "^9.39.1",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "vite": "^7.3.1"
  }

Backend
- Node.js
- Express.js
- JWT Authentication
- cors
- bcrypt.js
- dotenv
- pg

Backend - dependencies: {
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.6",
    "dotenv": "^17.3.1",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "pg": "^8.20.0"
  }

Database: (PostgreSQL) 14.17 

## Project Structure

project-root
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── styles
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend
│   ├── db
│   ├── middleware
│   ├── routes
│   ├── utils
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md

frontend/  
Contains the React application built with Vite. Handles the user interface and client-side logic of miniapp.

backend/  
Node.js + Express server that handles APIs, authentication, and database communication in backend side.


# Installation and Project running process:
 

## 1 Clone the repository:
 
 command:

git clone https://gitlab.com/abhishkatwork/mini-app.git

##2 : Project Setup process:


# Frontend Setup

Navigate to frontend folder in terminal and Install dependencies through this command:


  npm install

then run: npm run dev to run frontend of the application

# Backend Setup

navigate to backend folder in terminal and run npm install there also
and run npm start to start the backend server


# Database setup: 

Create PostgreSQL database:
go to terminal and type this one by one:

psql -U postgres
CREATE DATABASE miniappdb;
\c miniappdb

now you are connected to database just create tables through given block of sql code just copy and paste:

/*


CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  article_no VARCHAR(50),
  product_service VARCHAR(255),
  in_price NUMERIC(12,2),
  price NUMERIC(12,2),
  unit VARCHAR(50),
  in_stock INTEGER,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE translations (
  id SERIAL PRIMARY KEY,
  lang_code VARCHAR(5) NOT NULL,
  key VARCHAR(100) NOT NULL,
  value TEXT NOT NULL
);

*/

# Environment Variables

Create a `.env` file in your backend folder

Create following variables there:

DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your pass
DB_NAME=your db name 
DB_PORT=  5432
JWT_SECRET=your secret key
PORT= any port number here



# Dependencies

Frontend dependencies are listed in:


frontend/package.json


Backend dependencies are listed in:


backend/package.json

# Author

Abhishek Kumar
