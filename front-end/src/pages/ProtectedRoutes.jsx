import React, { useState, useEffect } from 'react'
import Loader from '../customComponents/Loader'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/AuthProvider'

/**
 * 
 * @returns a wrapper for protected routes. 
 * While session is not undefined (user is logged in), 
 * they can access all the pages inside otherwise they are returned to the Home page.
 */
function ProtectedRoutes({children}) {
    const { user, authenticated, session } = useAuth()
    // const location = useLocation()
    // console.log("ProtectedRoutes: ", user?.email)
    // console.log("ProtectedRoutes: ", session)

    if (session === undefined) {
        return <Loader />
    }
    
    // If user is not null and is authenticated return child routes otherwise navigate to Login page
    return <>{session ? <>{children}</>: <Navigate to = "/login" />}</>

}
// function ProtectedRoutes() {
//     const { user, authenticated } = useAuth()
//     const location = useLocation()
//     // console.log("ProtectedRoutes: ", user?.email)
//     // console.log("ProtectedRoutes: ", authenticated)
    
//     // If user is not null and is authenticated return child routes otherwise navigate to Login page
//     return user && authenticated
//     ? (<Outlet />) 
//     : (<Navigate to = {"/login"} replace state = {{ path: location.pathname }} />)

// }

export default ProtectedRoutes