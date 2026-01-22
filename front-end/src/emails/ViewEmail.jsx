import { Box, styled, Typography } from "@mui/material"
import { CaretLeft, PersonCircle, Trash3 } from "react-bootstrap-icons"
import { useLocation, useOutletContext } from "react-router-dom"
import { useAuth } from "../hooks/AuthProvider"
import useApi from "../hooks/useApi"
import { API_URLS } from "../services/api.urls"

const IconWrapper = styled(Box) ({
    padding: 15,
})

const Subject = styled(Typography) ({
    fontSize: 22,
    margin: "10px 0 20px 75px",
    display: "flex"
})

const Indicator = styled(Box) ({
    fontSize: 13,
    backgroundColor: "#DDD",
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
            fontSize: 12,
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

    // Extract the email from the router's state
    const { state } = useLocation()
    const { email } = state

    const moveEmailsToTrashService = useApi(API_URLS.moveEmailsToTrash)

    const deleteEmail = () => {
        moveEmailsToTrashService.call([email.id])
        window.history.back()
    }

    return (
        <Box style = {openSidebar ? {marginLeft: 150} : {width: "100%"}} >
            <IconWrapper>
                <CaretLeft size = {20} onClick = {() => window.history.back()} style = {{cursor: "pointer"}} />
                <Trash3 size = {17} style = {{marginLeft: 40, cursor: "pointer"}} onClick = {() => deleteEmail()} />
            </IconWrapper>

            <Subject>
                {email.subject}
                <Indicator component = "span" >{email.folder}</Indicator>
            </Subject>
            <Box style = {{display: "flex"}} >
                <PersonCircle size = {30} color = "#bcbcbc" style = {{margin: "5px 10px 0 10px"}} />
                <Container>
                    <Box>
                        <Typography style = {{marginTop: 10, fontWeight: "bold"}} >
                            {email.name}
                            <Box component = "span" style = {{fontWeight: "normal"}}>&nbsp;&#60;{email.send_to}&#62;</Box>
                        </Typography>
                        <Date>
                            {(new window.Date(email.created_at)).getDate()}&nbsp;
                            {(new window.Date(email.created_at)).toLocaleDateString("default", {month: "short"})}&nbsp;
                            {(new window.Date(email.created_at)).getFullYear()}&nbsp;
                        </Date>
                    </Box>
                    <Typography style = {{marginTop: 20}} >{email.email_body}</Typography>
                </Container>
            </Box>
        </Box>
    )
}

export default ViewEmail