import { Box, IconButton, styled, Typography } from "@mui/material"
import { CircleFill, Pencil, XLg } from "react-bootstrap-icons"
import { Colours } from "../constants/colours"
import { useEffect } from "react"
import { useState } from "react"
import UpdateTask from "../customComponents/UpdateTask"
import { TASK_API_URLS } from "../services/api.urls"
import useApi from "../hooks/useApi"

const Wrapper = styled(Box) ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    width: "95%",
    flexGrow: 1,
    padding: "5px 15px",
    marginTop: 10,
    borderRadius: 10,
    background: Colours.cardBg,
    "& > div": {
        margin: "0 0"
    }
})

const Indicator = styled(Box) ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    color: "#222",
    padding: "0 7px",
    margin: "0 10px",
    textWrap: "nowrap",
    borderRadius: 20,
    height: 23,
    width: "110px !important",
    "& > p": {
        fontSize: "15px !important",
    }
})

const Texts = styled(Box) ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "90%",
    overflow: 'hidden',
    "& > p": {
        width: "30%",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
})

/**
 * Tasks for a project
 * @param {object} task 
 * @param {int} projectId 
 * @returns tasks
 */
const Task  = ({ task, projectId }) => {
    const [indicatorColor, setIndicatorColor] = useState(Colours.notStartedBg)
    const [circleColor, setCircleColor] = useState(Colours.notStartedCircle)
    const [loading, setLoading] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const update = () => setOpenDialog(true)
    
    // Initialise service
    const deleteTaskService = useApi(TASK_API_URLS.deleteTask)

    /**
     * Delete a task
     */
    const deleteTask = async () => {
        // setLoading(true)
        await deleteTaskService.call({ id: task.id })
        window.location.reload()
        // setLoading(false)
    }
    
    useEffect(() => {
        /**
         * Change indicator colour of tasks based on their status
         */
        const changeIndicatorColor = () => {
            if (task.status === "In progress") {
                setIndicatorColor(Colours.inProgressBg)
                setCircleColor(Colours.inProgressCircle)
            }
            if (task.status === "Completed") {
                setIndicatorColor(Colours.completedBg)
                setCircleColor(Colours.completedCircle)
            }
            if (task.status === "Pending") {
                setIndicatorColor(Colours.pendingBg)
                setCircleColor(Colours.pendingCircle)
            }
        }
        changeIndicatorColor()
    }, [])

    return (
        <Wrapper>
            {/* Edit button */}
            <IconButton onClick = { update }>
                <Pencil size = {15} color = "#000" />
            </IconButton>

            {/* Task name, due data and indicator */}
            <Texts>
                <Typography>{task.task_name}</Typography>

                <Typography>
                    { (new window.Date(task.due_date)).toLocaleDateString() }&nbsp;
                    { (new window.Date(task.due_date)).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) }
                </Typography>
                
                <Indicator sx = {{ backgroundColor: indicatorColor }} >
                    <CircleFill size = {10} color = { circleColor } style = {{ marginRight: 5 }} />
                    <Typography>{task.status}</Typography>
                </Indicator>
            </Texts>

            {/* Delete task button */}
            <IconButton onClick = { deleteTask }>
                <XLg size = {15} color = "#000" />
            </IconButton>

            {/* Update task model */}
            <UpdateTask 
                openDialog = { openDialog } 
                setOpenDialog = { setOpenDialog } 
                task = { task } 
                projectId = { projectId } 
            />
        </Wrapper>
    )
}

export default Task