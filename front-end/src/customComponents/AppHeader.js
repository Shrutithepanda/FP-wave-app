import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * 
 * @returns a `Header` component with contents: __, __, Emails/Tasks buttons
 */
const AppHeader = () => {
    const navigate = useNavigate()
    
    return (
        <header className = "App-header">
            {/* <Header /> */}
            <button 
                // className = {showEmails ? "Active-btn Change-tab-btns" : "Change-tab-btns"} 
                onClick = {() => {navigate("/")}} 
            >
                Emails
            </button>

            <button 
                // className = {showTasks ? "Active-btn Change-tab-btns" : "Change-tab-btns"} 
                onClick = {() => {navigate("/tasks")}} 
            >
                Tasks
            </button>
        </header>
    )
}

export default AppHeader