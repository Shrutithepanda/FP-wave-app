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
        endpoint: "high-priority",
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
        endpoint: "high-priority-projects",
        method: "POST"
    }
}

export const EMOTION_API_URLS = {
    detectEmotions: {
        endpoint: "detect-emotions",
        method: "POST"
    }    
}