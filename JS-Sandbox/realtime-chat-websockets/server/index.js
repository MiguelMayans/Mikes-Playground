import express from "express"
import logger from "morgan"
import dotenv from "dotenv"
import { createClient } from "@libsql/client"
import { Server } from "socket.io"
import { createServer } from "http"

const port = process.env.PORT || 3000
dotenv.config()

const app = express()
const server = createServer(app)

const io = new Server(server, {
  connectionStateRecovery: { maxDisconnectionDuration: 6000 },
})

const db = createClient({
  url: "libsql://selected-lava-man-miguelmayans.turso.io",
  authToken: process.env.DB_TOKEN,
})

await db.execute(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT,
      user TEXT
    )
    `)

io.on("connection", async (socket) => {
  console.log("User connected")

  socket.on("disconnect", () => {
    console.log("User disconnected")
  })

  socket.on("chat message", async (msg) => {
    let result
    let username = socket.handshake.auth.user ?? "Anonymous"

    try {
      result = await db.execute({
        sql: "INSERT INTO messages (content, user) VALUES (:msg, :username)",
        args: { msg, username },
      })
    } catch (error) {
      console.error(error)
      return
    }
    io.emit("chat message", msg, result.lastInsertRowid.toString(), username)
  })

  if (!socket.recovered) {
    try {
      const results = await db.execute({
        sql: "SELECT id, content, user FROM messages where id > ?",
        args: [socket.handshake.auth.serverOffset ?? 0],
      })

      results.rows.forEach((row) => {
        socket.emit("chat message", row.content, row.id.toString(), row.user)
      })
    } catch (error) {
      console.error(error)
      return
    }
  }
})

app.use(logger("dev"))
app.use(express.static("client"))

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/client/index.html")
})

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
