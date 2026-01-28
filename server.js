const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = "SUPER_SECRET_KEY";

// CORS setup for GitHub Pages front-end
app.use(cors({
  origin: 'https://your-github-username.github.io', // <-- replace with your GitHub Pages URL
  credentials: true
}));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));

let users = [];
const usersFile = path.join(__dirname, 'users.json');

try {
  const data = fs.readFileSync(usersFile, 'utf8');
  users = JSON.parse(data);
} catch (err) {
  users = [];
}

function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
}

function authorizeRoles(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { email: user.email, role: user.role },
    SECRET_KEY,
    { expiresIn: '2h' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'none',
    secure: true
  });

  res.json({ message: 'Login successful', role: user.role });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token', { sameSite: 'none', secure: true });
  res.json({ message: 'Logged out' });
});

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

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
