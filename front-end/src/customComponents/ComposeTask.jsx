import { useState } from "react"
import { Box, Button, ClickAwayListener, Dialog, InputBase, styled, TextField, Typography } from "@mui/material"
import { Folder, Send, Trash3, XLg } from "react-bootstrap-icons"
import { useAuth } from "../hooks/AuthProvider"
import useApi from "../hooks/useApi"
import { EMAIL_API_URLS } from "../services/api.urls"

const dialogStyle = {
    height: "90%",
    width: "80%",
    maxWidth: "100%",
    maxHeight: "100%",
    boxShadow: "none",
    borderRadius: "10px",
    background: "#F9F9F9"
}

const Header = styled(Box) ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 15px",
    background: "#EEEEF7",
    '& > p': {
        fontSize: 15,
    }
})

const RecipientsWrapper = styled(Box) ({
    display: "flex",
    flexDirection: "column",
    padding: "0px 15px",
    '& > div': {
        fontSize: 15,
        borderBottom: "1px solid #EEEEF7",
        marginTop: 10,
        padding: "10px 15px",
        alignItems: "center"
    }
})

const SendButton = styled(Button) ({
    background: "#42458A",
    color: "#FFF",
    borderRadius: 20,
    textTransform: "none",
    width: 80
})

const Footer = styled(Box) ({
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 15px",
})

const ComposeTask = ({ openDialog, setOpenDialog }) => {
    const [data, setData] = useState({})
    const { user } = useAuth()
    // Initialise sent email service using the custom hook for saving sent emails
    const sentEmailService = useApi(EMAIL_API_URLS.saveSentEmail)
    const saveDraftService = useApi(EMAIL_API_URLS.saveDraft)

    const closeComposeMail = (e) => {
        e.preventDefault() 
        // Save to draft 
        const body = {
            user_id: user?.id,
            send_to: data?.to,
            subject: data?.subject,
            email_body: data?.body,
            read: true,
            folder: "drafts"
        }

        // Call the API and pass the body as a parameter
        saveDraftService.call(body)
        
        // If no error is returned, close the dialog box and set data to an empty object
        if (!saveDraftService?.error) {
            setOpenDialog(false)
            setData({})
        }
        else {
            // In case of error
        }
    }

    const closeOnClickAway = () => {
        setOpenDialog(false)
    }

    const SendMail = (e) => {
        e.preventDefault()
        // Insert the mail into supabase database table - Emails
        // Data to be inserted in the table
        const body = {
            user_id: user?.id,
            send_to: data?.to,
            subject: data?.subject,
            email_body: data?.body,
            read: true,
            // Folder name - type, is by default set to sent in the Emails table
            folder: "sent"
        }

        // Call the API and pass the body as a parameter
        sentEmailService.call(body)
        
        // If no error is returned, close the dialog box and set data to an empty object
        if (!sentEmailService?.error) {
            setOpenDialog(false)
            setData({})
            window.location.reload()
        }
        else {
            // In case of error
        }
    }

    const onValueChange = (e) => {
        if(e.target.value === "") setData({})
        else setData({ ...data, [e.target.name]: e.target.value })
        // console.log(data)
    }

    return (
        <div>
            <Dialog
                open = {openDialog}
                onClose = {closeOnClickAway}
                PaperProps = {{ sx: dialogStyle }}
                // sx = {{
                //     dialogStyle
                // }}
            >
               <Header>
                    <Typography>New message</Typography>
                    <XLg onClick = {(e) => closeComposeMail(e)} style = {{cursor: "pointer"}} />
               </Header>

               <RecipientsWrapper>
                    <InputBase placeholder = "Send to" name = "to" onChange = {(e) => onValueChange(e)} />
                    <InputBase placeholder = "Subject" name = "subject" onChange = {(e) => onValueChange(e)} />
               </RecipientsWrapper>

               <TextField 
                    multiline 
                    rows = {20}  
                    sx = {{ '& .MuiOutlinedInput-notchedOutline': { border: "none" }, paddingLeft: "15px" }}
                    name = "body"
                    onChange = {(e) => onValueChange(e)}
                />

               <Footer>
                    <SendButton onClick = {(e) => SendMail(e)} >
                        Send
                        {/* <Send /> */}
                    </SendButton>

                    <Button>
                        <Trash3 onClick = {() => setOpenDialog(false)} size = {20} color = "#E87476" />
                    </Button>
               </Footer>
            </Dialog>
        </div>
    )
}

export default ComposeTask