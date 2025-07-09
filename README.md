# 🩺 Medify – Doctor's Appointment App

Medify is a modern, full-stack web application that simplifies the process of booking doctor appointments. With a user-friendly interface and robust backend, it allows users to register, browse doctors by specialization, book consultations, and manage their health information — all in one place.

---

## 🚀 Tech Stack

- **Frontend:** React.js (with TailwindCSS, Framer Motion)
- **Backend:** Express.js
- **Database:** MongoDB (with Mongoose)
- **Authentication:** JWT with secure HTTP-only cookies
- **Real-time Features:** WebSocket (optional for chat or notifications)

---

## 🌟 Features

### 👤 User & Doctor Registration
- Multi-step registration with role-based inputs (User / Doctor)
- Image upload with preview and removal
- Dynamic form fields based on selected role

### 🧑‍⚕️ Doctor Listings & Profiles
- Browse by specialization or category
- View detailed doctor profiles with availability
- Real-time availability updates (planned)

### 📅 Appointment Booking
- Book in-person or online consultations
- View and manage upcoming appointments
- Doctors can accept or decline appointments

### 🔒 Secure Authentication
- JWT-based login/logout with refresh token rotation
- HTTP-only cookie storage for enhanced security

### 📝 Editable Profiles
- Users and doctors can update profile details
- Fields include name, gender, height/weight, contact, etc.

### 🏥 Doctor Categorization
- Specializations grouped under broader medical categories
- Dynamic dropdowns based on selected department

## Environment set-up
- PORT=5000
- MONGO_URI=your_mongodb_connection_string
- ACCESS_TOKEN_SECRET=your_access_token_secret
- REFRESH_TOKEN_SECRET=your_refresh_token_secret
