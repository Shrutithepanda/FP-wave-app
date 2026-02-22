import Emails from "../model/email.js"

/**
 * Get emails from the database based on the folder name or priority from either Inbox or Emails table or both
 * @param {string} req - req.params.type: inbox, important or others
 * @param {object} res 
 * @returns a JSON object containing emails according to parameter type or an error response
 */
export const getEmails = async (req, res) => {
    try {
        let emails 
        
        if (req.params.type === "inbox") {
            // If param type is inbox then fetch records from the Inbox table
            emails = await Emails.fetchInbox()
        }
        else if (req.params.type === "important") {
            // If param type is important fetch records where the "important" value is true
            const fromEmails = await Emails.fetchByPriorityFromEmails(req.headers.user)
            const fromInbox = await Emails.fetchByPriorityFromInbox()
            emails = fromEmails.concat(fromInbox)
        }
        else {
            // For any other param type fetch records where the type matches
            emails = await Emails.fetchByFolder(req.headers.user, req.params.type)
        }

        // Return status code 200 OK and emails object
        return res.status(200).json(emails)

    } catch (error) {
        // Return status 500 Internal server error and error message
        console.log("controller, getEmails: ", error.message)
        res.status(500).json(error.message)
    }
}

/**
 * Save an email sent by the client into the database with folder name - "Sent"
 * @param {object} req - send_to, subject, email_body
 * @param {object} res 
 * @returns a success response and the saved email or an error response
 */
export const saveSentEmail = async (req, res) => {
    try {
        // If all the fields have data, call the insertEmail model function 
        // to save the email with the request data
        if (req.body?.send_to, req.body?.subject, req.body?.email_body) {
            const email = await Emails.insertEmail(req.body)
            
            // Return status code 200 OK and the saved email
            return res.status(200).json("email saved successfully", email) 
        }

    } catch (error) {
        // Return status 500 Internal server error and error message
        console.log("controller, saveSentEmail: ", error.message)
        res.status(500).json(error.message)
    }
}

/**
 * Move the emails requested to trash by setting the folder to trash for the matching records
 * @param {object} req - id of the email(s) and folder name: trash
 * @param {object} res 
 * @returns a success response and emails moved to trash or an error response
 */
export const moveEmailsToTrash = async (req, res) => {
    try {
        // Call the update folder name function with the folder name set to trash 
        // and ids for the rows to update the folder name for
        const emails = await Emails.updateFolderName(req.body, "trash")

        // Return status code 200 OK and the emails moved to trash
        return res.status(200).json("emails moved to trash successfully", emails)

    } catch (error) {
        // Return status 500 Internal server error and error message
        console.log("controller, moveEmailsToTrash: ", error.message)
        res.status(500).json(error.message)
    }
}

/**
 * Toggle important emails when the client clicks the bookmark icon. Value is updated in both tables:
 * Inbox and Emails.
 * @param {object} req - id of the selected email, priority (true/false), type (Inbox/others) 
 * @param {object} res 
 * @returns a success response and email(s) marked important or an error response
 */
export const toggleHighPriorityEmails = async (req, res) => {
    try {
        // Call the updatePriority function with appropriate parameters for updating in both tables
        const email = await Emails.updatePriority([req.body?.id], req.body?.priority, req.body?.type)
        
        // Return status code 200 OK and the email marked important
        return res.status(200).json("emails moved to important folder successfully", email)

    } catch (error) {
        // Return status 500 Internal server error and error message
        console.log("controller, toggleHighPriorityEmails: ", error.message)
        res.status(500).json(error.message)
    }
}

/**
 * Delete emails from the database completely. Irreversible action.
 * @param {object} req - id of email(s)
 * @param {string} res - message
 * @returns a success or an error response
 */
export const deleteEmails = async (req, res) => {
    try {
        // Call the deleteEmail function with the ids of the emails to be deleted as the paramter
        await Emails.deleteEmail(req.body)

        // Return status code 200 OK 
        return res.status(200).json("emails deleted from the database successfully")

    } catch (error) {
        // Return status 500 Internal server error and error message
        console.log("controller, deleteEmails: ", error.message)
        res.status(500).json(error.message)
    }
}

/**
 * Mark an unread email as read when the client opens the unread email
 * @param {object} req - id of the opened email and the read value (true/false)
 * @param {string} res - message
 * @returns a success or an error response
 */
export const markEmailAsRead = async (req, res) => {
    try {
        // Call the markRead function with the id of the opened email 
        // and the value to update the 'read' value to
        await Emails.markRead([req.body?.id], req.body?.read)

        // Return status code 200 OK 
        return res.status(200).json("email marked as read")

    } catch (error) {
        // Return status 500 Internal server error and error message
        console.log("controller, markAsRead: ", error.message)
        res.status(500).json(error.message)
    }
}