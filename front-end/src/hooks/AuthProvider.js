import React, { useContext, createContext, useState, useEffect } from 'react'
import supabase from '../supabase/supabaseClient'
import { useNavigate, Navigate } from 'react-router-dom'

// Create auth context
const AuthContext = createContext()

/**
 * 
 * @returns an Auth context provider to wrap the App component around
 */
function AuthProvider ({children}) {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [authenticated, setAuthenticated] = useState(null)
    const [loading, setLoading] = useState(null)

    /**
     * 
     * @param {*} email 
     * @param {*} password 
     * Navigate to Emails page if the user is not null
     */
    const login = async (email, password) => {
        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        
        if (data?.user !== null) {
            navigate("/")
        }
        
        if (error) {
            throw error
        }
    }
    
    /**
     * Log the user out and set user and authenticated to null
     */
    const logout = async () => {
        const {error} = await supabase.auth.signOut()

        if (error) console.log(error)
        // if (error) throw error
        
        setUser(null)
        setAuthenticated(false)
        
    }
    
    /**
     * 
     * @param {*} email 
     * @param {*} password 
     * Register the user and log in the user if session exists
     */
    const register = async (email, password) => {
        const {data: {session}, error} = await supabase.auth.signUp({
            email,
            password
        })
        
        if (session) {
            
            await login(email, password)
        }
        if (error) {
            throw error
        }
    }

    useEffect(() => {
        setLoading(true)
        /**
         * Get the details for the current user. 
         * Set user to the data and authenticated to true.
         */
        const getUser = async () => {
            const {data} = await supabase.auth.getUser()
            const {user: currentUser} = data
            setUser(currentUser ?? null)
            setAuthenticated(true)
            // console.log(data.user)
        }
        setLoading(false)
        
        /**
         * Runs when any auth event occurs. 
         * If session is not null user is set to session.user and authenticated is set to true.
         */
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUser(session.user)
                setAuthenticated(true)
            }
        })
        
        getUser()
        return () => data.subscription.unsubscribe() // Clean up
    }, [])

    return (
        // Return Auth context provider
        <AuthContext.Provider
            value = {{ user, authenticated, login, logout, register }}
        >
            {loading === false && children}
        </AuthContext.Provider>
    )
}

export default AuthProvider

// Create a custom hook - useAuth
export const useAuth = () => useContext(AuthContext)
