export const API_URLS = {
    saveSentEmail: {
        endpoint: "save",
        method: "POST"
    },
    getEmailFromType: {
        endpoint: "emails",
        method: "GET"
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
    }
}