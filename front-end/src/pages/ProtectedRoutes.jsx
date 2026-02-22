import React from 'react'
import Loader from '../customComponents/Loader'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/AuthProvider'

/**
 *
 * @param {JSX} children
 * @returns a wrapper for private routes. 
 */
const ProtectedRoutes = ({ children }) => {
    const { session } = useAuth()

    // While the session is being returned show the loader
    if (session === undefined) {
        return <Loader />
    }
    
    // If the user has a session, return child routes otherwise navigate to Login page
    return <>
        { session 
            ? <>
                {children}
            </>
            : <Navigate to = "/login" />
        }
    </>

}

export default ProtectedRoutes