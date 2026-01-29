const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000; // Use Render's dynamic port
const SECRET_KEY = process.env.SECRET_KEY || "SUPER_SECRET_KEY";

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Load users
let users = [];
const usersFile = path.join(__dirname, 'users.json');

try {
  const data = fs.readFileSync(usersFile, 'utf8');
  users = JSON.parse(data);
  console.log('Users loaded successfully');
} catch (err) {
  console.error('Error loading users.json:', err);
}

// Authentication Middleware
function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
}

// Role-based Authorization
function authorizeRoles(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '2h' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'Lax' });
  res.json({ message: 'Login successful', role: user.role });
});

// Logout
app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

// Protected Pages
app.get('/dashboard', authenticateToken, authorizeRoles(['Admin','Team Lead','HR Manager','Employee']), (req, res) => {
  res.sendFile(path.join(__dirname, 'public/dashboard.html'));
});

app.get('/employees', authenticateToken, authorizeRoles(['Admin','HR Manager']), (req, res) => {
  res.sendFile(path.join(__dirname, 'public/employees.html'));
});

app.get('/leave', authenticateToken, authorizeRoles(['Admin','HR Manager','Employee']), (req, res) => {
  res.sendFile(path.join(__dirname, 'public/leave.html'));
});

app.get('/attendance', authenticateToken, authorizeRoles(['Admin','HR Manager','Team Lead']), (req, res) => {
  res.sendFile(path.join(__dirname, 'public/attendance.html'));
});

app.get('/hr', authenticateToken, authorizeRoles(['Admin']), (req, res) => {
  res.sendFile(path.join(__dirname, 'public/hr.html'));
});

/* Catch-all for frontend routing (optional for single-page behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});*/

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
