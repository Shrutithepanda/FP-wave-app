import { useState } from "react"
import { Box, Button, Dialog, IconButton, InputBase, styled, Typography } from "@mui/material"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { Trash3, XLg } from "react-bootstrap-icons"

import useApi from "../hooks/useApi"
import { TASK_API_URLS } from "../services/api.urls"
import { Colours } from "../constants/colours"

const dialogStyle = {
    display: "flex",
    flexGrow: 1,
    maxWidth: "50%",
    boxShadow: "none",
    borderRadius: "10px",
    background: Colours.container,
    alignSelf: "flex-start",
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

const FieldWrapper = styled(Box) ({
    display: "flex",
    flexDirection: "column",
    padding: "0px 15px",
    "& > div": {
        padding: "10px 10px",
    }
})

const CreateButton = styled(Button) ({
    background: Colours.primary,
    color: "#FFF",
    borderRadius: 20,
    textTransform: "none",
    width: 80
})

const Footer = styled(Box) ({
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 27px",
})

/**
 * Create a project in the database
 * @param {boolean} openDialog 
 * @param {function} setOpenDialog 
 * @returns a dialog containing input fields for creating a project
 */
const ComposeProject = ({ openDialog, setOpenDialog }) => {
    const [data, setData] = useState({})

    const createProjectService = useApi(TASK_API_URLS.createProject)
    const saveProjectToDraftService = useApi(TASK_API_URLS.saveProjectToDraft)

    /**
     * Close the dialog and save the project to drafts if data is present
     * @param {*} e 
     */
    const closeComposeProject = (e) => {
        e.preventDefault() 

        // Data to be inserted in the table
        const body = {
            title: data?.title,
            description: data?.description,
            due_date: data?.due_date,
            folder: "drafts"
        }

        // Call the API and pass the body as a parameter
        saveProjectToDraftService.call(body)
        
        // If no error is returned, close the dialog box and set data to an empty object
        if (!saveProjectToDraftService?.error) {
            setOpenDialog(false)
            setData({})
        }
        else {
            // In case of error
            setOpenDialog(true)
        }
    }

    /**
     * Close the dialog when clicked outside
     */
    const closeOnClickAway = () => {
        setOpenDialog(false)
        setData({})
    }

    /**
     * Create a project in the database with the required fields
     * @param {*} e 
     */
    const createProject = (e) => {
        e.preventDefault()
        
        // Data to be inserted in the table
        const body = {
            title: data?.title,
            description: data?.description,
            due_date: data?.due_date,
            folder: "projects"
        }

        // Call the API and pass the body as a parameter
        createProjectService.call(body)
        
        // If no error is returned, close the dialog box, set data to an empty object and reload
        if (!createProjectService?.error) {
            setOpenDialog(false)
            setData({})
            window.location.reload()
        }
        else {
            // In case of error
            setOpenDialog(true)
        }
    }

    /**
     * Set the data to the data entered in the input fields
     * @param {*} e 
     */
    const onValueChange = (e) => {
        // Store value and name based on the DateTimePicker or TextFields
        const value = e?.target ? e.target.value : e.$d
        const fieldName = e?.target ? e.target.name : "due_date"
        
        if (value === "" || value === null) {
            // If there is no value in the fields then set the data to an empty object
            setData({});
        } else {
            // Otherwise set the data to the data entered in the fields
            setData({ ...data, [fieldName]: value });
        }
        
    }

    return (
        <Box>
            <Dialog
                open = { openDialog }
                onClose = { closeOnClickAway }
                PaperProps = {{ sx: dialogStyle }}
            >
                {/* Header containing the dialog title and close button */}
               <Header>
                    <Typography>New project</Typography>
                    <IconButton onClick = { (e) => closeComposeProject(e) }>
                        <XLg size = {12} color = "#000" />
                    </IconButton>
               </Header>

                {/* Container containing input fields */}
               <FieldWrapper>
                    {/* Title and description */}
                    <InputBase 
                        placeholder = "Project Title" 
                        name = "title" 
                        onChange = { (e) => onValueChange(e) } 
                        sx = {{ borderBottom: `1px solid ${Colours.cardBg}` }} 
                    />
                    <InputBase 
                        placeholder = "Description" 
                        name = "description" 
                        onChange = { (e) => onValueChange(e) } 
                    />
                    
                    {/* Date and time picker */}
                    <LocalizationProvider dateAdapter = { AdapterDayjs }>
                            <DateTimePicker 
                                label = "Due date" 
                                disablePast = { true }
                                format = "DD/MM/YYYY hh:mm a"
                                name = "due_date"
                                onChange = { (e) => onValueChange(e) }
                            />
                    </LocalizationProvider>
               </FieldWrapper>

                {/* Footer containing create and delete button */}
               <Footer>
                    <CreateButton onClick = { (e) => createProject(e) } >
                        Create
                    </CreateButton>

                    <IconButton>
                        <Trash3 
                            onClick = { () => { setOpenDialog(false); setData({}) }} 
                            size = {20} 
                            color = {Colours.error} 
                        />
                    </IconButton>
               </Footer>

            </Dialog>
        </Box>
    )
}

export default ComposeProject