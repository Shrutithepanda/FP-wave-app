import axios from 'axios'

const API_URL = "http://localhost:8000"

/**
 * Contains basic structure for all API calls to the back-end using axios.
 * Used by the middleware usApi.
 */
const EMAIL_API = async (urlObject, body, type, user_id) => {
    return await axios({
        method: urlObject.method,
        url: `${API_URL}/${urlObject.endpoint}/${type}`,
        data: body,
        headers: {user: user_id}
    })
}

export default EMAIL_API