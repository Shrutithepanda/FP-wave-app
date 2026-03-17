import React, { Fragment, useEffect, useState } from "react"
import { Box, Button, Fade, IconButton, List, Snackbar, styled, Tooltip, Typography } from "@mui/material"
import { ArrowClockwise, ArrowLeft, Bookmark, BookmarkFill, CircleFill, Pencil, PlusCircle, Trash3, X } from "react-bootstrap-icons"
import { useLocation, useOutletContext } from "react-router-dom"

import Task from "./Task"
import ComposeTask from "../customComponents/ComposeTask"
import UpdateProject from "../customComponents/UpdateProject"

import useApi from "../hooks/useApi"
import { useAuth } from "../hooks/AuthProvider"
import { useEmotion } from "../hooks/EmotionProvider"

import { TASK_API_URLS } from "../services/api.urls"
import { Colours } from "../constants/colours"
import ExerciseModal from "../customComponents/ExerciseModal"

// Styled MUI components
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
            color: "#4F4E4E"
        }
    }
})

const Date = styled(Box) ({
    margin: "0 50px 0 auto",
    color: "#4F4E4E"
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
    const [openSnackbarHigh, setOpenSnackbarHigh] = useState(false)
    const [openExercise, setOpenExercise] = useState(false)
    
    // User object and stressed state
    const { user } = useAuth()
    const { stressLevel } = useEmotion()

    
    // Extract the project from the router's state
    const { state } = useLocation()
    const { project } = state
    
    // Initialise services
    const moveProjectToTrashService = useApi(TASK_API_URLS.moveProjectToTrash)
    const toggleHighPriorityService = useApi(TASK_API_URLS.toggleHighPriorityProjects)
    const getTasksService = useApi(TASK_API_URLS.fetchTasks)

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

    useEffect(() => {
        if (stressLevel === "high") setOpenSnackbarHigh(true)
    }, [stressLevel])
    
    /**
     * Close the snackbar when X is pressed
     */
    const closeSnackbar = () => {
        setOpenSnackbarHigh(false)
    }

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
        // Move the project to trash 
        moveProjectToTrashService.call([project.id])
        window.history.back()
    }

    /**
     * Mark the project as important or un-important
     */
    const toggleHighPriorityProjects = () => {
        toggleHighPriorityService.call({ id: project.id, priority: !project.priority })
        // setRefresh(prev => !prev) // not passed like other props
        window.location.reload()
    }

    /**
     * Refresh page
     */
    const handleRefresh = () => {
        window.location.reload()
    }

    /**
     * Open breathing exercise dialog and close the snackbar
     */
    const openBreathingExercise = () => {
        setOpenExercise(true)
        setOpenSnackbarHigh(false)
    }

    return (
        <Box style = {
                openSidebar 
                ? {
                    marginLeft: 158, 
                    marginRight: 30,
                    width: "calc(100% - 188px)",  // -188 px for sidebar's width + space for shadow
                    // Adaptive shadow colour according to different stress levels
                    height: "calc(100vh - 70px)", // -70px for header's height,
                    boxShadow: `0px 0px 10px 2px ${
                        stressLevel === "low" 
                        ? Colours.lowStressShadow 
                        : stressLevel === "medium"
                        ? Colours.mediumStressShadow
                        : stressLevel === "high" 
                        ? Colours.highStressShadow
                        : Colours.normalShadow
                    }`, 
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    background: Colours.container
                } 
                : {
                    marginLeft: 30, 
                    marginRight: 30,
                    width: "calc(100% - 60px)",
                    // Adaptive shadow colour according to different stress levels
                    height: "calc(100vh - 70px)",
                    boxShadow: `0px 0px 10px 2px ${
                        stressLevel === "low" 
                        ? Colours.lowStressShadow 
                        : stressLevel === "medium"
                        ? Colours.mediumStressShadow
                        : stressLevel === "high" 
                        ? Colours.highStressShadow
                        : Colours.normalShadow
                    }`, 
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    background: Colours.container
                }
            } 
        >
            {/* Back and refresh buttons */}
            <IconWrapper>
                <Tooltip title = "Back">
                    <IconButton onClick = { () => window.history.back() }>
                        <ArrowLeft size = {20} aria-label = "back" />
                    </IconButton>
                </Tooltip>
                    
                <Tooltip title = "Refresh">
                    <span style = {{ marginLeft: "auto", marginRight: 15 }}>
                        <IconButton onClick = { handleRefresh }>
                            <ArrowClockwise size = {20} color = "#000" aria-label = "refresh" />
                        </IconButton>
                    </span>
                </Tooltip>
            </IconWrapper>

            <main>
                {/* Project title, indicator, bookmark button, edit project button, and delete project button */}
                <Subject>
                    {project.title}
                    
                        <Indicator sx = {{ backgroundColor: indicatorColor }}>
                            <CircleFill size = {10} color = { circleColor } style = {{ marginRight: 5 }} />
                            {project.status}
                        </Indicator>
                    
                    { project.priority === true
                        ? <IconButton onClick = { toggleHighPriorityProjects } style = {{ margin: "0 10px" }}>
                            <BookmarkFill size = {20} color = {Colours.bookmark} aria-label = "bookmark" />
                        </IconButton>
                        : <IconButton onClick = { toggleHighPriorityProjects } style = {{ margin: "0 10px" }}>
                            <Bookmark size = {20} aria-label = "bookmark" />
                        </IconButton>
                    }

                    <Tooltip title = "Update">
                        <IconButton onClick = { updateProject }>
                            <Pencil size = {20} aria-label = "update" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title = "Delete">
                        <span style = {{ marginLeft: "auto", marginRight: 40 }}>
                            <IconButton onClick = { deleteProject }>
                                <Trash3 size = {20} color = { Colours.error } aria-label = "delete" />
                            </IconButton>
                        </span>
                    </Tooltip>
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

                    <Tooltip title = "Create task">
                        <IconButton onClick = { createNewTask } sx = {{ alignSelf: "center", marginTop: 1 }}>
                            <PlusCircle size = {25} color = "#79747E" aria-label = "create" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </main>

            {/* Snackbar to show when high stress levels are detected */}
            { stressLevel === "high"
                ? <Snackbar
                    open = { openSnackbarHigh }
                    autoHideDuration = { 7000 }
                    onClose = { closeSnackbar }
                    slot = {{ transition: <Fade/> }}
                    anchorOrigin = {{ vertical: "bottom", horizontal: "right" }}
                    action = {
                        <Fragment>
                            <Button 
                                sx = {{ textTransform: "none", fontSize: 14, color: Colours.selectedType }}
                                onClick = { openBreathingExercise }
                            >
                                Try a breathing exercise
                            </Button>
                            <IconButton onClick = { closeSnackbar } aria-label = "close">
                                <X color = "#FFF" aria-label = "close" />
                            </IconButton>
                        </Fragment>
                    }
                    message = "High stress levels detected! Take a short break or"
                />
            : <></>
            }

            {/* Breathing exercise dialog */}
            <ExerciseModal
                openExercise = { openExercise }
                setOpenExercise = { setOpenExercise }
            />

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