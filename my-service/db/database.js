const Database = require('better-sqlite3')

const db = new Database('database.db')

// Создаём таблицы при первом запуске
db.prepare(`
    CREATE TABLE IF NOT EXISTS User (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password  TEXT NOT NULL,
        role TEXT NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
`).run()

db.prepare(`
    CREATE TABLE IF NOT EXISTS Boiler (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        createdBy INTEGER NOT NULL,
        FOREIGN KEY (createdBy) REFERENCES User(id) ON DELETE CASCADE
    )
`).run()


db.prepare(`
    CREATE TABLE IF NOT EXISTS News (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        createdBy INTEGER NOT NULL ,
        FOREIGN KEY (createdBy) REFERENCES User(id) ON DELETE CASCADE
    )
`).run()
db.prepare(`
    CREATE TABLE IF NOT EXISTS Comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        text TEXT NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
    )
`).run()

module.exports = db