const express = require('express')
const db = require('./db')
const jwt = require('jsonwebtoken')
const bcr = require('bcryptjs')
const app = express()
const SECRET = process.env.SECRET || "Влад123456"
app.use(express.json())

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json({ error: "Missing auth header" })
    }
    const token = authHeader.split(" ")[1]
    if (!token) {
        return res.status(401).json({ error: "Wrong token format" })
    }
    try {
        const decoded = jwt.verify(token, SECRET)
        const user = db.prepare("SELECT id, username, email, role FROM user WHERE id = ?").get(decoded.id)

        if (!user) {
            return res.status(401).json({ error: "User not found" })
        }

        req.user = user
        next()
    } catch (error) {
        console.error(error)
        return res.status(401).json({ error: "Invalid token" })
    }
}

app.post('/api/auth/register', (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Все поля обязательны" })
    }

    try {
        const salt = bcr.genSaltSync(10)
        const hashedPassword = bcr.hashSync(password, salt)

        const query = db.prepare(
            "INSERT INTO user (username, email, password) VALUES (?, ?, ?)"
        ).run(username, email, hashedPassword)

        const newUser = db.prepare("SELECT id, username, email, role, createdAt FROM user WHERE id = ?")
            .get(query.lastInsertRowid)

        const token = jwt.sign({ id: newUser.id, role: newUser.role }, SECRET, { expiresIn: "24h" })

        res.status(201).json({ user: newUser, token })
    } catch (error) {
        console.error(error)
        if (error.message.includes("UNIQUE")) {
            return res.status(400).json({ error: "Username или email уже существуют" })
        }
        res.status(500).json({ error: "Ошибка регистрации" })
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})