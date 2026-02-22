// API URLS for Emails tab
export const EMAIL_API_URLS = {
    getEmailFromType: {
        endpoint: "emails",
        method: "GET"
    },
    saveSentEmail: {
        endpoint: "save",
        method: "POST"
    },
    saveDraft: {
        endpoint: "save-draft",
        method: "POST"
    },
    moveEmailsToTrash: {
        endpoint: "delete",
        method: "POST"
    },
    toggleHighPriorityEmails: {
        endpoint: "important",
        method: "POST"
    },
    deleteEmail: {
        endpoint: "completely-delete",
        method: "DELETE"
    },
    markAsRead: {
        endpoint: "read-email",
        method: "POST"
    },
}

// API URLS for Tasks tab
export const TASK_API_URLS = {
    getProjects: {
        endpoint: "tasks",
        method: "GET"
    },
    moveProjectToTrash: {
        endpoint: "delete-project",
        method: "POST"
    },
    toggleHighPriorityProjects: {
        endpoint: "important-projects",
        method: "POST"
    },
    createProject: {
        endpoint: "create-project", 
        method: "POST"
    },
    saveProjectToDraft: {
        endpoint: "save-project-draft", 
        method: "POST"
    },
    createTask: {
        endpoint: "create-task", 
        method: "POST"
    },
    fetchTasks: {
        endpoint: "fetch-tasks",
        method: "GET"
    },
    updateProject: {
        endpoint: "update-project",
        method: "POST"
    },
    updateTask: {
        endpoint: "update-task",
        method: "POST"
    },
    deleteProject: {
        endpoint: "completely-delete-project",
        method: "DELETE"
    },
    deleteTask: {
        endpoint: "delete-task",
        method: "DELETE"
    },
}

// API URL for Emotion detection
export const EMOTION_API_URLS = {
    detectEmotions: {
        endpoint: "detect-emotions",
        method: "POST"
    }    
}