import React, { useEffect, useState } from 'react'
import supabase from '../supabase/supabaseClient'
import { useNavigate } from 'react-router-dom'

import AppHeader from '../customComponents/AppHeader'
import Loader from '../customComponents/Loader'
import { useAuth } from '../hooks/AuthProvider'

const Emails = () => {
    const navigate = useNavigate()
    const [emailData, setEmailData] = useState([{}])
    const [loading, setLoading] = useState(false)

    const { logout, user } = useAuth()

    // console.log(user)

    useEffect(() => {
        fetch("/emails")
        .then(
            response => response.json()
        )
        .then(
            data => {
                setEmailData(data)
            }
        )
    }, [])

    /**
     * 
     * Handle user log out.
     */
    const handleLogout = async (e) => {
        e.preventDefault()
        try {
            const error = await logout()
            // if (error) throw error
            if (error) console.log("Error Logging out: ", error)
            navigate("/login")
            
        } catch (error) {
            console.log("Error Logging out: ", error.message)
        }
    }
    return (
        <div>
            <AppHeader />

            {loading 
                ? <>
                    <Loader /> 
                </>
                : <>
                    <h2>Logged in as {user.email}</h2>
                    <button onClick = {handleLogout} >Log out</button>
                    {/* Show loading if data is not fetched or is currently fetching, otherwise show data */}
                    {(typeof emailData === 'undefined') 
                    ? (
                        <p>Loading...</p>
                    ) 
                    : (
                        emailData.map((email, index) => (
                            <div key = {index} className = 'Container-items'>
                                <p style={{fontWeight: 'bold'}} >{email.title}</p>
                                <p>{email.body}</p>
                                <p style = {{border: '1px solid gray', width: '130px', borderRadius: '5px', textAlign: 'center'}} >{email.tags}</p>
                            </div>
                        ))
                    )}
                </>
            }

        </div>
    )
}

export default Emails