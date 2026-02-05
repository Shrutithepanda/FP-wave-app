import React, { useEffect, useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { ArrowClockwise, Trash3 } from 'react-bootstrap-icons'
import { Box, Checkbox, IconButton, List } from '@mui/material'

import Email from './Email'
import NoMails from './NoMails'

import useApi from '../hooks/useApi'
import { useAuth } from '../hooks/AuthProvider'
import { useEmotion } from '../hooks/EmotionProvider'

import { EMAIL_API_URLS } from '../services/api.urls'
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
    const { type } = useParams()

    const { user, session, access_token } = useAuth()
    const { stressed } = useEmotion()

    // console.log(session)

    const getEmailsService = useApi(EMAIL_API_URLS.getEmailFromType)
    const moveEmailsToTrashService = useApi(EMAIL_API_URLS.moveEmailsToTrash)
    const deleteEmailService = useApi(EMAIL_API_URLS.deleteEmail)

    // How to refresh when emails are sent from the sent page, composeMail
    useEffect(() => { 
        setLoading(true)
        // Get all from the backend where the type matches, body - empty for get request
        getEmailsService.call({}, type, user.id)

        setLoading(false)
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

    const handleRefresh = () => {
        window.location.reload()
    }

    return (
        <Box>
            <Box style = {
                    openSidebar 
                    ? {
                        marginLeft: 158, 
                        marginRight: 30,
                        width: "calc(100% - 188px)",  // -158 px for sidebar's width + space for shadow, marginLeft prev. -> 150
                        height: "calc(100vh - 70px)", // -70px for header's height,
                        boxShadow: `2px 0px 10px 2px ${stressed ? "hsl(297, 67%, 80%)" : "hsl(239, 78%, 86%)"}`, 
                        transition: 'box-shadow 0.5s ease-in',
                        borderTopLeftRadius: 25,
                        borderTopRightRadius: 25,
                        background: "#F9F9F9",
                    } 
                    : {
                        marginLeft: 30, 
                        marginRight: 30,
                        width: "calc(100% - 60px)", 
                        height: "calc(100vh - 70px)",
                        boxShadow: `2px 0px 10px 2px ${stressed ? "hsl(297, 67%, 80%)" : "hsl(239, 78%, 86%)"}`, 
                        transition: 'box-shadow 0.5s ease-in',
                        borderTopLeftRadius: 25,
                        borderTopRightRadius: 25,
                        background: "#F9F9F9"
                    }
                }
            >
                <Box style = {{padding: "20px 10px 0 10px", display: "flex", alignItems: "center"}} >
                    <Checkbox size = "small" onChange = {(e) => selectAllEmails(e)} />
                    <IconButton size = "small" onClick = {() => deleteSelectedEmails()}>
                        <Trash3 color = "black" />
                    </IconButton>
                    <span style = {{marginLeft: "auto", marginRight: 20}}>
                        <IconButton size = "small" onClick = {handleRefresh} >
                            <ArrowClockwise color = "black" />
                        </IconButton>
                    </span>
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
            </Box>
        </Box>
    )
}

export default Emails