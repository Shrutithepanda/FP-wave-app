import { Box, IconButton, styled, Typography } from "@mui/material"
import { Arrow90degLeft, ArrowClockwise, ArrowLeft, Bookmark, BookmarkFill, CaretLeft, CircleFill, PersonCircle, PlusCircle, Trash3 } from "react-bootstrap-icons"
import { useLocation, useOutletContext } from "react-router-dom"
import { useAuth } from "../hooks/AuthProvider"
import useApi from "../hooks/useApi"
import { EMAIL_API_URLS, TASK_API_URLS } from "../services/api.urls"
import { useEmotion } from "../hooks/EmotionProvider"
import { useEffect } from "react"
import { useState } from "react"
import ComposeTask from "../customComponents/ComposeTask"
import { Colours } from "../constants/colours"

const IconWrapper = styled(Box) ({
    padding: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
})

const Subject = styled(Box) ({
    fontSize: 22,
    margin: "10px 0 20px 65px",
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
    marginLeft: 15,
    width: "100%",
    // display: "flex",
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

const ViewTask = () => {
    const [indicatorColor, setIndicatorColor] = useState(Colours.notStartedBg)
    const [circleColor, setCircleColor] = useState(Colours.notStartedCircle)

    const [openDialog, setOpenDialog] = useState(false)
    const createNewTask = () => setOpenDialog(true)

    const { openSidebar } = useOutletContext()

    const { stressed } = useEmotion()

    // Extract the email from the router's state
    const { state } = useLocation()
    const { project } = state

    const moveProjectToTrashService = useApi(TASK_API_URLS.moveProjectToTrash)
    const toggleHighPriorityService = useApi(TASK_API_URLS.toggleHighPriorityProjects)

    const deleteEmail = () => {
        moveProjectToTrashService.call([project.id])
        window.history.back()
    }

    const toggleHighPriorityProjects = () => {
        toggleHighPriorityService.call({ id: project.id, priority: !project.priority })
        // setRefresh(prevState => !prevState)
        window.location.reload()
    }

    const handleRefresh = () => {
        window.location.reload()
    }

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

    useEffect(() => {
        changeIndicatorColor()
    }, [])

    return (
        <Box style = {
                openSidebar 
                ? {
                    marginLeft: 158, 
                    marginRight: 30,
                    width: "calc(100% - 188px)",  // -158 px for sidebar's width + space for shadow, marginLeft prev. -> 150
                    boxShadow: `2px 0px 10px 2px ${stressed ? "lightgreen" : Colours.normalShadow}`, 
                    height: "calc(100vh - 70px)", // -70px for header's height,
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    background: "#F9F9F9"
                } 
                : {
                    marginLeft: 30, 
                    marginRight: 30,
                    width: "calc(100% - 60px)",
                    boxShadow: `2px 0px 10px 2px ${stressed ? "lightgreen" : Colours.normalShadow}`, 
                    height: "calc(100vh - 70px)",
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    background: "#F9F9F9"
                }
            } 
        >
            <IconWrapper>
                <IconButton onClick = {() => window.history.back()}>
                    <ArrowLeft size = {20} aria-label = "back" />
                </IconButton>
                    
                <span style = {{marginLeft: "auto", marginRight: 15}}>
                    <IconButton onClick = {handleRefresh}>
                        <ArrowClockwise size = {20} color = "black" aria-label = "reload" />
                    </IconButton>
                </span>
            </IconWrapper>

            <Subject>
                {project.title}
                
                <Indicator 
                    sx = {{backgroundColor: indicatorColor}} 
                >
                    <CircleFill size = {10} color = {circleColor} style = {{marginRight: 5}} />
                    {project.status}
                    </Indicator>
                
                {project.priority === true
                    ? <IconButton onClick = {() => toggleHighPriorityProjects()} style = {{marginLeft: 10}}>
                        <BookmarkFill size = {20} color = {Colours.bookmark} />
                    </IconButton>
                    : <IconButton onClick = {() => toggleHighPriorityProjects()} style = {{marginLeft: 10}}>
                        <Bookmark size = {20} />
                    </IconButton>
                }
                <span style = {{marginLeft: "auto", marginRight: 40}}>
                    <IconButton onClick = {() => deleteEmail()}>
                        <Trash3 size = {20} color = {Colours.error} />
                    </IconButton>
                </span>
            </Subject>
            <Box style = {{display: "flex"}} >
                <Container>
                    <Box style = {{display: "flex", flexDirection: "row", alignItems: "center"}}>
                        <Typography style = {{marginTop: 10, marginLeft: 50}} >
                            {project.description}
                        </Typography>
                        <Date>
                            {(new window.Date(project.due_date)).getDate()}&nbsp;
                            {(new window.Date(project.due_date)).toLocaleDateString("default", {month: "short"})}&nbsp;
                            {(new window.Date(project.due_date)).getFullYear()},&nbsp;
                            {(new window.Date(project.due_date)).toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit"})}
                        </Date>
                    </Box>
                </Container>
            </Box>

            <Box sx = {{marginLeft: 8}}>
                <Typography style = {{marginTop: 20}} >Tasks come here</Typography>
                <IconButton>
                    <PlusCircle size = {25} color = "#79747E" onClick = {() => createNewTask()} />
                </IconButton>
            </Box>

            <ComposeTask openDialog = {openDialog} setOpenDialog = {setOpenDialog} />
        </Box>
    )
}

export default ViewTask