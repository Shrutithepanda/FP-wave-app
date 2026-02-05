import Emails from "../model/email.js"
import Emotions from "../model/emotion.js"

export const getEmails = async (req, res) => {
    try {
        let emails 
        // console.log(req.params)
        if (req.params.type === "inbox") {
            emails = await Emails.fetchInbox()
        }
        else if (req.params.type === "high-priority") {
            emails = await Emails.fetchByFolderOrPriority(req.headers.user, "", req.params.type)
        }
        else {
            emails = await Emails.fetchByFolderOrPriority(req.headers.user, req.params.type, "")
        }
        
        return res.status(200).json(emails)
    } catch (error) {
        console.log("controller, getEmails: ", error.message)
        res.status(500).json(error.message)
    }
}

export const saveSentEmail = async (req, res) => {
    try {
        // console.log("controller: ", req.body)
        // Send the req.body to the insertEmail function
        if (req.body?.send_to, req.body?.subject, req.body?.email_body) {
            const email = await Emails.insertEmail(req.body)
            // Send to the client
            res.status(200).json("email saved successfully", email) 
        }

    } catch (error) {
        console.log("controller, saveSentEmail: ", error.message)
        res.status(500).json(error.message)
    }
}

export const moveEmailsToTrash = async (req, res) => {
    try {
        const emails = await Emails.updateFolderName(req.body, "trash")
        return res.status(200).json("emails moved to trash successfully", emails)
    } catch (error) {
        console.log("controller, moveEmailsToTrash: ", error.message)
        res.status(500).json(error.message)
    }
}

export const toggleHighPriorityEmails = async (req, res) => {
    try {
        // console.log(req.body)
        const emails = await Emails.updatePriority([req.body?.id], req.body?.priority, req.body?.type)
        // const email = await Emails.updatePriority(req.body?.priority)
        return res.status(200).json("emails moved to high priority folder successfully", emails)
    } catch (error) {
        console.log("controller, toggleHighPriorityEmails: ", error.message)
        res.status(500).json(error.message)
    }
}

export const deleteEmails = async (req, res) => {
    try {
        await Emails.deleteEmail(req.body)
        return res.status(200).json("emails deleted from the database successfully")
    } catch (error) {
        console.log("controller, deleteEmails: ", error.message)
        res.status(500).json(error.message)
    }
}

export const markEmailAsRead = async (req, res) => {
    try {
        await Emails.markRead([req.body?.id], req.body?.read)
        return res.status(200).json("email marked as read successfully")
    } catch (error) {
        console.log("controller, markAsRead: ", error.message)
        res.status(500).json(error.message)
    }
}

export const detectEmotions = async (req, res) => {
    try {
        const emotion = await Emotions.detectEmotion(req.body.image)
        // console.log("\ndetectEmotions: ", emotion)
        return res.status(200).json(emotion)
    } catch (error) {
        console.log("controller, detectEmotions: ", error.message)
        res.status(500).json(error.message)
    }
}