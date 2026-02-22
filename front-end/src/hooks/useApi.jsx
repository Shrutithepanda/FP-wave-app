import { useState } from "react"
import API from "../services/api"

/**
 * Custom hook, middleware to make API calls
 * @param {object} urlObject - the object passed by the client as a call to the API containing URL endpoint and method
 * @returns the call function, response, error, and loading state
 */
const useApi = (urlObject) => {
    const [response, setResponse] = useState(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    /**
     * Function that calls the API with the required parameters
     * @param {object} body - request body
     * @param {string} type - selected page from the sidebar
     * @param {uuid} userId 
     * @param {int} projectId 
     * @returns response data or error
     */
    const call = async (body, type = "", userId = null, projectId = null) => {
        // Clean up any previous values
        setResponse(null)
        setError("")

        // Start loading before calling the API
        setLoading(true)
        try {
            // Call the API with the required parameters
            let res = await API(urlObject, body, type, userId, projectId)

            // Set response to the API's response
            setResponse(res?.data)
            // if(type == "important") 
            // console.log("useApi response: ", type, res?.data)

            // Return the response data
            return res.data

        } catch (error) {
            // Return error
            setError(error.message)
            console.log("useApi error: ", type, error.message)

        } finally {
            setLoading(false)
        }
    }

    return { call, response, error, loading }
}

export default useApi