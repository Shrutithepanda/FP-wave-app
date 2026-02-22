import { useState } from "react"
import { Box, Button, Dialog, FormControl, IconButton, InputBase, InputLabel, MenuItem, Select, styled, Typography } from "@mui/material"
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { XLg } from "react-bootstrap-icons"

import { TASK_API_URLS } from "../services/api.urls"
import { useAuth } from "../hooks/AuthProvider"
import useApi from "../hooks/useApi"
import { Colours } from "../constants/colours"

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
 * Update a task
 * @param {boolean} openDialog
 * @param {function} setOpenDialog 
 * @param {int} projectId 
 * @param {object} task 
 * @returns a dialog containing input fields (pre-filled) to update a task
 */
const UpdateTask = ({ openDialog, setOpenDialog, projectId, task }) => {
    const [data, setData] = useState(task)
    const [status, setStatus] = useState("")

    // Destructure the user object from useAuth hook - for user id
    const { user } = useAuth()

    // Initialise the update task service 
    const updateTaskService = useApi(TASK_API_URLS.updateTask)

    /**
     * Close the dialog with previous data
     * @param {*} e 
     */
    const closeDialog = (e) => {
        e.preventDefault() 
        setOpenDialog(false)
        setData(task)
    }

    /**
     * Close when clicked outside of the dialog. Keep the previous data.
     */
    const closeOnClickAway = () => {
        setOpenDialog(false)
        setData(task)
    }

    /**
     * Update a task in the Tasks table with the required fields
     * @param {*} e 
     */
    const updateTask = (e) => {
        e.preventDefault()
        
        // Data to be updated in the table
        const body = {
            id: task.id,
            user_id: user?.id,
            project_id: projectId,
            task_name: data?.task_name,
            status: data?.status,
            due_date: data?.due_date,
            folder: "view"
        }

        // Call the API and pass the body as a parameter
        updateTaskService.call(body)
        
        // If no error is returned, close the dialog box, set data to the updated data and reload
        if (!updateTaskService?.error) {
            setOpenDialog(false)
            setData(data)
            
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
        const fieldName = e?.target ? e.target.name : "due_date"
        const value = e?.target ? e.target.value : e.$d

        if (fieldName === "status") setStatus(e?.target.value)

        // Set the data to the data entered in the fields
        setData({ ...data, [fieldName]: value })        
    }

    return (
        <Box>
            <Dialog
                open = { openDialog }
                onClose = { closeOnClickAway }
                PaperProps = {{ sx: dialogStyle }}
            >
                {/* Header containing dialog title and close button */}
               <Header>
                    <Typography>Update task</Typography>
                    <IconButton onClick = { (e) => closeDialog(e) }>
                        <XLg size = {15} color = "#000" />
                    </IconButton>
               </Header>

                {/* Input container */}
               <FieldWrapper>
                    {/* Task name */}
                    <InputBase 
                        value = { data.task_name } 
                        name = "task_name" 
                        onChange = { (e) => onValueChange(e) } 
                    />

                    {/* Status */}
                    <FormControl>
                        <InputLabel>Status</InputLabel>
                        <Select
                            label = "Status"
                            name = "status"
                            value = { data.status }
                            onChange = { (e) => onValueChange(e) }
                        >
                            <MenuItem value = {"Not started"}>Not started</MenuItem>
                            <MenuItem value = {"In progress"}>In progress</MenuItem>
                            <MenuItem value = {"Completed"}>Completed</MenuItem>
                            <MenuItem value = {"Pending"}>Pending</MenuItem>
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

                {/* Footer containing the update button */}
               <Footer>
                    <SendButton onClick = { (e) => updateTask(e) } >
                        Update
                    </SendButton>
               </Footer>
            </Dialog>
        </Box>
    )
}

export default UpdateTask