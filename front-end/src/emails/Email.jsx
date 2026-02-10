import { Box, Checkbox, colors, IconButton, styled, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { routes } from "../constants/routes"
import { Bookmark, BookmarkFill, CircleFill } from "react-bootstrap-icons"
import { EMAIL_API_URLS } from "../services/api.urls"
import useApi from "../hooks/useApi"
import ViewEmail from "./ViewEmail"
import { Colours } from "../constants/colours"

const Wrapper = styled(Box) ({
    display: "flex",
    alignItems: "center",
    padding: "0 0 0 10px",
    marginBottom: 3,
    // backgroundColor: "#F2F6FC",
    cursor: "pointer",
    "& > div": {
        display: "flex",
        width: "100%",
        flexGrow: 1,
        // flexWrap: "wrap",
        "& > p": {
            fontSize: 15,
            // overflow: "hidden", 
            // whiteSpace: "nowrap", 
            // textOverflow: "ellipsis"
        }
    }
})

const Indicator = styled(Typography) ({
    fontSize: "12px !important",
    background: "#DDD",
    color: "#222",
    padding: "0 4px",
    borderRadius: 5,
    marginRight: 6,
    height: 20
})

const Date = styled(Typography) ({
    marginLeft: "auto",
    marginRight: 20,
    fontSize: "12px !important",
    color: "#404142"
})

const StyledText = styled(Box) ({
    display: "flex", 
    flexDirection: "row", 
    // overflow: "hidden", 
    // width: "90%", whiteSpace: "nowrap", textOverflow: "ellipsis", 
    // background: "pink"
    // color: "#424242"
})

const Email = ({ email, selectedEmails, setSelectedEmails, type, setRefresh }) => {
    const navigate = useNavigate()
    const toggleHighPriorityService = useApi(EMAIL_API_URLS.toggleHighPriorityEmails)
    const markAsReadService = useApi(EMAIL_API_URLS.markAsRead)

    const toggleHighPriorityMails = () => {
        toggleHighPriorityService.call({ id: email.id, priority: !email.priority, type: type })
        setRefresh(prevState => !prevState)
        window.location.reload()
    }

    const markEmailAsRead = () => {
        if (!email.read) {
            markAsReadService.call({ id: email.id, read: !email.read })
        }
    }

    const onValueChange = () => {
        // If selected emails already contain this email then filter this one out of the selected emails
        if (selectedEmails.includes(email.id)) {
            setSelectedEmails(prevState => prevState.filter(id => id != email.id))
        }
        // If selected emails do not have this email, append this email to the selected emails
        else {
            setSelectedEmails(prevState => [...prevState, email.id])

        }
    }

    return (
        <Wrapper
            sx = {{ background: Colours.cardBg }}
        >
            <Checkbox 
                size = "small" 
                // checked if the id value exists in the array - selectedEmails
                checked = {selectedEmails.includes(email.id)} 
                onChange = {() => onValueChange()}
            />
            {email.priority === true
                ? <IconButton size = "small" onClick = {() => toggleHighPriorityMails()} sx = {{marginRight: 1}}>
                    <BookmarkFill size = {20} color = {Colours.bookmark} style = {{flexShrink: 0}} />
                </IconButton>
                : <IconButton size = "small" onClick = {() => toggleHighPriorityMails()} sx = {{marginRight: 1}}>
                    <Bookmark size = {20} style = {{flexShrink: 0}} />
                </IconButton>
            }

            <Box 
                onClick = {
                    // Route to ViewEmail component path
                    () => {
                        navigate(
                            routes.view_email.path, 
                            // Share the email with the component
                            {state: {email: email}}
                        )
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
                <Box sx = {{width: "100%", minWidth: 0, display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <Typography sx = {{color: email.read ? "#424242" : "black"}}>{email.send_to}</Typography>
                        <Box style = {{display: "flex", flexDirection: "row", alignItems: "center"}}>
                            { email.read 
                                ? <></>
                                : <CircleFill size = {10} color = {Colours.error} style = {{marginRight: 10}} />
                            }
                            <Date>
                                {(new window.Date(email.created_at)).getDate()}&nbsp;
                                {(new window.Date(email.created_at)).toLocaleDateString("default", {month: "short"})}, &nbsp;
                                {(new window.Date(email.created_at)).toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit"})}
                            </Date>
                        </Box>
                    </Box>

                    <StyledText
                        sx = {{
                            width: "95%",
                            minWidth: 0, 
                            overflow: "hidden",
                        }}
                    >
                        {/* <Indicator>Inbox</Indicator> */}                        
                        <Box>
                            <Typography 
                                sx = {{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    fontWeight: "normal", 
                                    color: email.read ? "#424242" : "black"
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