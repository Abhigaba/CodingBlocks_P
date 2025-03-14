# 🛍️ Full-Stack Microservices Shoesole E-Commerce Platform

## 🚀 Project Overview

A comprehensive, microservices-based e-commerce platform built with the MERN (MongoDB, Express.js, React.js, Node.js) stack, designed to provide a robust, scalable, and feature-rich online shopping experience.

## 🌟 Key Features

### 🔐 Authentication & User Management
- User registration and login
- JWT-based authentication
- Role-based access control (User, Admin)
- Password encryption
- Authentication middleware

### 📦 Product Management
- CRUD operations for products
- Admin dashboard for product management
- Product filtering and search
- Detailed product pages
- Image upload for products
- Discount and pricing management

### 📝 Review System
- Add, edit, and delete product reviews
- Rating system (1-5 stars)
- User-specific review management
- Review validation
- Review moderation

### 🛒 Shopping Cart
- Add/remove products from cart
- Quantity management
- Cart persistence
- Price calculation
- Checkout process

### 🖥️ Frontend Features
- Responsive design
- State management with Context API
- Dynamic routing
- Interactive UI components
- Error handling
- Loading states

## 🏗️ Microservices Architecture

### Services
1. **Authentication Service**
   - User registration
   - Login/logout
   - Token management

2. **Product Service**
   - Product CRUD operations
   - Inventory management

3. **Review Service**
   - Review management

4. **Cart Service**
   - Cart operations
   - Price calculations

5. **Coupen Managment**
   - Coupen Operations
   - Final Price calculations

## 💻 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Axios

### Frontend
- React.js
- Next.js
- Tailwind CSS
- Shadcn UI
- Axios
- Context API
- React Router

### DevOps
- Docker
- Kubernetes (optional)
- GitHub Actions (CI/CD)

## 🛠️ Setup and Installation

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm/yarn

### Installation Steps

1. Install dependencies
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd frontend
   npm install
   ```

2. Set up environment variables
   - Create `.env` files in backend and frontend directories
   - Add necessary configurations (DB URL, JWT Secret, etc.)

3. Run services
   ```bash
   # Backend (development)
   npm run start

   # Frontend (development)
   npm run dev
   ```

## 🔒 Security Features
- JWT authentication
- Password hashing
- Input validation
- CORS protection
- Error handling middleware

## 📊 Performance Optimization
- Memoization
- Lazy loading
- Code splitting
- Efficient state management
- Optimized database queries

## 🚧 Future Roadmap
- [ ] Add advanced search and filtering
- [ ] Create admin analytics dashboard
- [ ] Add product recommendations

## 📝 Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request



## 📞 Contact
- Abhi Gaba
- Email: abhigaba300@example.com

---

**Happy Shopping! 🛒✨**