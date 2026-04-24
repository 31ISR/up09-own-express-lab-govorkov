const express = require('express')
const db = require('./db')
const jwt = require('jsonwebtoken')
const bcr = require('bcryptjs')

const app = express()
const SECRET = process.env.SECRET || 'my-secret-key'

app.use(express.json()) // разбираем JSON из тела запроса

// --- Роуты ---
app.get('/api/hello', (req, res) => {
    return res.status(200).json({ message: 'Hello, World!' })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})