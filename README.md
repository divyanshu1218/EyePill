# 👓 EyePill

### A Premium Full-Stack Eyewear E-Commerce Platform

Modern • Animated • Scalable • Production-Ready

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)

![GitHub stars](https://img.shields.io/github/stars/divyanshu1218/EyePill?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/divyanshu1218/EyePill?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/divyanshu1218/EyePill?style=for-the-badge)
![GitHub license](https://img.shields.io/github/license/divyanshu1218/EyePill?style=for-the-badge)

---

## 🌟 Overview

EyePill is a modern full-stack eyewear e-commerce platform designed to deliver a luxury shopping experience through immersive animations, elegant UI design, and scalable backend architecture.

Built using React, Node.js, Express, MySQL, and Sequelize ORM, the application combines premium frontend interactions with robust backend infrastructure.

---

# ✨ Features

## 🛍️ Customer Features

- 🔍 Advanced product search, sorting, and filtering
- ❤️ Wishlist management
- 🛒 Persistent shopping cart
- 👤 Secure JWT authentication
- 📱 Fully responsive mobile-first design
- 🎞️ Smooth page transitions and UI animations
- 🖼️ Auto-loop product gallery previews
- 🌙 Dark-themed glassmorphism interface

---

## 🛠️ Admin Features

- 📦 Full product CRUD system
- 🖼️ Secure image uploads using Multer
- 🧩 Dynamic color & size tagging
- ⚡ Optimistic UI updates
- ↩️ 5-second undo delete system
- 🔐 Role-based admin authorization
- 📊 Dashboard-based inventory management

---

# 🧠 Tech Stack

| Frontend | Backend | Database | Authentication |
|----------|----------|-----------|----------------|
| React.js | Node.js | MySQL | JWT |
| Tailwind CSS | Express.js | Sequelize ORM | Bcrypt |
| Framer Motion | Multer | Relational Models | Role-Based Access |

---

# 📸 Preview

## 🏠 Homepage

```md
![Homepage](./screenshots/home.png)
```

## 🛍️ Product Page

```md
![Products](./screenshots/products.png)
```

## ⚙️ Admin Dashboard

```md
![Admin](./screenshots/admin.png)
```

---

# 🏗️ Project Structure

```bash
EyePill/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── components/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── config/
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 📋 Prerequisites

- Node.js >= 14
- MySQL Server
- Git

---

## 🚀 Clone Repository

```bash
git clone https://github.com/divyanshu1218/EyePill.git
cd EyePill
```

---

# 🔧 Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=eyepill_db

JWT_SECRET=your_secret_key
```

Start backend server:

```bash
npm run dev
```

---

# 🎨 Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```bash
http://localhost:3000
```

Backend API runs on:

```bash
http://localhost:5000
```

---

# 🔐 Authentication Flow

EyePill uses JWT-based stateless authentication:

1. User logs in
2. Server validates credentials
3. JWT token is generated
4. Token stored client-side
5. Protected routes verified using middleware

---

# 🗄️ Database Design

## Core Relational Models

- Users
- Products
- Categories
- Cart
- Wishlist
- Orders
- Reviews

## Features

- Cascading Deletes
- Foreign Key Relationships
- Optimized Query Associations
- Sequelize ORM Abstractions

---

# 🎞️ UI/UX Highlights

- Glassmorphism effects
- Smooth hover interactions
- Framer Motion transitions
- Animated dropdown navigation
- Sticky responsive navbar
- Mobile-first responsiveness
- Crossfade image transitions

---

# 🚀 Deployment

## Frontend

Recommended platforms:

- Vercel
- Netlify

## Backend

Recommended platforms:

- Render
- Railway
- VPS + Nginx

## Database Hosting

Recommended providers:

- PlanetScale
- Railway MySQL
- AWS RDS

---

# 📈 Future Improvements

- 💳 Stripe payment integration
- 📦 Order tracking system
- ⭐ Product reviews & ratings
- 🔔 Real-time notifications
- 🌐 Multi-language support
- 🧾 Invoice generation
- 📊 Sales analytics dashboard

---

# 🧪 Performance & Security

- Password hashing with bcrypt
- Protected admin routes
- Optimistic frontend rendering
- Efficient relational queries
- Secure file upload handling

---

# 🤝 Contributing

Contributions, issues, and feature requests are welcome.

## Steps

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/AmazingFeature
```

3. Commit your changes

```bash
git commit -m "Add AmazingFeature"
```

4. Push to GitHub

```bash
git push origin feature/AmazingFeature
```

5. Open a Pull Request

---

# 📄 License

Distributed under the MIT License.

---

# 👨‍💻 Author

## Divyanshu

Built with passion for modern web experiences.

⭐ If you like this project, consider giving it a star.