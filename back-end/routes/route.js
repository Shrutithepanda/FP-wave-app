import express from "express"
import { saveSentEmail, getEmails, moveEmailsToTrash, toggleHighPriorityEmails, deleteEmails } from "../controller/email_controller.js"

const routes = express.Router()

routes.post("/save", saveSentEmail)

routes.get("/emails/:type", getEmails)

routes.post("/save-draft", saveSentEmail)

routes.post("/delete", moveEmailsToTrash)

routes.post("/high-priority", toggleHighPriorityEmails)

routes.delete("/completely-delete", deleteEmails)

export default routes