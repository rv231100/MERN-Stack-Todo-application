# MERN Todo App - Backend

---

Server---Express.js
Database---MongoDB
ODM----Mongoose
Authentication--- JWT + HTTP-only Cookie
Password Security--- bcrypt

---

Package----- Purpose
express- Creates our backend server
mongoose- Connects Node.js with MongoDB
dotenv- Stores environment variables
cors- Allows frontend/backend communication
cookie-parser--- Reads cookies
bcryptjs- Encrypts passwords
jsonwebtoken- Creates JWT authentication tokens
nodemon- Automatically restarts server

---

backend folder structure
backend/
│
├── config/
│ └── db.js
│
├── controllers/
│ ├── authController.js
│ └── taskController.js
│
├── middleware/
│ └── authMiddleware.js
│
├── models/
│ ├── User.js
│ └── Task.js
│
├── routes/
│ ├── authRoutes.js
│ └── taskRoutes.js
│
├── .env
├── .gitignore
├── package.json
└── server.js
