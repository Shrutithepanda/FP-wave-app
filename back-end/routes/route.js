import express from "express"

import { 
    getEmails, 
    saveSentEmail, 
    moveEmailsToTrash, 
    toggleHighPriorityEmails, 
    deleteEmails, 
    markEmailAsRead, 
} from "../controller/email_controller.js"

import { 
    fetchProjects, 
    moveProjectToTrash,
    toggleHighPriorityProjects,
    createProject,
    createTask,
    fetchTasks,
    updateProject,
    updateTask,
    deleteProjects,
    deleteTask,
} from "../controller/task_controller.js"

import {
    detectEmotions
} from "../controller/emotion_controller.js"

// Initialise the router
const routes = express.Router()

// Routes for Emails
routes.get("/emails/:type", getEmails)

routes.post("/save", saveSentEmail)

routes.post("/save-draft", saveSentEmail)

routes.post("/delete", moveEmailsToTrash)

routes.post("/important", toggleHighPriorityEmails)

routes.delete("/completely-delete", deleteEmails)

routes.post("/read-email", markEmailAsRead)

// Routes for Tasks
routes.get("/tasks/:type", fetchProjects)

routes.post("/delete-project", moveProjectToTrash)

routes.post("/important-projects", toggleHighPriorityProjects)

routes.post("/create-project", createProject)

routes.post("/save-project-draft", createProject)

routes.post("/create-task", createTask)

routes.get("/fetch-tasks", fetchTasks)

routes.post("/update-project", updateProject)

routes.post("/update-task", updateTask)

routes.delete("/completely-delete-project", deleteProjects)

routes.delete("/delete-task", deleteTask)

// Routes for Emotions
routes.post("/detect-emotions", detectEmotions)

export default routes