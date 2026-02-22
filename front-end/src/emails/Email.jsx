import { Box, Checkbox, IconButton, styled, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { Bookmark, BookmarkFill, CircleFill } from "react-bootstrap-icons"

import { EMAIL_API_URLS } from "../services/api.urls"
import { routes } from "../constants/routes"
import { Colours } from "../constants/colours"
import useApi from "../hooks/useApi"

const Wrapper = styled(Box) ({
    display: "flex",
    alignItems: "center",
    padding: "0 0 0 10px",
    marginBottom: 3,
    cursor: "pointer",
    "& > div": {
        display: "flex",
        width: "100%",
        flexGrow: 1,
        "& > p": {
            fontSize: 15,
        }
    }
})

const Date = styled(Typography) ({
    marginLeft: "auto",
    marginRight: 20,
    fontSize: "12px !important",
    color: "#404142"
})

const StyledText = styled(Box) ({
    display: "flex", 
    flexDirection: "row"
})

/**
 * An email component
 * @param {object} email 
 * @param {array} selectedEmails 
 * @param {function} setSelectedEmails 
 * @param {string} type 
 * @param {boolean} setRefresh 
 * @returns a single Email component with details, to show for the Emails tab
 */
const Email = ({ email, selectedEmails, setSelectedEmails, type, setRefresh }) => {
    const navigate = useNavigate()

    // Initialise toggle important emails service and mark as read service
    const toggleHighPriorityService = useApi(EMAIL_API_URLS.toggleHighPriorityEmails)
    const markAsReadService = useApi(EMAIL_API_URLS.markAsRead)

    /**
     * Mark emails important/unimportant when bookmark icon is clicked
     */
    const toggleHighPriorityMails = () => {
        toggleHighPriorityService.call({ id: email.id, priority: !email.priority, type: type })
        setRefresh(prevState => !prevState)
        window.location.reload()
    }

    /**
     * If an email is not read and is opened, mark it as read
     */
    const markEmailAsRead = () => {
        if (!email.read) {
            markAsReadService.call({ id: email.id, read: !email.read })
        }
    }

    /**
     * Select and deselect an email
     */
    const onValueChange = () => {
        if (selectedEmails.includes(email.id)) {
            // If the selected emails already contain this email then filter this one out of the selected emails
            setSelectedEmails(prevState => prevState.filter(id => id != email.id))
        }
        else {
            // If the selected emails do not have this email, append this email to the selected emails
            setSelectedEmails(prevState => [...prevState, email.id])

        }
    }

    return (
        <Wrapper
            sx = {{ background: Colours.cardBg }}
        >
            {/* Checkbox to mark email important or un-important */}
            <Checkbox 
                size = "small" 
                // checked if the id value exists in the array - selectedEmails
                checked = { selectedEmails.includes(email.id) } 
                onChange = { onValueChange }
            />

            {/* Bookmark icon - filled if email is marked important */}
            {email.priority === true
                ? <IconButton 
                    size = "small" 
                    onClick = { toggleHighPriorityMails } 
                    sx = {{ marginRight: 1 }}
                >
                    <BookmarkFill size = {20} color = { Colours.bookmark } style = {{ flexShrink: 0 }} />
                </IconButton>
                : <IconButton 
                    size = "small" 
                    onClick = { toggleHighPriorityMails } 
                    sx = {{ marginRight: 1 }}
                >
                    <Bookmark size = {20} style = {{ flexShrink: 0 }} />
                </IconButton>
            }

            {/* Email info. Navigates to ViewEmail page on click. */}
            <Box 
                onClick = {
                    // Route to ViewEmail component path
                    () => {
                        navigate(
                            routes.view_email.path, 
                            // Share the email with the component
                            { state: { email: email } }
                        )
                        // Mark email as read if it is unread
                        markEmailAsRead()
                    }
                }
                sx = {{
                    width: "100%", 
                    minWidth: 0, 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "flex-start", 
                    justifyContent: "space-between", 
                    flexGrow: 1, 
                    paddingTop: 1, 
                    paddingBottom: 1
                }}
            >
                {/* Email address, indicator and date received */}
                <Box 
                    sx = {{ width: "100%", minWidth: 0, display: "flex", flexDirection: "row", justifyContent: "space-between" }}
                >
                        <Typography 
                            sx = {{ color: email.read ? "#424242" : "#000" }}
                        >
                            {email.send_to}
                        </Typography>

                        <Box 
                            style = {{ display: "flex", flexDirection: "row", alignItems: "center" }}
                        >
                            { email.read 
                                ? <></>
                                : <CircleFill 
                                    size = {10} 
                                    color = { Colours.error } 
                                    style = {{ marginRight: 10 }} 
                                />
                            }
                            <Date>
                                { (new window.Date(email.created_at)).getDate() }&nbsp;
                                { (new window.Date(email.created_at)).toLocaleDateString("default", { month: "short" }) }, &nbsp;
                                { (new window.Date(email.created_at)).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) }
                            </Date>
                        </Box>
                    </Box>

                    {/* Email title and body */}
                    <StyledText
                        sx = {{
                            width: "95%",
                            minWidth: 0, 
                            overflow: "hidden",
                        }}
                    >
                        <Box>
                            <Typography 
                                sx = {{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    fontWeight: "normal", 
                                    color: email.read ? "#424242" : "#000"
                                }}
                            >
                                {email.subject} {email.email_body && "-"} {email.email_body}
                            </Typography>                            
                        </Box>
                    </StyledText>
            </Box>
        </Wrapper>
    )
}

export default Email