import axios from 'axios'

const API_URL = "http://localhost:8000"

/**
 * Contains basic structure for all API calls using the fetch API.
 * Used by the middleware.
 */
const EMAIL_API = async (urlObject, body, type, user_id) => {
    return await axios({
        method: urlObject.method,
        url: `${API_URL}/${urlObject.endpoint}/${type}`,
        data: body,
        headers: {user: user_id}
    })

    
    
    // Not working properly maybe, client can't save an email in the table
    // return await fetch(`/emails/${urlObject.endpoint}`, {
    //     method: urlObject.method,
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(body)
    // })

    // fetch("/create_email", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //         user_id: user.id,
    //         send_to: data.to,
    //         subject: data.subject,
    //         email_body: data.body,
    //         read: null
    //     })
    // })
}

export default EMAIL_API