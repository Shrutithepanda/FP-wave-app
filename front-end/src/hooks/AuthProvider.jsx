import React, { useContext, createContext, useState, useEffect } from 'react'
import supabase from '../supabase/supabaseClient'
import Loader from '../customComponents/Loader'

// Create auth context
const AuthContext = createContext({ user: null })

/**
 * 
 * @returns an Auth context provider to wrap the app components around
 */
const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(undefined)
    const [user, setUser] = useState(null)
    const [authenticated, setAuthenticated] = useState(null)
    const [loading, setLoading] = useState(null)

    /**
     * Login a user with email and password
     * @param {*} email 
     * @param {*} password 
     * @returns success state and data or error
     */
    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        
        if (error) {
            return { success: false, error: error.message }
        }
        if (data) {
            setUser(data.user)
            setAuthenticated(true)
            return { success: true, data }
        }
        
    }
    
    /**
     * Log the user out and set user and authenticated to null
     */
    const logout = async () => {
        const { error } = await supabase.auth.signOut()

        if (error) throw error
        
        setUser(null)
        setAuthenticated(false)
    }
    
    /**
     * Register a new user 
     * @param {*} email 
     * @param {*} password 
     * @returns success state and data or error
     */
    const register = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        })
        
        if (error) {
            return { success: false, error: error.message }
        }

        return { success: true, data }
    }

    useEffect(() => {
        /**
         * Get the details for the current user. 
         * Set user to the data and authenticated to true.
         */
        const getUser = async () => {
            const {data} = await supabase.auth.getUser()
            const {user: currentUser} = data
            setUser(currentUser ?? null)
            setAuthenticated(true)
            setLoading(false)
        }
        getUser()

        supabase.auth.getSession()
        .then(
            ( {data: { session }} ) => {
                setSession(session)
            }
        )
        
        /**
         * Runs when any auth event occurs. 
         * If session is not null user is set to session.user and authenticated is set to true.
         */
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUser(session.user)
                setAuthenticated(true)
                setSession(session)
                setLoading(false)
            }
        })
        
        return () => data?.subscription.unsubscribe() // Clean up
    }, [])

    return (
        // Return Auth context provider
        <AuthContext.Provider
            value = {{ user, authenticated, session, login, logout, register }}
        >
            { loading === false ? children : <Loader/> }
        </AuthContext.Provider>
    )
}

export default AuthProvider

// Custom hook 
export const useAuth = () => useContext(AuthContext)
