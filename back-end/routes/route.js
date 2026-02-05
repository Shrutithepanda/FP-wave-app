import express from "express"
import { 
    saveSentEmail, 
    getEmails, 
    moveEmailsToTrash, 
    toggleHighPriorityEmails, 
    deleteEmails, 
    markEmailAsRead, 
    detectEmotions // move to new controller
} from "../controller/email_controller.js"

import { 
    getProjects, 
    toggleHighPriorityProjects,
} from "../controller/task_controller.js"

const routes = express.Router()

// Routes for Emails
routes.get("/emails/:type", getEmails)

routes.post("/save", saveSentEmail)

routes.post("/save-draft", saveSentEmail)

routes.post("/delete", moveEmailsToTrash)

routes.post("/high-priority", toggleHighPriorityEmails)

routes.delete("/completely-delete", deleteEmails)

routes.post("/read-email", markEmailAsRead)

// Routes for Tasks
routes.get("/tasks/:type", getProjects)

routes.post("/high-priority-projects", toggleHighPriorityProjects)

// Routes for Emotions
routes.post("/detect-emotions", detectEmotions)

export default routes