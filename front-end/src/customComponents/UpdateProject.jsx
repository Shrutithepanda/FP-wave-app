import { useState } from "react"
import { Box, Button, Dialog, FormControl, IconButton, InputBase, InputLabel, MenuItem, Select, styled, Typography } from "@mui/material"
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { XLg } from "react-bootstrap-icons"

import { TASK_API_URLS } from "../services/api.urls"
import useApi from "../hooks/useApi"
import { Colours } from "../constants/colours"

// Styled MUI components
const dialogStyle = {
    display: "flex",
    flexGrow: 1,
    maxWidth: "50%",
    boxShadow: "none",
    borderRadius: "10px",
    background: Colours.container,
    alignSelf: "flex-start"
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
    padding: "15px 27px",
})

/**
 * Update a project
 * @param {boolean} openDialog 
 * @param {function} setOpenDialog 
 * @param {object} project 
 * @returns a dialog containing input fields (pre-filled) to update a project
 */
const UpdateProject = ({ openDialog, setOpenDialog, project }) => {
    const [data, setData] = useState(project)
    const [error, setError] = useState("")
    const [_, setStatus] = useState("")

    // Initialise the update project service
    const updateProjectService = useApi(TASK_API_URLS.updateProject)

    /**
     * Close the dialog with previous data
     * @param {*} e 
     */
    const closeDialog = (e) => {
        e.preventDefault() 
        setOpenDialog(false)
        setData(project)
        setError("")
    }

    /**
     * Update a project in the Projects table with the required fields
     */
    const updateProject = (e) => {
        e.preventDefault()
        
        // If status is updated to complete, update the folder name to complete
        if (data?.status === "Completed") {
            // Data to be updated in the table
            const body = {
                id: project.id,
                title: data?.title,
                description: data?.description,
                status: data?.status,
                due_date: data?.due_date,
                folder: "completed"
            }

            // If empty data is being sent, display error
            if (data?.title == "" || data?.description == "" || data?.status == undefined || data?.due_date == undefined) {
                console.log(data)
                setOpenDialog(true)
                setError("All fields must be filled")
            }
            else if (data?.title && data?.description && data?.status && data?.due_date) { // If there is data in all fields ...
                // Call the API and pass the body as a parameter
                updateProjectService.call(body)
                
                // If no error is returned, close the dialog box, set data to the updated data and reload
                if (!updateProjectService?.error) {
                    setOpenDialog(false)
                    setData(data)
                    window.location.reload()
                }
                else {
                    // In case of error keep the dialog open and show the error
                    setOpenDialog(true)
                    setError(updateProjectService?.error)
                }
            }
        }
        else {
            // Data to be updated in the table with default folder name - projects
            const body = {
                id: project.id,
                title: data?.title,
                description: data?.description,
                status: data?.status,
                due_date: data?.due_date,
                folder: "projects"
            }
    
            // If empty data is being sent, display error
            if (data?.title == "" || data?.description == "" || data?.status == undefined || data?.due_date == undefined) {
                setOpenDialog(true)
                setError("All fields must be filled")
            }
            else if (data?.title && data?.description && data?.status && data?.due_date) { // If there is data in all fields ...
                // Call the API and pass the body as a parameter
                updateProjectService.call(body)
                
                // If no error is returned, close the dialog box, set data to the updated data and reload
                if (!updateProjectService?.error) {
                    setOpenDialog(false)
                    setData(data)
                    window.location.reload()
                }
                else {
                    // In case of error keep the dialog open and show the error
                    setOpenDialog(true)
                    setError(updateProjectService?.error)
                }
            }
        }
    }

    /**
     * Set the data to the data entered in the input fields
    */
    const onValueChange = (e) => {        
        // Store value and name based on the DateTimePicker or TextFields
        const fieldName = e?.target ? e.target.name : "due_date"
        const value = e?.target ? e.target.value : e.$d

        if (fieldName === "status") setStatus(value)

        // Set the data to the data entered in the fields
        setData({ ...data, [fieldName]: value })        
    }

    return (
        <Box>
            <Dialog
                open = { openDialog }
                onClose = { (e) => closeDialog(e) }
                PaperProps = {{ sx: dialogStyle }}
            >
                {/* Header containing dialog title and close button */}
               <Header>
                    <Typography>Update project</Typography>
                    <IconButton onClick = { (e) => closeDialog(e) }>
                        <XLg size = {15} color = "#000" aria-label = "close update project dialog" />
                    </IconButton>
               </Header>

                {/* Input container */}
               <FieldWrapper>
                    {/* Title and description */}
                    <InputBase 
                        value = { data.title } 
                        name = "title" 
                        aria-placeholder = "Title"
                        onChange = { (e) => onValueChange(e) } 
                        sx = {{ borderBottom: `1px solid ${Colours.cardBg}` }}
                    />
                    <InputBase 
                        value = { data.description } 
                        name = "description" 
                        aria-placeholder = "Description"
                        onChange = { (e) => onValueChange(e) } 
                    />

                    {/* Status */}
                    <FormControl>
                        <InputLabel>Status</InputLabel>
                        <Select
                            label = "Status"
                            name = "status"
                            aria-label = "Status"
                            value = { data.status }
                            onChange = { (e) => onValueChange(e) }
                        >
                            <MenuItem value = {"Not started"} aria-label = "Not started">Not started</MenuItem>
                            <MenuItem value = {"In progress"} aria-label = "In progress">In progress</MenuItem>
                            <MenuItem value = {"Completed"} aria-label = "Completed">Completed</MenuItem>
                            <MenuItem value = {"Pending"} aria-label = "Pending">Pending</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Date time picker */}
                    <LocalizationProvider dateAdapter = { AdapterDayjs }>
                        <DateTimePicker 
                            label = "Due date" 
                            disablePast = {true}
                            format = "DD/MM/YYYY hh:mm a"
                            name = "due_date"
                            value = { dayjs(data.due_date) }
                            onChange = { (e) => onValueChange(e) }
                        />
                    </LocalizationProvider>
               </FieldWrapper>

                {/* Footer containing the update button and error */}
               <Footer>
                    <SendButton onClick = { (e) => updateProject(e) } >
                        Update
                    </SendButton>

                    {/* Error */}
                    <Typography sx = {{ fontWeight: 600, color: Colours.error }}>
                        {error ? error : <></>}
                    </Typography>
               </Footer>
            </Dialog>
        </Box>
    )
}

export default UpdateProject