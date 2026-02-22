import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import supabase from "../front-end/src/supabase/supabaseClient.js"
import routes from "./routes/route.js"

dotenv.config()

const port = process.env.PORT;
const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Router for handling routes related to the back-end APIs
app.use("/", routes)

app.listen(port, () => console.log(`Listening on port ${port}`))
