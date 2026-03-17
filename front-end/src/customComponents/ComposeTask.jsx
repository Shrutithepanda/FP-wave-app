import { useState } from "react"
import { Box, Button, Dialog, FormControl, IconButton, InputBase, InputLabel, MenuItem, Select, styled, Typography } from "@mui/material"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { Trash3, XLg } from "react-bootstrap-icons"

import { useAuth } from "../hooks/AuthProvider"
import useApi from "../hooks/useApi"
import { TASK_API_URLS } from "../services/api.urls"
import { Colours } from "../constants/colours"

// Styled MUI components
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
 * Create a task in the database
 * @param {boolean} openDialog 
 * @param {function} setOpenDialog 
 * @param {int} projectId 
 * @returns a dialog containing input fields for creating a task
 */
const ComposeTask = ({ openDialog, setOpenDialog, projectId }) => {
    const [data, setData] = useState({})
    const [error, setError] = useState("")
    const [status, setStatus] = useState("")
    const { user } = useAuth()

    // Initialise create task service 
    const createTaskService = useApi(TASK_API_URLS.createTask)

    /**
     * Close the dialog and set the fields back to their initial values
     * @param {*} e 
     */
    const closeComposeTask = (e) => {
        e.preventDefault() 
        setOpenDialog(false)
        setData({})
        setStatus("")
        setError("")
    }

    /**
     * Create a task in the Tasks table with the required fields
     * @param {*} e 
     */
    const createTask = (e) => {
        e.preventDefault()
        
        // Data to be inserted in the table
        const body = {
            user_id: user?.id,
            project_id: projectId,
            task_name: data?.task_name,
            status: data?.status,
            due_date: data?.due_date,
            folder: "view"
        }

        // If empty data is being sent, display error
        if (data?.task_name == undefined || data?.status == undefined || data?.due_date == undefined) {
            setOpenDialog(true)
            setError("All fields must be filled")
        }
        else if (data?.task_name && data?.status && data?.due_date) { // If data is present in all fields ...
            // Call the API and pass the body as a parameter
            createTaskService.call(body)
            
            // If no error is returned, close the dialog box, set data to an empty object and reload
            if (!createTaskService?.error) {
                setOpenDialog(false)
                setData({})
                window.location.reload()
            }
            else {
                // In case of error keep the dialog open and show the error
                setOpenDialog(true)
                setError(createTaskService?.error)
            }
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

        // Set the status to the value
        if (fieldName === "status") setStatus(value)
        
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
                onClose = { (e) => closeComposeTask(e) }
                PaperProps = {{ sx: dialogStyle }}
            >
                {/* Header containing dialog heading and close button */}
               <Header>
                    <Typography>New task</Typography>
                    <IconButton onClick = {(e) => closeComposeTask(e)}>
                        <XLg size = {15} color = "#000" aria-label = "close compose dialog" />
                    </IconButton>
               </Header>

                {/* Input fields */}
               <FieldWrapper>
                    {/* Task name */}
                    <InputBase 
                        placeholder = "Task name" 
                        aria-placeholder = "Task name"
                        name = "task_name" 
                        onChange = { (e) => onValueChange(e) } 
                    />

                    {/* Status menu */}
                    <FormControl>
                        <InputLabel>Status</InputLabel>
                        <Select
                            label = "Status"
                            name = "status"
                            aria-label = "Status"
                            value = { status }
                            onChange = { (e) => onValueChange(e) }
                        >
                            <MenuItem value = {"Not started"} aria-label = "Not started">Not started</MenuItem>
                            <MenuItem value = {"In progress"} aria-label = "In progress">In progress</MenuItem>
                            <MenuItem value = {"Completed"} aria-label = "Completed">Completed</MenuItem>
                            <MenuItem value = {"Pending"} aria-label = "Pending">Pending</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Data time picker */}
                    <LocalizationProvider dateAdapter = { AdapterDayjs }>
                            <DateTimePicker 
                                label = "Due date" 
                                disablePast = {true}
                                format = "DD/MM/YYYY hh:mm a"
                                name = "due_date"
                                onChange = { (e) => onValueChange(e) }
                            />
                    </LocalizationProvider>
               </FieldWrapper>

                {/* Footer containing error, create and delete button */}
               <Footer>
                    <SendButton onClick = { (e) => createTask(e) }>
                        Create
                    </SendButton>

                    {/* Error */}
                    <Typography sx = {{ fontWeight: 600, color: Colours.error }}>
                        {error ? error : <></>}
                    </Typography>

                    <IconButton>
                        <Trash3 
                            onClick = { (e) => closeComposeTask(e) } 
                            size = {20} 
                            color = {Colours.error} 
                            aria-label = "delete"
                        />
                    </IconButton>
               </Footer>
            </Dialog>
        </Box>
    )
}

export default ComposeTask