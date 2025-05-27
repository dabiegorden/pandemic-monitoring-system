const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const session = require("express-session")
const db = require("./db")
const app = express()
const { router: liveUpdatesRoute, setSocket } = require("./liveUpdates")
const http = require("http")
const { Server } = require("socket.io")

require("dotenv").config()

const contactRoutes = require("./contacts")
const subscriptionRoutes = require("./subscribe")
const pandemics = require("./pandemics")
const cases = require("./cases")
const authRoutes = require("./auth")
const newsRoutes = require("./news")
const predictionRoute = require("./predictions")
const notificationRoutes = require("./notification")
const communityRoutes = require("./community")
const modelRoutes = require("./model")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
)

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "pandemic-monitoring-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hour session
    },
  }),
)

// Create HTTP server
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

// Attach WebSocket to the live updates route
setSocket(io)

io.on("connection", (socket) => {
  console.log("New WebSocket Client Connected!")

  socket.on("disconnect", () => {
    console.log("Client Disconnected")
  })
})

// Define API routes
app.use("/api/live-updates", liveUpdatesRoute)
app.use("/api/contacts", contactRoutes)
app.use("/api/subscribe", subscriptionRoutes)
app.use("/api/pandemics", pandemics)
app.use("/api/pandemic_cases", cases)
app.use("/api/auth", authRoutes)
app.use("/api/news", newsRoutes)
app.use("/api/predictions", predictionRoute)
app.use("/api", notificationRoutes)
app.use("/api/community", communityRoutes)
app.use("/api/model", modelRoutes)

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" })
})

// Start the server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Email notifications enabled`)
})
