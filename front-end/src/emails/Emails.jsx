import React, { Fragment, useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import { ArrowClockwise, Trash3, X } from 'react-bootstrap-icons'
import { Box, Button, Checkbox, Fade, IconButton, List, Snackbar } from '@mui/material'

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
import ExerciseModal from '../customComponents/ExerciseModal'

const Emails = () => {
    const [selectedEmails, setSelectedEmails] = useState([])
    const [unimportantEmails, setUnimportantEmails] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [loading, setLoading] = useState(false)
    const [moved, setMoved] = useState(false)

    const [openSnackbarMed, setOpenSnackbarMed] = useState(false)
    const [openSnackbarHigh, setOpenSnackbarHigh] = useState(true)
    
    const [openExercise, setOpenExercise] = useState(false)
    const [openConfirmation, setOpenConfirmation] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    
    // Outlet context to open/close sidebar
    const { openSidebar } = useOutletContext(true)
    // Selected page from the sidebar
    const { type } = useParams()

    // User object and stressed state
    const { user } = useAuth()
    const { stressLevel } = useEmotion()


    // Email services
    const getEmailsService = useApi(EMAIL_API_URLS.getEmailFromType)
    const deleteEmailService = useApi(EMAIL_API_URLS.deleteEmail)
    const moveEmailsToTrashService = useApi(EMAIL_API_URLS.moveEmailsToTrash)
    const getUnimportantEmailsService = useApi(EMAIL_API_URLS.getUnImportantEmails)
    const archiveEmailsService = useApi(EMAIL_API_URLS.archiveEmails)
    const unArchiveEmailsService = useApi(EMAIL_API_URLS.unArchiveEmails)

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

    useEffect(() => {
        /**
         * Fetch emails not marked important 
         */
        const fetchUnimportantEmails = async () => {
            const emails = await getUnimportantEmailsService.call({}, "", user.id)
            setUnimportantEmails(emails)
        }

        fetchUnimportantEmails()
    }, [])

    useEffect(() => {
        if (!moved) restructureEmails()
        if (stressLevel === "high") setOpenSnackbarHigh(true)
    }, [unimportantEmails, stressLevel])

    /**
     * Close the snackbar when X is pressed
     */
    const closeSnackbar = () => {
        setOpenSnackbarMed(false) 
        setOpenSnackbarHigh(false)
    }

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
            setRefresh((prev) => !prev)
        }
        else {
            // setOpenConfirmation(true)
            // if (confirmDelete) {
            // Move emails to trash folder
            moveEmailsToTrashService.call(selectedEmails)
            setSelectedEmails([])
            setRefresh((prev) => !prev)
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

    /**
     * Unarchive emails from the archives page when button is pressed
     */
    const unarchive = async () => {
        const emails = unimportantEmails?.map(email => email.id)
        await unArchiveEmailsService.call(emails)
        setRefresh((prev) => !prev)
        
    }

    /**
     * Move unimportant emails to the archives folder when stress level is medium. 
     * Bring emails back to inbox when stress level is normal.
     */
    const restructureEmails = async () => {
        const emails = unimportantEmails?.map(email => email.id)

        if (unimportantEmails?.map(email => email.folder === "inbox") && stressLevel === "medium") {
            await archiveEmailsService.call(emails)
            setOpenSnackbarMed(true)
            setMoved(true)
            setRefresh((prev) => !prev)
        }
        if (unimportantEmails?.map(email => email.folder === "archives") && stressLevel === "normal") {
            await unArchiveEmailsService.call(emails)
            setMoved(false)
        }
    }

    /**
     * Open breathing exercise modal and close the snackbar
     */
    const openBreathingExercise = () => {
        setOpenExercise(true)
        setOpenSnackbarHigh(false)
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
                        boxShadow: `0px 0px 10px 2px ${
                            stressLevel === "low" 
                            ? Colours.lowStressShadow 
                            : stressLevel === "medium"
                            ? Colours.mediumStressShadow
                            : stressLevel === "high" 
                            ? Colours.highStressShadow
                            : Colours.normalShadow
                        }`, 
                        transition: 'box-shadow 0.7s ease-in',
                        borderTopLeftRadius: 25,
                        borderTopRightRadius: 25,
                        background: Colours.container,
                    } 
                    : {
                        marginLeft: 30, 
                        marginRight: 30,
                        width: "calc(100% - 60px)", 
                        height: "calc(100vh - 70px)",
                        boxShadow: `0px 0px 10px 2px ${
                            stressLevel === "low" 
                            ? Colours.lowStressShadow 
                            : stressLevel === "medium"
                            ? Colours.mediumStressShadow
                            : stressLevel === "high" 
                            ? Colours.highStressShadow
                            : Colours.normalShadow
                        }`, 
                        transition: 'box-shadow 0.7s ease-in',
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

                    { type === "archives" && getEmailsService?.response?.length
                        ? <Button
                            sx = {{ color: "#000", textTransform: "none", fontSize: 15 }}
                            onClick = { unarchive }
                        >
                            Move back to Inbox?
                        </Button>
                        : <></>
                    }

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

                {/* Snackbar with message to show when emails are moved to Archives */}
                { stressLevel === "medium"
                    ? <Snackbar
                        open = { openSnackbarMed }
                        autoHideDuration = { 5000 }
                        onClose = { closeSnackbar }
                        slot = {{ transition: <Fade/> }}
                        anchorOrigin = {{ vertical: 'bottom', horizontal: 'right' }}
                        action = {
                            <IconButton onClick = { closeSnackbar } aria-label = "close">
                                <X color = "#FFF" />
                            </IconButton>
                        }
                        message = "Un-important emails moved to the Archives folder."
                    />
                    : stressLevel === "high"
                        ? <Snackbar
                            open = { openSnackbarHigh }
                            autoHideDuration = { 7000 }
                            onClose = { closeSnackbar }
                            slot = {{ transition: <Fade/> }}
                            anchorOrigin = {{ vertical: "bottom", horizontal: "right" }}
                            action = {
                                <Fragment>
                                    <Button 
                                        sx = {{ textTransform: "none", fontSize: 14, color: Colours.selectedType }}
                                        onClick = { openBreathingExercise }
                                    >
                                        Try a breathing exercise
                                    </Button>
                                    <IconButton onClick = { closeSnackbar } aria-label = "close">
                                        <X color = "#FFF" />
                                    </IconButton>
                                </Fragment>
                            }
                            message = "High stress levels detected!"
                        />
                        : <></>
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

            <ExerciseModal 
                openExercise = {openExercise}
                setOpenExercise = {setOpenExercise}
            />
        </Box>
    )
}

export default Emails