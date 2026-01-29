const express = require('express')
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

const app = express()
const PORT = process.env.PORT || 3000
const SECRET_KEY = process.env.SECRET_KEY || 'SUPER_SECRET_KEY'

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

const usersFile = path.join(__dirname, 'users.json')
let users = []

try {
  users = JSON.parse(fs.readFileSync(usersFile, 'utf8'))
} catch {}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.redirect('/')

  const token = authHeader.split(' ')[1]
  if (!token) return res.redirect('/')

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.redirect('/')
    req.user = user
    next()
  })
}

function authorizeRoles(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send('Access denied')
    }
    next()
  }
}

app.post('/api/login', (req, res) => {
  const { email, password } = req.body
  const user = users.find(u => u.email === email && u.password === password)

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { email: user.email, role: user.role },
    SECRET_KEY,
    { expiresIn: '2h' }
  )

  res.json({ token, role: user.role })
})

app.get('/dashboard',
  authenticateToken,
  authorizeRoles(['Admin','Team Lead','HR Manager','Employee']),
  (req, res) => {
    res.sendFile(path.join(__dirname, 'public/dashboard.html'))
  }
)

app.get('/employees',
  authenticateToken,
  authorizeRoles(['Admin','HR Manager']),
  (req, res) => {
    res.sendFile(path.join(__dirname, 'public/employees.html'))
  }
)

app.get('/leave',
  authenticateToken,
  authorizeRoles(['Admin','HR Manager','Employee']),
  (req, res) => {
    res.sendFile(path.join(__dirname, 'public/leave.html'))
  }
)

app.get('/attendance',
  authenticateToken,
  authorizeRoles(['Admin','HR Manager','Team Lead']),
  (req, res) => {
    res.sendFile(path.join(__dirname, 'public/attendance.html'))
  }
)

app.get('/hr',
  authenticateToken,
  authorizeRoles(['Admin']),
  (req, res) => {
    res.sendFile(path.join(__dirname, 'public/hr.html'))
  }
)

app.listen(PORT)
