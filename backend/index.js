
const express = require("express")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const path = require("path");
const passport = require("passport");
const session = require("express-session")
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose')
const Board = require("./models/Board")

dotenv.config({path: "./config/config.env"})

require("./config/passport")(passport)

connectDB()

const app = express()
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({mongoUrl: process.env.MONGO_URI,}),
    })
  )
  

app.use(passport.initialize())
app.use(passport.session())


app.use(express.static("public"))

app.use("/", require("./routes/index"))
app.use("/auth", require("./routes/auth"))


const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server going on port ${PORT}`))