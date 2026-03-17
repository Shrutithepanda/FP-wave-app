import { Fragment, useEffect, useState } from "react"
import { Box, Button, Fade, IconButton, Snackbar, styled, Tooltip, Typography } from "@mui/material"
import { ArrowClockwise, ArrowLeft, Bookmark, BookmarkFill, PersonCircle, Trash3, X } from "react-bootstrap-icons"
import { useLocation, useOutletContext } from "react-router-dom"

import useApi from "../hooks/useApi"
import { EMAIL_API_URLS } from "../services/api.urls"
import { useEmotion } from "../hooks/EmotionProvider"
import { Colours } from "../constants/colours"
import ExerciseModal from "../customComponents/ExerciseModal"

// Styled MUI components
const IconWrapper = styled(Box) ({
    padding: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
})

const Subject = styled(Typography) ({
    fontSize: 22,
    margin: "10px 0 20px 65px",
    display: "flex",
    alignItems: "center"
})

const Indicator = styled(Box) ({
    fontSize: 13,
    backgroundColor: Colours.selectedType,
    color: "#222",
    padding: "2px 4px",
    marginLeft: 6,
    borderRadius: 5,
    alignSelf: "center"
})

const Container = styled(Box) ({
    marginLeft: 15,
    width: "100%",
    "& > div": {
        display: "flex",
        "& > p > span": {
            fontSize: 15,
            color: "#4F4E4E"
        }
    }
})

const Date = styled(Box) ({
    margin: "0 50px 0 auto",
    color: "#4F4E4E"
})

/**
 * @returns a view page for an email
 */
const ViewEmail = () => {
    // Outlet context to open/close sidebar
    const { openSidebar } = useOutletContext()

    // Stressed state from useEmotion hook
    const { stressLevel } = useEmotion()

    const [openSnackbarHigh, setOpenSnackbarHigh] = useState(false)
    const [openExercise, setOpenExercise] = useState(false)

    // Get the email from the router's state
    const { state } = useLocation()
    const { email } = state

    // Initialise the services
    const moveEmailsToTrashService = useApi(EMAIL_API_URLS.moveEmailsToTrash)
    const toggleHighPriorityService = useApi(EMAIL_API_URLS.toggleHighPriorityEmails)

    // Open snackbar at high stress level
    useEffect(() => {
        if (stressLevel === "high") setOpenSnackbarHigh(true)
    }, [stressLevel])
    
    /**
     * Close the snackbar when X is pressed
     */
    const closeSnackbar = () => {
        setOpenSnackbarHigh(false)
    }
    
    /**
     * Move email to trash
     */
    const deleteEmail = () => {
        moveEmailsToTrashService.call([email.id])
        window.history.back()
    }

    /**
     * Mark the email as important or un-important
     */
    const toggleHighPriorityMails = () => {
        toggleHighPriorityService.call({ id: email.id, priority: !email.priority })
        window.location.reload()
    }

    /**
     * Refresh page
     */
    const handleRefresh = () => {
        window.location.reload()
    }

    /**
     * Open breathing exercise dialog and close the snackbar
     */
    const openBreathingExercise = () => {
        setOpenExercise(true)
        setOpenSnackbarHigh(false)
    }

    return (
        <Box style = {
                openSidebar 
                ? {
                    marginLeft: 158, 
                    marginRight: 30,
                    width: "calc(100% - 188px)",  // -188 px for sidebar's width + space for shadow
                    height: "calc(100vh - 70px)", // -70px for header's height,
                    // Adaptive shadow colours for different stress levels
                    boxShadow: `0px 0px 10px 2px ${
                        stressLevel === "low" 
                        ? Colours.lowStressShadow 
                        : stressLevel === "medium"
                        ? Colours.mediumStressShadow
                        : stressLevel === "high" 
                        ? Colours.highStressShadow
                        : Colours.normalShadow
                    }`, 
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    background: Colours.container
                } 
                : {
                    marginLeft: 30, 
                    marginRight: 30,
                    width: "calc(100% - 60px)",
                    height: "calc(100vh - 70px)",
                    // Adaptive shadow colours for different stress levels
                    boxShadow: `0px 0px 10px 2px ${
                        stressLevel === "low" 
                        ? Colours.lowStressShadow 
                        : stressLevel === "medium"
                        ? Colours.mediumStressShadow
                        : stressLevel === "high" 
                        ? Colours.highStressShadow
                        : Colours.normalShadow
                    }`, 
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    background: Colours.container
                }
            } 
        >
            {/* Back and refresh buttons */}
            <IconWrapper>
                <Tooltip title = "Back">
                    <IconButton onClick = { () => window.history.back() }>
                        <ArrowLeft size = {20} aria-label = "back" />
                    </IconButton>
                </Tooltip>
                    
                <Tooltip title = "Refresh">
                    <span style = {{ marginLeft: "auto", marginRight: 15 }}>
                        <IconButton onClick = { handleRefresh }>
                            <ArrowClockwise size = {20} color = "#000" aria-label = "refresh" />
                        </IconButton>
                    </span>
                </Tooltip>
            </IconWrapper>

            <main>
                {/* Email title, folder name, bookmark button, and delete button */}
                <Subject>
                    {email.subject}
                    
                    <Indicator component = "span">{email.folder}</Indicator>
                    
                    { email.priority
                        ? <IconButton style = {{ marginLeft: 10 }} onClick = { toggleHighPriorityMails }>
                            <BookmarkFill size = {20} color = { Colours.bookmark } aria-label = "bookmark" />
                        </IconButton>
                        : <IconButton style = {{ marginLeft: 10 }} onClick = { toggleHighPriorityMails }>
                            <Bookmark size = {20} aria-label = "bookmark" />
                        </IconButton>
                    }

                    <Tooltip title = "Delete">
                        <span style = {{ marginLeft: "auto", marginRight: 40 }}>
                            <IconButton onClick = { deleteEmail }>
                                <Trash3 size = {20} color = { Colours.error } aria-label = "delete" />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Subject>

                {/* Sender's email, date received, and email body */}
                <Box style = {{ display: "flex" }}>
                    {/* Profile picture */}
                    <PersonCircle size = {30} color = "#79747E" style = {{ margin: "8px 5px 0 20px" }}/>
                    
                    <Container>
                        <Box sx = {{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <Typography sx = {{ marginTop: 10, fontWeight: "bold" }}>
                                {email.name}
                                <Box component = "span" sx = {{ fontWeight: "normal" }}>&nbsp; - &nbsp;{email.send_to}</Box>
                            </Typography>

                            <Date>
                                { (new window.Date(email.created_at)).getDate() }&nbsp;
                                { (new window.Date(email.created_at)).toLocaleDateString("default", { month: "short" }) }&nbsp;
                                { (new window.Date(email.created_at)).getFullYear() },&nbsp;
                                { (new window.Date(email.created_at)).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) }
                            </Date>
                        </Box>
                        <Typography sx = {{ marginTop: 20, marginRight: 30 }}>{email.email_body}</Typography>
                    </Container>
                </Box>
            </main>

            {/* Snackbar, shown when high stress levels are detected */}
            { stressLevel === "high"
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
                                <X color = "#FFF" aria-label = "close" />
                            </IconButton>
                        </Fragment>
                    }
                    message = "High stress levels detected! Take a short break or"
                />
            : <></>
            }

            {/* Breathing exercise dialog */}
            <ExerciseModal 
                openExercise = { openExercise }
                setOpenExercise = { setOpenExercise }
            />
        </Box>
    )
}

export default ViewEmail