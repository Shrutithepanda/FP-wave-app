import React, { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import { ArrowClockwise, Trash3, XLg } from 'react-bootstrap-icons'
import { Box, Checkbox, IconButton, List } from '@mui/material'

import Email from './Email'
import NoContent from '../customComponents/NoContent'

import useApi from '../hooks/useApi'
import { useAuth } from '../hooks/AuthProvider'
import { useEmotion } from '../hooks/EmotionProvider'

import Loader from '../customComponents/Loader'
import { EMAIL_API_URLS } from '../services/api.urls'
import { EMPTY_TABS } from '../constants/empty_tabs'
import { Colours } from '../constants/colours'
import ConfirmationModal from '../customComponents/ConfirmationModal'

const Emails = () => {
    const [selectedEmails, setSelectedEmails] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [loading, setLoading] = useState(false)

    const [openConfirmation, setOpenConfirmation] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    
    // Outlet context to open/close sidebar
    const { openSidebar } = useOutletContext(true)
    // Selected page from the sidebar
    const { type } = useParams()

    // User object and stressed state
    const { user } = useAuth()
    const { stressed } = useEmotion()


    // Email services
    const getEmailsService = useApi(EMAIL_API_URLS.getEmailFromType)
    const moveEmailsToTrashService = useApi(EMAIL_API_URLS.moveEmailsToTrash)
    const deleteEmailService = useApi(EMAIL_API_URLS.deleteEmail)

    useEffect(() => { 
        /**
         * Get emails for the selected page type from the sidebar
         */
        const fetchData = async () => {
            // Get the loading state from useApi too 
            setLoading(true)
            // Request all emails from the backend where the type matches, body - empty for get request
            await getEmailsService.call({}, type, user.id)
            setLoading(false)

        }
        fetchData()
    }, [type, refresh])

    /**
     * Check and uncheck all emails using the checkbox at the top
     * @param {*} e 
     */
    const selectAllEmails = (e) => {
        if (e.target.checked) {
            // Get ids of the selected emails and assign them to selectedEmails
            const emails = getEmailsService?.response?.map(email => email.id) 
            setSelectedEmails(emails)
        } 
        else {
            // Back to default value - unchecked
            setSelectedEmails([])
        }
    }

    /**
     * Move selected emails to the trash folder or delete them from the database if selected page
     * type is Trash
     */
    const deleteSelectedEmails = () => {
        if (type === "trash") {
            // Delete from database and reload
            deleteEmailService.call(selectedEmails)
            window.location.reload()
        }
        else {
            // setOpenConfirmation(true)
            // if (confirmDelete) {
            // Move emails to trash folder
            moveEmailsToTrashService.call(selectedEmails)
            setSelectedEmails([])
            window.location.reload()
                // console.log(confirmDelete)
            // }
        }
        // setRefresh(prevState => !prevState)
    }

    /**
     * Refresh page
     */
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
                        width: "calc(100% - 188px)",  // -188 px for sidebar's width + space for shadow
                        height: "calc(100vh - 70px)", // -70px for header's height,
                        boxShadow: `2px 0px 10px 2px ${stressed ? "hsl(297, 67%, 80%)" : Colours.normalShadow}`, 
                        transition: 'box-shadow 0.5s ease-in',
                        borderTopLeftRadius: 25,
                        borderTopRightRadius: 25,
                        background: Colours.container,
                    } 
                    : {
                        marginLeft: 30, 
                        marginRight: 30,
                        width: "calc(100% - 60px)", 
                        height: "calc(100vh - 70px)",
                        boxShadow: `2px 0px 10px 2px ${stressed ? "hsl(297, 67%, 80%)" : Colours.normalShadow}`, 
                        transition: 'box-shadow 0.5s ease-in',
                        borderTopLeftRadius: 25,
                        borderTopRightRadius: 25,
                        background: Colours.container
                    }
                }
            >
                {/* Checkbox for selecting all emails, delete button and refresh button */}
                <Box style = {{ padding: "20px 10px 0 10px", display: "flex", alignItems: "center" }} >
                    <Checkbox size = "small" onChange = { (e) => selectAllEmails(e) }/>

                    <IconButton size = "small" onClick = { deleteSelectedEmails }>
                        <Trash3 color = "#000" />
                    </IconButton>

                    <span style = {{ marginLeft: "auto", marginRight: 20 }}>
                        <IconButton size = "small" onClick = { handleRefresh } >
                            <ArrowClockwise color = "#000" />
                        </IconButton>
                    </span>
                </Box>

                {/* If response is being fetched, show the loader otherwise emails */}
                {loading 
                    ? <Box sx = {{ margin: "auto auto", flexGrow: 1 }}>
                        <Loader/> 
                    </Box>
                    : <List>
                        { getEmailsService?.response?.map((email, index) => (
                            <Email 
                                key = { index } 
                                email = { email } 
                                type = { type }
                                selectedEmails = { selectedEmails }
                                setSelectedEmails = { setSelectedEmails }
                                setRefresh = { setRefresh }
                            />
                        ))}
                    </List>
                }
                
                {/* Show message if no content is returned by the service */}
                { getEmailsService?.response?.length === 0 && 
                    <NoContent message = { EMPTY_TABS[type] }/>
                }
            </Box>

            {/* <ConfirmationModal 
                openConfirmation = {openConfirmation} 
                setOpenConfirmation = {setOpenConfirmation} 
                confirm = {confirmDelete} 
                setConfirm = {setConfirmDelete}
            /> */}
        </Box>
    )
}

export default Emails