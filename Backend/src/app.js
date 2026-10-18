const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())

// Ye change kya karta hai? Backend ab tumhari local development website aur deployed Vercel website, dono se browser requests accept karega. credentials: true authentication cookies ke liye zaroori hai.
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://interview-prep-ai-khaki-eight.vercel.app",
        "https://interview-prep-ai-git-main-satyamjais.vercel.app",
        "https://interview-prep-lpnj8585l-satyamjais.vercel.app"
    ],
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)



module.exports = app