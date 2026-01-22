import { Box, Checkbox, styled, Typography } from "@mui/material"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { routes } from "../constants/routes"
import { Bookmark, BookmarkFill } from "react-bootstrap-icons"
import { API_URLS } from "../services/api.urls"
import { useState } from "react"
import useApi from "../hooks/useApi"

const Wrapper = styled(Box) ({
    display: "flex",
    alignItems: "center",
    padding: "0 0 0 10px",
    backgroundColor: "#F2F6FC",
    cursor: "pointer",
    "& > div": {
        display: "flex",
        width: "100%",
        "& > p": {
            fontSize: 15
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
    color: "#5F6368"
})

// 🎯 Refresh screen when sent is pressed too
const Email = ({ email, selectedEmails, setSelectedEmails, type, setRefresh }) => {
    const navigate = useNavigate()

    const toggleHighPriorityService = useApi(API_URLS.toggleHighPriorityEmails)

    const toggleHighPriorityMails = () => {
        toggleHighPriorityService.call({ id: email.id, priority: !email.priority })
        setRefresh(prevState => !prevState)
        window.location.reload()
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
        <Wrapper>
            <Checkbox 
                size = "small" 
                style = {{marginRight: 10}} 
                // checked if the id value exists in the array - selectedEmails
                checked = {selectedEmails.includes(email.id)} 
                onChange = {() => onValueChange()}
            />
            {email.priority === true
                ? <BookmarkFill size = {20} color = "#fd8150" style = {{marginRight: 10, cursor: "pointer"}} onClick = {() => toggleHighPriorityMails()} />
                : <Bookmark size = {20} style = {{marginRight: 10, cursor: "pointer"}} onClick = {() => toggleHighPriorityMails()} />
            }

            <Box 
                onClick = {
                    // Route to ViewEmail component path
                    () => navigate(routes.view.path, 
                        // Share the email with the component
                        {state: {email: email}}
                    )
                }
            >
                <Box style = {{display: "flex", flexDirection: "row", overflow: "hidden", alignItems: "center", justifyContent: "space-between", flexGrow: 1}}>
                    <Box style = {{display: "flex", flexDirection: "row", overflow: "hidden"}}>
                        <Typography style = {{width: 200, overflow: "hidden"}} >{email.send_to}</Typography>
                        {/* <Indicator>Inbox</Indicator> */}
                        {/* <Typography style = {{width: {sm: 200, md: 700, lg: 900}, overflow: "hidden", textWrap: "nowrap"}}>{email.subject} {email.email_body && "-"} {email.email_body}</Typography> */}
                        <Typography style = {{width: 900, overflow: "hidden", textWrap: "nowrap"}}>{email.subject} {email.email_body && "-"} {email.email_body}</Typography>
                    </Box>
                    <Date>
                        {(new window.Date(email.created_at)).getDate()}&nbsp;
                        {(new window.Date(email.created_at)).toLocaleDateString("default", {month: "short"})}
                    </Date>
                </Box>
            </Box>
        </Wrapper>
    )
}

export default Email