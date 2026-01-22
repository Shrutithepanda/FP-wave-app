import { useState } from "react"
import EMAIL_API from "../services/api"

/**
 * Custom hook, middleware to handle API calls
 * @param (object) urlObject - the object passed by the client as a call to the email API
 * @returns callApi function, response, error, and loading state
 */
const useApi = (urlObject) => {
    const [response, setResponse] = useState(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const call = async (body, type = "", user_id) => {
        // Clean up any previous value
        setResponse(null)
        setError("")

        // Start loading before calling the API
        setLoading(true)
        try {
            let res = await EMAIL_API(urlObject, body, type, user_id)
            setResponse(res?.data)
            // console.log("useApi: ", res?.data)

        } catch (error) {
            setError(error.message)
            // console.log("useApi: ", error.message)

        } finally {
            setLoading(false)
        }
    }

    return {call, response, error, loading}
}

export default useApi