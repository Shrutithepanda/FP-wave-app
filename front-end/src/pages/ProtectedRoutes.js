import React, { useState, useEffect } from 'react'
import supabase from '../supabase/supabaseClient'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/AuthProvider'

/**
 * 
 * @returns a wrapper for protected routes. 
 * While user is authenticated and not null (logged in), 
 * they can access all the pages inside otherwise they are returned to the Login page.
 */
function ProtectedRoutes() {
    const { user, authenticated } = useAuth()
    // const location = useLocation()
    // console.log("ProtectedRoutes: ", user?.email)
    
    // If user is not null and is authenticated return child routes otherwise navigate to Login page
    return user && authenticated
    ? (<Outlet />) 
    : (<Navigate to = {"/login"} />)

}

export default ProtectedRoutes