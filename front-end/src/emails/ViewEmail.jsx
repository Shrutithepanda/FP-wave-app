import { Box, IconButton, styled, Typography } from "@mui/material"
import { Arrow90degLeft, ArrowClockwise, ArrowLeft, Bookmark, BookmarkFill, CaretLeft, PersonCircle, Trash3 } from "react-bootstrap-icons"
import { useLocation, useOutletContext } from "react-router-dom"
import { useAuth } from "../hooks/AuthProvider"
import useApi from "../hooks/useApi"
import { EMAIL_API_URLS } from "../services/api.urls"
import { useEmotion } from "../hooks/EmotionProvider"
import { useEffect } from "react"
import { Colours } from "../constants/colours"

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
    // display: "flex",
    "& > div": {
        display: "flex",
        "& > p > span": {
            fontSize: 15,
            color: "#5E5E5E"
        }
    }
})

const Date = styled(Box) ({
    margin: "0 50px 0 auto",
    color: "#5E5E5E"
})

/**
 * 
 * @returns a view page for an email
 */
const ViewEmail = () => {
    // Outlet context to open/close sidebar
    const { openSidebar } = useOutletContext()

    // Stressed state from useEmotion hook
    const { stressed } = useEmotion()

    // Get the email from the router's state
    const { state } = useLocation()
    const { email } = state

    // Initialise the services
    const moveEmailsToTrashService = useApi(EMAIL_API_URLS.moveEmailsToTrash)
    const toggleHighPriorityService = useApi(EMAIL_API_URLS.toggleHighPriorityEmails)

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
        // setRefresh(prevState => !prevState)
        window.location.reload()
    }

    /**
     * Refresh page
     */
    const handleRefresh = () => {
        window.location.reload()
    }

    return (
        <Box style = {
                openSidebar 
                ? {
                    marginLeft: 158, 
                    marginRight: 30,
                    width: "calc(100% - 188px)",  // -188 px for sidebar's width + space for shadow
                    boxShadow: `2px 0px 10px 2px ${stressed ? "hsl(297, 67%, 80%)" : Colours.normalShadow}`, 
                    height: "calc(100vh - 70px)", // -70px for header's height,
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    background: Colours.container
                } 
                : {
                    marginLeft: 30, 
                    marginRight: 30,
                    width: "calc(100% - 60px)",
                    boxShadow: `2px 0px 10px 2px ${stressed ? "hsl(297, 67%, 80%)" : Colours.normalShadow}`, 
                    height: "calc(100vh - 70px)",
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    background: Colours.container
                }
            } 
        >
            {/* Back and refresh buttons */}
            <IconWrapper>
                <IconButton onClick = { () => window.history.back() }>
                    <ArrowLeft size = {20} aria-label = "back" />
                </IconButton>
                    
                <span style = {{ marginLeft: "auto", marginRight: 15 }}>
                    <IconButton onClick = { handleRefresh }>
                        <ArrowClockwise size = {20} color = "#000" aria-label = "reload" />
                    </IconButton>
                </span>
            </IconWrapper>

            {/* Email title, folder name, bookmark button, and delete button */}
            <Subject>
                {email.subject}
                
                <Indicator component = "span">{email.folder}</Indicator>
                
                { email.priority
                    ? <IconButton style = {{ marginLeft: 10 }} onClick = { toggleHighPriorityMails }>
                        <BookmarkFill size = {20} color = {Colours.bookmark} />
                    </IconButton>
                    : <IconButton style = {{ marginLeft: 10 }} onClick = { toggleHighPriorityMails }>
                        <Bookmark size = {20} />
                    </IconButton>
                }
                <span style = {{ marginLeft: "auto", marginRight: 40 }}>
                    <IconButton onClick = { deleteEmail }>
                        <Trash3 size = {20} color = { Colours.error } />
                    </IconButton>
                </span>
            </Subject>

            {/* Sender's email, date received, and email body */}
            <Box style = {{ display: "flex" }}>
                <PersonCircle size = {30} color = "#79747E" style = {{ margin: "8px 5px 0 20px" }}/>
                <Container>
                    <Box style = {{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <Typography style = {{ marginTop: 10, fontWeight: "bold" }}>
                            {email.name}
                            <Box component = "span" style = {{ fontWeight: "normal" }}>&nbsp; - &nbsp;{email.send_to}</Box>
                        </Typography>

                        <Date>
                            { (new window.Date(email.created_at)).getDate() }&nbsp;
                            { (new window.Date(email.created_at)).toLocaleDateString("default", { month: "short" }) }&nbsp;
                            { (new window.Date(email.created_at)).getFullYear() },&nbsp;
                            { (new window.Date(email.created_at)).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) }
                        </Date>
                    </Box>
                    <Typography style = {{ marginTop: 20, marginRight: 30 }}>{email.email_body}</Typography>
                </Container>
            </Box>
        </Box>
    )
}

export default ViewEmail