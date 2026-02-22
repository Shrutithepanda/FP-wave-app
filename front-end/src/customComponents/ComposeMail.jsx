import { useState } from "react"
import { Box, Button, Dialog, IconButton, InputBase, styled, TextField, Typography } from "@mui/material"
import { Trash3, XLg } from "react-bootstrap-icons"

import { useAuth } from "../hooks/AuthProvider"
import useApi from "../hooks/useApi"
import { EMAIL_API_URLS } from "../services/api.urls"
import { Colours } from "../constants/colours"

const dialogStyle = {
    display: "flex",
    flexGrow: 1,
    maxWidth: "80%",
    boxShadow: "none",
    borderRadius: "10px",
    background: Colours.container
}

const Header = styled(Box) ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 15px",
    background: Colours.cardBg,
    "& > p": {
        fontSize: 15,
    }
})

const RecipientsWrapper = styled(Box) ({
    display: "flex",
    flexDirection: "column",
    padding: "0px 15px",
    "& > div": {
        fontSize: 15,
        borderBottom: `1px solid ${Colours.cardBg}`,
        marginTop: 10,
        padding: "10px 15px",
        alignItems: "center"
    }
})

const SendButton = styled(Button) ({
    background: Colours.primary,
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

/**
 * 
 * @param {boolean} openDialog 
 * @param {function} setOpenDialog 
 * @returns a dialog containing text fields for creating a new email 
 */
const ComposeMail = ({ openDialog, setOpenDialog }) => {
    const [data, setData] = useState({})
    const [error, setError] = useState("")
    const { user } = useAuth()

    // Initialise email services for sending and saving draft using the custom hook middleware - useApi
    const sentEmailService = useApi(EMAIL_API_URLS.saveSentEmail)
    const saveDraftService = useApi(EMAIL_API_URLS.saveDraft)

    /**
     * Save the email in the drafts folder if there is content and the close button is clicked
     * @param {*} e 
     */
    const closeComposeMail = (e) => {
        e.preventDefault() 

        // Data to be inserted in the table
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
            // In case of error keep the dialog open
            setOpenDialog(true)
        }
    }

    /**
     * Close the dialog when clicked outside 
     */
    const closeOnClickAway = () => {
        setOpenDialog(false)
    }

    /**
     * Send an email (save to the database with folder name - sent) if all required fields are filled
     * @param {*} e 
     */
    const SendMail = (e) => {
        e.preventDefault()

        // Data to be inserted in the table
        const body = {
            user_id: user?.id,
            send_to: data?.to,
            subject: data?.subject,
            email_body: data?.body,
            read: true,
            folder: "sent"
        }

        // Call the API and pass the body as a parameter
        sentEmailService.call(body)
        
        // If no error is returned, close the dialog box, set data to an empty object and reload
        if (!sentEmailService?.error) {
            setOpenDialog(false)
            setData({})
            window.location.reload()
        }
        else {
            // In case of error keep the dialog open
            setOpenDialog(true)
        }
    }

    /**
     * Set the data to the data entered in the input fields
     * @param {*} e 
     */
    const onValueChange = (e) => {
        // If target value is empty, set the data to an empty object
        if(e.target.value === "") setData({})

        // Otherwise set the data to field name and its value
        else setData({ ...data, [e.target.name]: e.target.value })
    }

    return (
        <Box>
            <Dialog
                open = { openDialog }
                onClose = { closeOnClickAway }
                PaperProps = {{ sx: dialogStyle }}
            >
                {/* Header containing container header and close button */}
               <Header>
                    <Typography>New message</Typography>
                    <IconButton onClick = { (e) => closeComposeMail(e)} >
                        <XLg size = {15} />
                    </IconButton>
               </Header>

                {/* Container containing recipient's email address and subject */}
               <RecipientsWrapper>
                    <InputBase 
                        placeholder = "Send to" 
                        name = "to" 
                        onChange = { (e) => onValueChange(e) } 
                    />
                    <InputBase 
                        placeholder = "Subject" 
                        name = "subject" 
                        onChange = { (e) => onValueChange(e) } 
                    />
               </RecipientsWrapper>

                {/* Text field for the body of the email */}
               <TextField 
                    multiline 
                    rows = {10}  
                    sx = {{ '& .MuiOutlinedInput-notchedOutline': { border: "none" }, paddingLeft: "15px" }}
                    name = "body"
                    onChange = { (e) => onValueChange(e) }
                />

                {/* Footer containing send and delete buttons */}
               <Footer>
                    <SendButton onClick = { (e) => SendMail(e) } >
                        Send
                    </SendButton>

                    {error ? error : <></>}

                    <IconButton onClick = { () => { setOpenDialog(false); setData({}) } }>
                        <Trash3 size = {20} color = {Colours.error} />
                    </IconButton>
               </Footer>
               
            </Dialog>
        </Box>
    )
}

export default ComposeMail