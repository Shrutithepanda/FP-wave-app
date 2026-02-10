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

const ViewEmail = () => {
    const { openSidebar } = useOutletContext()

    const { stressed } = useEmotion()

    // Extract the email from the router's state
    const { state } = useLocation()
    const { email } = state

    const moveEmailsToTrashService = useApi(EMAIL_API_URLS.moveEmailsToTrash)
    const toggleHighPriorityService = useApi(EMAIL_API_URLS.toggleHighPriorityEmails)

    const deleteEmail = () => {
        moveEmailsToTrashService.call([email.id])
        window.history.back()
    }

    const toggleHighPriorityMails = () => {
        toggleHighPriorityService.call({ id: email.id, priority: !email.priority })
        // setRefresh(prevState => !prevState)
        window.location.reload()
    }

    const handleRefresh = () => {
        window.location.reload()
    }

    return (
        <Box style = {
                openSidebar 
                ? {
                    marginLeft: 158, 
                    marginRight: 30,
                    width: "calc(100% - 188px)",  // -158 px for sidebar's width + space for shadow, marginLeft prev. -> 150
                    boxShadow: `2px 0px 10px 2px ${stressed ? "lightgreen" : Colours.normalShadow}`, 
                    height: "calc(100vh - 70px)", // -70px for header's height,
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    background: "#F9F9F9"
                } 
                : {
                    marginLeft: 30, 
                    marginRight: 30,
                    width: "calc(100% - 60px)",
                    boxShadow: `2px 0px 10px 2px ${stressed ? "lightgreen" : Colours.normalShadow}`, 
                    height: "calc(100vh - 70px)",
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    background: "#F9F9F9"
                }
            } 
        >
            <IconWrapper>
                <IconButton onClick = {() => window.history.back()}>
                    <ArrowLeft size = {20} aria-label = "back" />
                </IconButton>
                    
                <span style = {{marginLeft: "auto", marginRight: 15}}>
                    <IconButton onClick = {handleRefresh}>
                        <ArrowClockwise size = {20} color = "black" aria-label = "reload" />
                    </IconButton>
                </span>
            </IconWrapper>

            <Subject>
                {email.subject}
                
                <Indicator component = "span" >{email.folder}</Indicator>
                
                {email.priority === true
                    ? <IconButton style = {{marginLeft: 10}} onClick = {() => toggleHighPriorityMails()}>
                        <BookmarkFill size = {20} color = {Colours.bookmark} />
                    </IconButton>
                    : <IconButton style = {{marginLeft: 10}} onClick = {() => toggleHighPriorityMails()}>
                        <Bookmark size = {20} />
                    </IconButton>
                }
                <span style = {{marginLeft: "auto", marginRight: 40}}>
                    <IconButton onClick = {() => deleteEmail()}>
                        <Trash3 size = {20} color = {Colours.error} />
                    </IconButton>
                </span>
            </Subject>

            <Box style = {{display: "flex"}} >
                <PersonCircle size = {30} color = "#79747E" style = {{margin: "8px 5px 0 20px"}} />
                <Container>
                    <Box style = {{display: "flex", flexDirection: "row", alignItems: "center"}}>
                        <Typography style = {{marginTop: 10, fontWeight: "bold"}} >
                            {email.name}
                            <Box component = "span" style = {{fontWeight: "normal"}}>&nbsp; - &nbsp;{email.send_to}</Box>
                            {/* <Box component = "span" style = {{fontWeight: "normal"}}>&nbsp;&#60;{email.send_to}&#62;</Box> */}
                        </Typography>
                        <Date>
                            {(new window.Date(email.created_at)).getDate()}&nbsp;
                            {(new window.Date(email.created_at)).toLocaleDateString("default", {month: "short"})}&nbsp;
                            {(new window.Date(email.created_at)).getFullYear()},&nbsp;
                            {(new window.Date(email.created_at)).toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit"})}
                        </Date>
                    </Box>
                    <Typography style = {{marginTop: 20, marginRight: 30}} >{email.email_body}</Typography>
                </Container>
            </Box>
        </Box>
    )
}

export default ViewEmail