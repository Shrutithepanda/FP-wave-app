import Emails from "../model/email.js"

// import {LocalStorage} from 'node-localstorage' 
// var localStorage = new LocalStorage("./scratch")

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
            // How to properly pass user id
            emails = await Emails.fetchByFolderOrPriority(req.headers.user, req.params.type, "")
        }

        return res.status(200).json(emails)
    } catch (error) {
        console.log("controller, getEmails: ", error.message)
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
        const emails = await Emails.updatePriority([req.body?.id], req.body?.priority)
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