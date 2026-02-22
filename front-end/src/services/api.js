import axios from 'axios'

// Back-end API's URL
const API_URL = "http://localhost:8000"

/**
 * Makes calls to the back-end API using axios. Used by the middleware - useApi.
 * @param {object} urlObject - endpoint and method (GET, POST, or DELETE)
 * @param {object} body - request body
 * @param {string} type - page seleted in the sidebar
 * @param {uuid} user_id - header
 * @param {int} projectId - header
 * @returns a response with the response data received from the back-end
 */
const API = async (urlObject, body, type, user_id, projectId) => {
    return await axios({
        method: urlObject.method,
        url: `${API_URL}/${urlObject.endpoint}/${type}`,
        data: body,
        headers: { user: user_id, project: projectId }
    })
}

export default API