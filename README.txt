# HR Dashboard Web Application

## Overview

This is a full-featured **HR Dashboard** web application built with **HTML, CSS, JavaScript**, and **Node.js (Express)** for the backend.  
It provides role-based access for different users like 
**Admin, 
HR Manager, 
Team Lead, 
and Employee**.  

Key features include:

- **Authentication & Authorization** using JWT and cookies.
- **Dashboard** with KPI cards and attendance trends.
- **Employee Management**: View employees and profiles.
- **Attendance Tracking**: View attendance records with status badges.
- **Leave Management**: Approve/reject leave requests and track leave balances.
- **HR / Admin Section**: Manage departments, roles, and company settings.
- **Theme Toggle**: Switch between light and dark mode.
- **Responsive Design**: Mobile-friendly layout.

---

## Project Structure

hr-dashboard/
│
├─ public/
│ ├─ index.html # Login page
│ ├─ dashboard.html # Dashboard page
│ ├─ employees.html # Employee management
│ ├─ attendance.html # Attendance tracking
│ ├─ leave.html # Leave management
│ ├─ hr.html # HR/Admin panel
│ ├─ css/
│ │ └─ style.css # Global styles
│ └─ js/
│ ├─ ui.js # UI interactions and theme toggle
│ └─ auth.js # Client-side auth helper
│
├─ users.json # User credentials for login
├─ server.js # Node.js backend with Express

#Logins & Roles
[
  {
    "email": "admin@hr.com",
    "password": "admin123",
    "role": "Admin"
  },
  {
    "email": "hrmanager@hr.com",
    "password": "hr123",
    "role": "HR Manager"
  },
  {
    "email": "teamlead@hr.com",
    "password": "team123",
    "role": "Team Lead"
  },
  {
    "email": "employee@hr.com",
    "password": "emp123",
    "role": "Employee"
  }
]
