import React, { useEffect, useState } from 'react'
import supabase from '../supabase/supabaseClient'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'

import AppHeader from '../customComponents/AppHeader'
import Loader from '../customComponents/Loader'
import SideBar from '../customComponents/Sidebar'
import { useAuth } from '../hooks/AuthProvider'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Square, Trash3 } from 'react-bootstrap-icons'
import { Box, Checkbox, List } from '@mui/material'
import Email from './Email'
import useApi from '../hooks/useApi'
import { API_URLS } from '../services/api.urls'
import NoMails from './NoMails'
import { EMPTY_TABS } from '../constants/empty_tabs'

const Emails = () => {
    const navigate = useNavigate()
    const [emailData, setEmailData] = useState([{}])
    const [tags, setTags] = useState(null)
    const [read, setRead] = useState(null)

    const [selectedEmails, setSelectedEmails] = useState([])
    const [refresh, setRefresh] = useState(false)
    
    const [loading, setLoading] = useState(false)
    const { openSidebar } = useOutletContext(true)

    const { user, session, access_token } = useAuth()

    // console.log(session)

    const { type } = useParams()

    const getEmailsService = useApi(API_URLS.getEmailFromType)
    const moveEmailsToTrashService = useApi(API_URLS.moveEmailsToTrash)
    const deleteEmailService = useApi(API_URLS.deleteEmail)

    // How to refresh when emails are sent from the sent page, composeMail
    useEffect(() => { 
        setLoading(true)
        // Get all from the backend where the type matches, body - empty for get request
        getEmailsService.call({}, type, user.id)

        setLoading(false)
        // .then(
        //     setEmailData(getEmailsService.response)
        // )
        // fetch("/inbox")
        // .then(
        //     response => response.json()
            
        // )
        // .then(
        //     data => {
        //         setEmailData(data)
        //         // ----- Should this be somewhere else? -----
        //         for (const d of data) {
        //             // console.log(d)
        //             setTags(d.tags)
        //             setRead(d.read)
        //         }
        //     }
        // )

        // Type - Sent
        // Type - Drafts
        // Type - Archives

        // Type - Trash -> in the function later
        // For deleting by selecting all from a folder, multiple items should be moved to
        // trash folder and removed from the folder they were in

    }, [type, refresh])

    // For checkbox at the top of the container
    const selectAllEmails = (e) => {
        if (e.target.checked) {
            const emails = getEmailsService?.response?.map(email => email.id) // email._id returns an array of string of ids
            setSelectedEmails(emails)
        } 
        else {
            // Back to default value - unchecked
            setSelectedEmails([])
        }
    }

    const deleteSelectedEmails = () => {
        if (type === "trash") {
            // Delete from database
            deleteEmailService.call(selectedEmails)
        }
        else {
            setLoading(true)
            // Move emails to trash folder
            moveEmailsToTrashService.call(selectedEmails)
            setSelectedEmails([])
            setLoading(false)
        }
        setRefresh(prevState => !prevState)
    }

    return (
        <div>
            <Box style = {openSidebar ? {marginLeft: 150, width: "calc(100% - 150px)"} : {width: "100%"}}>
                <Box style = {{padding: "20px 10px 0 10px", display: "flex", alignItems: "center"}} >
                    <Checkbox size = "small" onChange = {(e) => selectAllEmails(e)} />
                    <Trash3 style = {{cursor: "pointer"}} onClick = {() => deleteSelectedEmails()} />
                </Box>
                <List>
                        {getEmailsService?.response?.map((email, index) => (
                        <Email 
                            key = {index} 
                            email = {email} 
                            type = {type}
                            selectedEmails = {selectedEmails}
                            setSelectedEmails = {setSelectedEmails}
                            setRefresh = {setRefresh}
                        />
                    ))}
                </List>
                {
                    getEmailsService?.response?.length === 0 && 
                    <NoMails
                        message = {EMPTY_TABS[type]}
                    />
                }
                {/* {loading
                    ? <Loader /> : <></>
                } */}
            </Box>
        </div>
    )
}

export default Emails