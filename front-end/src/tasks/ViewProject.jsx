import React, { useEffect, useState } from "react"
import { Box, IconButton, List, styled, Typography } from "@mui/material"
import { ArrowClockwise, ArrowLeft, Bookmark, BookmarkFill, CircleFill, Pencil, PlusCircle, Trash3 } from "react-bootstrap-icons"
import { useLocation, useOutletContext } from "react-router-dom"

import Task from "./Task"
import ComposeTask from "../customComponents/ComposeTask"
import UpdateProject from "../customComponents/UpdateProject"

import useApi from "../hooks/useApi"
import { useAuth } from "../hooks/AuthProvider"
import { useEmotion } from "../hooks/EmotionProvider"

import { TASK_API_URLS } from "../services/api.urls"
import { Colours } from "../constants/colours"

const IconWrapper = styled(Box) ({
    padding: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
})

const Subject = styled(Box) ({
    fontSize: 22,
    margin: "10px 0 20px 30px",
    display: "flex",
    alignItems: "center"
})

const Indicator = styled(Box) ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px !important",
    color: "#222",
    padding: "0 7px",
    margin: "0 10px",
    textWrap: "nowrap",
    borderRadius: 20,
    height: 25,
    width: "110px !important"
})

const Container = styled(Box) ({
    marginLeft: 30,
    width: "100%",
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

/**
 * 
 * @returns a view page for a project
 */
const ViewProject = () => {
    const [indicatorColor, setIndicatorColor] = useState(Colours.notStartedBg)
    const [circleColor, setCircleColor] = useState(Colours.notStartedCircle)
    const [openCreateDialog, setOpenCreateDialog] = useState(false)
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
    const [loading, setLoading] = useState(false)
    const { openSidebar } = useOutletContext()
    
    // User object and stressed state
    const { user } = useAuth()
    const { stressed } = useEmotion()
    
    // Extract the project from the router's state
    const { state } = useLocation()
    const { project } = state
    
    // Initialise services
    const moveProjectToTrashService = useApi(TASK_API_URLS.moveProjectToTrash)
    const toggleHighPriorityService = useApi(TASK_API_URLS.toggleHighPriorityProjects)
    const getTasksService = useApi(TASK_API_URLS.fetchTasks)

    /**
     * 
     * @returns a dialog to create a new task
     */
    const createNewTask = () => setOpenCreateDialog(true)

    /**
     * 
     * @returns a dialog to update a task
     */
    const updateProject = () => setOpenUpdateDialog(true)

    /**
     * Move a project to trash
     */
    const deleteProject = () => {
        // Move the project to trash and reload
        moveProjectToTrashService.call([project.id])
        window.history.back()
    }

    /**
     * Mark the project as important or un-important
     */
    const toggleHighPriorityProjects = () => {
        toggleHighPriorityService.call({ id: project.id, priority: !project.priority })
        // setRefresh(prevState => !prevState)
        window.location.reload()
    }

    /**
     * Refresh page
     */
    const handleRefresh = () => {
        window.location.reload()
    }
    
    useEffect(() => {
        /**
         * Fetch all tasks for the project
         */
        const fetchTasks = async () => {
            setLoading(true)
            await getTasksService.call({}, "", user.id, project.id)
            setLoading(false)
        }
        
        fetchTasks()

        /**
         * Change the indicator colour of the project based on its status value
         */
        const changeIndicatorColor = () => {
            if (project.status === "In progress") {
                setIndicatorColor(Colours.inProgressBg)
                setCircleColor(Colours.inProgressCircle)
            }
            if (project.status === "Completed") {
                setIndicatorColor(Colours.completedBg)
                setCircleColor(Colours.completedCircle)
            }
            if (project.status === "Pending") {
                setIndicatorColor(Colours.pendingBg)
                setCircleColor(Colours.pendingCircle)
            }
        }
        changeIndicatorColor()
    }, [])

    return (
        <Box style = {
                openSidebar 
                ? {
                    marginLeft: 158, 
                    marginRight: 30,
                    width: "calc(100% - 188px)",  // -188 px for sidebar's width + space for shadow
                    boxShadow: `2px 0px 10px 2px ${stressed ? "lightgreen" : Colours.normalShadow}`, 
                    height: "calc(100vh - 70px)", // -70px for header's height,
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    background: Colours.container
                } 
                : {
                    marginLeft: 30, 
                    marginRight: 30,
                    width: "calc(100% - 60px)",
                    boxShadow: `2px 0px 10px 2px ${stressed ? "lightgreen" : Colours.normalShadow}`, 
                    height: "calc(100vh - 70px)",
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    background: Colours.container
                }
            } 
        >
            {/* Back and refresh buttons */}
            <IconWrapper>
                <IconButton onClick = {() => window.history.back()}>
                    <ArrowLeft size = {20} aria-label = "back" />
                </IconButton>
                    
                <span style = {{marginLeft: "auto", marginRight: 15}}>
                    <IconButton onClick = {handleRefresh}>
                        <ArrowClockwise size = {20} color = "#000" aria-label = "reload" />
                    </IconButton>
                </span>
            </IconWrapper>

            {/* Project title, indicator, bookmark button, edit project button, and delete project button */}
            <Subject>
                {project.title}
                
                    <Indicator sx = {{ backgroundColor: indicatorColor }}>
                        <CircleFill size = {10} color = { circleColor } style = {{ marginRight: 5 }} />
                        {project.status}
                    </Indicator>
                
                { project.priority === true
                    ? <IconButton onClick = { toggleHighPriorityProjects } style = {{ margin: "0 10px" }}>
                        <BookmarkFill size = {20} color = {Colours.bookmark} />
                    </IconButton>
                    : <IconButton onClick = { toggleHighPriorityProjects } style = {{ margin: "0 10px" }}>
                        <Bookmark size = {20} />
                    </IconButton>
                }

                <IconButton onClick = { updateProject }>
                    <Pencil size = {20}/>
                </IconButton>

                <span style = {{ marginLeft: "auto", marginRight: 40 }}>
                    <IconButton onClick = { deleteProject }>
                        <Trash3 size = {20} color = { Colours.error }/>
                    </IconButton>
                </span>
            </Subject>

            {/* Project description, due date */}
            <Box style = {{ display: "flex" }} >
                <Container>
                    <Box style = {{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <Typography style = {{ marginTop: 10, marginLeft: 0 }} >
                            {project.description}
                        </Typography>
                        <Date>
                            Due:&nbsp;
                            { (new window.Date(project.due_date)).getDate() }&nbsp;
                            { (new window.Date(project.due_date)).toLocaleDateString("default", { month: "short" }) }&nbsp;
                            { (new window.Date(project.due_date)).getFullYear() },&nbsp;
                            { (new window.Date(project.due_date)).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) }
                        </Date>
                    </Box>
                </Container>
            </Box>

            {/* Tasks and create new task button */}
            <Box sx = {{ marginLeft: 4, display: "flex", flexDirection: "column" }}>
                <List>
                    { getTasksService?.response?.map((task, index) => (
                        <Task 
                            key = { index } 
                            task = { task } 
                            projectId = { project.id }
                        />
                    ))}
                </List>

                <IconButton onClick = { createNewTask } sx = {{ alignSelf: "center", marginTop: 1 }}>
                    <PlusCircle size = {25} color = "#79747E" />
                </IconButton>
            </Box>

            {/* Dialogs for creating and updating a task */}
            <ComposeTask 
                openDialog = { openCreateDialog } 
                setOpenDialog = { setOpenCreateDialog } 
                projectId = { project .id} 
            />
            <UpdateProject 
                openDialog = { openUpdateDialog } 
                setOpenDialog = { setOpenUpdateDialog } 
                project = { project } 
            />
        </Box>
    )
}

export default ViewProject